const fs = require('fs');
const html = fs.readFileSync('C:/Users/wwwam/.gemini/antigravity-ide/brain/74d6e878-2fbd-4416-a8e1-e4702373adfa/.system_generated/steps/9/content.md', 'utf8');

const imgs = [...new Set(html.match(/https:\/\/play-lh\.googleusercontent\.com\/[a-zA-Z0-9_\-]+/g) || [])];
console.log('Images:', imgs.slice(0, 15));

// search for strings like "About this app", feature text, etc.
const keywords = ['About this app', 'party', 'hangout', 'vibe', 'signup', 'login', 'terms', 'privacy', 'step', 'college', 'friends'];
for (const kw of keywords) {
  let idx = 0;
  while ((idx = html.indexOf(kw, idx)) !== -1) {
    console.log(`Found "${kw}" at ${idx}:`, html.substring(Math.max(0, idx - 50), idx + 200).replace(/\s+/g, ' '));
    idx += kw.length + 500;
  }
}
