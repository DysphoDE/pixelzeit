#!/usr/bin/env node
/* PIXELZEIT – Build: erzeugt js/credits.js und dist/pixelzeit.html (Artifact-Fragment) samt Dateiliste */
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const rd = (p) => fs.readFileSync(path.join(root, p), 'utf8');

// 1) Credits als JS (funktioniert auch per file://)
const readJson = (p) => { try { return JSON.parse(rd(p)); } catch (e) { return []; } };
const images = readJson('assets/credits/images.json');
const audio = readJson('assets/credits/audio.json');
fs.writeFileSync(path.join(root, 'js/credits.js'),
  '/* automatisch erzeugt von tools/build.js */\nwindow.PZ = window.PZ || {};\nPZ.CREDITS = ' + JSON.stringify({ images, audio }) + ';\n');

// 2) Artifact-Fragment
const html = rd('index.html');
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1]
  .replace(/<meta charset[^>]*>\s*/i, '')
  .replace(/<meta name="viewport"[^>]*>\s*/i, '');
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
const title = head.match(/<title>[\s\S]*?<\/title>/)[0];
const rest = head.replace(title, '').trim();
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/pixelzeit.html'), title + '\n' + rest + '\n' + body.trim() + '\n');

// 3) Dateiliste für die Veröffentlichung
const files = {};
const walk = (dir) => {
  for (const f of fs.readdirSync(path.join(root, dir))) {
    const rel = path.join(dir, f);
    const st = fs.statSync(path.join(root, rel));
    if (st.isDirectory()) walk(rel);
    else if (!/credits\/.*\.json$/.test(rel)) files[rel.split(path.sep).join('/')] = rel.split(path.sep).join('/');
  }
};
['css', 'js', 'assets'].forEach(walk);
fs.writeFileSync(path.join(root, 'dist/files.json'), JSON.stringify(files, null, 1));
let total = 0;
for (const k in files) total += fs.statSync(path.join(root, files[k])).size;
console.log('Dateien:', Object.keys(files).length, '· Größe:', (total / 1048576).toFixed(2), 'MB');
