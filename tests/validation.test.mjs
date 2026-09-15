import assert from 'node:assert/strict';
import { STATES_DATA } from '../src/data/locationData.js';

console.log('🧪 Starting Extroverts Signup Wizard Automated Test Suite...\n');

// 1. EMAIL VALIDATION TESTS
console.log('▶ Testing Email Validation Logic...');
function validateEmail(email) {
  const trimmed = (email || '').replace(/\s/g, '').toLowerCase();
  if (!trimmed) return { valid: false, error: 'Email is required' };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Invalid email format' };
  }
  return { valid: true, sanitized: trimmed };
}

assert.equal(validateEmail('').valid, false);
assert.equal(validateEmail('invalid-email').valid, false);
assert.equal(validateEmail('missing@domain').valid, false);
assert.equal(validateEmail('user@campus.edu').valid, true);
assert.equal(validateEmail('  USER@Gmail.COM ').sanitized, 'user@gmail.com');
console.log('✔ Email validation tests passed.');

// 2. PASSWORD VALIDATION TESTS
console.log('\n▶ Testing Password Validation Logic...');
function validatePassword(password) {
  if (!password) return { valid: false, error: 'Password is required' };
  if (password.length < 6) return { valid: false, error: 'Min 6 characters' };
  return { valid: true };
}

assert.equal(validatePassword('').valid, false);
assert.equal(validatePassword('12345').valid, false);
assert.equal(validatePassword('secret123').valid, true);
console.log('✔ Password validation tests passed.');

