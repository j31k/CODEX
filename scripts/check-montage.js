#!/usr/bin/env node
/*
 * Scans public/video-montage/ for the three demo clips and writes src/montage.json.
 * Matching: filename keywords first (souls/dark/ds, kart/mario/mk, anim/js),
 * otherwise sorted order maps to [souls, kart, js].
 * Runs automatically before `npm run dev` and `npm run render`.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'public', 'video-montage');
const OUT = path.join(ROOT, 'src', 'montage.json');

const VIDEO_EXT = new Set(['.mp4', '.mov', '.webm', '.mkv', '.avi', '.m4v']);

const result = {souls: null, kart: null, js: null};

if (fs.existsSync(DIR)) {
  const files = fs
    .readdirSync(DIR)
    .filter((f) => VIDEO_EXT.has(path.extname(f).toLowerCase()))
    .sort();

  const byName = {souls: null, kart: null, js: null};
  const rest = [];
  for (const f of files) {
    const n = f.toLowerCase();
    if (/(souls|dark|ds|дс|соулс)/.test(n)) byName.souls = byName.souls || f;
    else if (/(kart|mario|mk|карт|марио)/.test(n)) byName.kart = byName.kart || f;
    else if (/(anim|js|script|аним)/.test(n)) byName.js = byName.js || f;
    else rest.push(f);
  }
  // fill gaps from unmatched files in sorted order
  for (const key of ['souls', 'kart', 'js']) {
    if (!byName[key] && rest.length) byName[key] = rest.shift();
  }
  for (const key of ['souls', 'kart', 'js']) {
    if (byName[key]) result[key] = `video-montage/${byName[key]}`;
  }
  console.log('[montage] found:', JSON.stringify(result, null, 2));
} else {
  console.log('[montage] public/video-montage/ not found — using coded demo fallbacks');
}

fs.writeFileSync(OUT, JSON.stringify(result, null, 2));