// 3. AGE CALCULATION & LEGAL GUARDRAIL (<18) TESTS
console.log('\n▶ Testing Age Calculation & Under-18 Guardrails...');
function calculateAge(dobString, referenceDate = new Date()) {
  const birthDate = new Date(dobString);
  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const m = referenceDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && referenceDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function evaluateAgeCompliance(age, hasParentConsent = false) {
  if (age === null || age === undefined || isNaN(age)) {
    return { allowed: false, reason: 'Invalid DOB' };
  }
  if (age < 0) {
    return { allowed: false, reason: 'Future DOB not allowed' };
  }
  if (age < 18) {
    if (!hasParentConsent) {
      return { allowed: false, promptWarning: true, reason: 'Extroverts requires 18+ or parental guardian consent.' };
    }
    return { allowed: true, promptWarning: true, reason: 'Allowed with parental consent' };
  }
  return { allowed: true, promptWarning: false, reason: 'Age compliant (18+)' };
}

// Test adult age
const adultDob = '2000-05-15';
const adultAge = calculateAge(adultDob, new Date('2026-09-15'));
assert.equal(adultAge, 26);
assert.equal(evaluateAgeCompliance(adultAge).allowed, true);
assert.equal(evaluateAgeCompliance(adultAge).promptWarning, false);

// Test minor age (e.g. 16 years old)
const minorDob = '2010-01-01';
const minorAge = calculateAge(minorDob, new Date('2026-09-15'));
assert.equal(minorAge, 16);
assert.equal(evaluateAgeCompliance(minorAge, false).allowed, false);
assert.equal(evaluateAgeCompliance(minorAge, false).promptWarning, true);
assert.equal(evaluateAgeCompliance(minorAge, true).allowed, true); // With consent

// Test exact boundary: 18th birthday today vs tomorrow
const exactly18Today = '2008-09-15';
assert.equal(calculateAge(exactly18Today, new Date('2026-09-15')), 18);
assert.equal(evaluateAgeCompliance(18).allowed, true);

const turns18Tomorrow = '2008-09-16';
assert.equal(calculateAge(turns18Tomorrow, new Date('2026-09-15')), 17);
assert.equal(evaluateAgeCompliance(17).allowed, false);
console.log('✔ Age calculation and <18 guardrail tests passed.');

// 4. PHONE NUMBER FORMAT TESTS
console.log('\n▶ Testing Indian Phone Number Validation...');
function validatePhone(phone) {
  const digits = (phone || '').replace(/\D/g, '').slice(0, 10);
  if (digits.length !== 10) return { valid: false, error: 'Must be 10 digits' };
  if (!/^[6-9]\d{9}$/.test(digits)) return { valid: false, error: 'Must start with 6-9' };
  return { valid: true, sanitized: digits };
}

assert.equal(validatePhone('12345').valid, false);
assert.equal(validatePhone('5551234567').valid, false); // doesn't start with 6-9
assert.equal(validatePhone('+91 98765-43210').valid, true);
assert.equal(validatePhone('9876543210').sanitized, '9876543210');
console.log('✔ Phone number validation tests passed.');

// 5. CROSS-FIELD CASCADING DEPENDENCY TESTS (State -> City -> College)
console.log('\n▶ Testing Cascading Location Hierarchy (State -> City -> College)...');
function getAvailableCities(stateId) {
  const state = STATES_DATA.find((s) => s.id === stateId);
  return state ? state.cities : [];
}

function getAvailableColleges(stateId, cityId) {
  const cities = getAvailableCities(stateId);
  const city = cities.find((c) => c.id === cityId);
  return city ? city.colleges : [];
}

// Check MP -> Bhopal -> MANIT
const mpCities = getAvailableCities('mp');
assert.ok(mpCities.some((c) => c.id === 'bhopal'));
assert.ok(mpCities.some((c) => c.id === 'indore'));

const bhopalColleges = getAvailableColleges('mp', 'bhopal');
assert.ok(bhopalColleges.includes('MANIT Bhopal (Maulana Azad NIT)'));
assert.ok(bhopalColleges.includes('LNCT Bhopal (Lakshmi Narain College)'));

// Check Maharashtra -> Mumbai -> IIT Bombay
const mhCities = getAvailableCities('mh');
assert.ok(mhCities.some((c) => c.id === 'mumbai'));
const mumbaiColleges = getAvailableColleges('mh', 'mumbai');
assert.ok(mumbaiColleges.includes('IIT Bombay'));

// Test state change reset
function handleStateChange(newState, currentState, currentCity, currentCollege) {
  if (newState !== currentState) {
    return {
      state: newState,
      city: '',
      college: ''
    };
  }
  return { state: currentState, city: currentCity, college: currentCollege };
}

const afterStateSwitch = handleStateChange('mh', 'mp', 'bhopal', 'MANIT Bhopal (Maulana Azad NIT)');
assert.equal(afterStateSwitch.state, 'mh');
assert.equal(afterStateSwitch.city, '');
assert.equal(afterStateSwitch.college, '');
console.log('✔ Cascading location and cross-field reset tests passed.');

// 6. OTP INPUT & SANITIZATION TESTS
console.log('\n▶ Testing OTP Handling Logic...');
function processOtpPaste(rawClipboard) {
  const numericOnly = (rawClipboard || '').replace(/\D/g, '');
  const digits = numericOnly.slice(0, 6).split('');
  const result = ['', '', '', '', '', ''];
  digits.forEach((d, idx) => {
    result[idx] = d;
  });
  return {
    values: result,
    isComplete: digits.length === 6,
    code: digits.join('')
  };
}

const pastedOtp = processOtpPaste('123-456');
assert.deepEqual(pastedOtp.values, ['1', '2', '3', '4', '5', '6']);
assert.equal(pastedOtp.isComplete, true);
assert.equal(pastedOtp.code, '123456');

const partialOtp = processOtpPaste('12ab3');
assert.deepEqual(partialOtp.values, ['1', '2', '3', '', '', '']);
assert.equal(partialOtp.isComplete, false);

console.log('✔ OTP input handling and clipboard paste tests passed.');

console.log('\n🎉 ALL EXTROVERTS SIGNUP WIZARD UNIT TESTS PASSED SUCCESSFULLY!\n');
