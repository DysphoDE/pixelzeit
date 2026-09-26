/* PIXELZEIT – Pixel-Art: prozedurale Icons und handgezeichnete Bosse */
(function () {
  'use strict';
  const PZ = (window.PZ = window.PZ || {});
  const SPR = (PZ.SPR = {});
  const cache = {};

  // ───────── Raster-Helfer ─────────
  function grid(w, h) { return { w: w, h: h, d: new Array(w * h).fill(null) }; }
  function set(g, x, y, c) { if (x >= 0 && y >= 0 && x < g.w && y < g.h) g.d[y * g.w + x] = c; }
  function get(g, x, y) { return x >= 0 && y >= 0 && x < g.w && y < g.h ? g.d[y * g.w + x] : null; }
  function rect(g, x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(g, x + i, y + j, c); }
  function inPoly(px, py, pts) {
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }
  function poly(g, pts, c) {
    for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) if (inPoly(x + 0.5, y + 0.5, pts)) set(g, x, y, typeof c === 'function' ? c(x, y) : c);
  }
  function circle(g, cx, cy, r, c) {
    for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
      if (dx * dx + dy * dy <= r * r) set(g, x, y, typeof c === 'function' ? c(x, y) : c);
    }
  }
  function ring(g, cx, cy, r1, r2, c) {
    for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy, d = dx * dx + dy * dy;
      if (d <= r2 * r2 && d >= r1 * r1) set(g, x, y, c);
    }
  }
  function line(g, x0, y0, x1, y1, c) {
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      set(g, x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }
  function outline(g, c) {
    const add = [];
    for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) {
      if (get(g, x, y)) continue;
      if (get(g, x - 1, y) || get(g, x + 1, y) || get(g, x, y - 1) || get(g, x, y + 1)) add.push([x, y]);
    }
    add.forEach(([x, y]) => set(g, x, y, c));
  }
  function fromMap(rows, pal, mirror) {
    const full = mirror ? rows.map((r) => r + r.split('').reverse().join('')) : rows;
    const g = grid(full[0].length, full.length);
    full.forEach((row, y) => row.split('').forEach((ch, x) => { if (ch !== '.' && pal[ch]) set(g, x, y, pal[ch]); }));
    return g;
  }

  function toCanvas(g, scale) {
    const c = document.createElement('canvas');
    c.width = g.w * scale; c.height = g.h * scale;
    const ctx = c.getContext('2d');
    for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) {
      const col = g.d[y * g.w + x];
      if (col) { ctx.fillStyle = col; ctx.fillRect(x * scale, y * scale, scale, scale); }
    }
    return c;
  }

  const K = '#140c1c';

  // ───────── Prozedurale Icons (16×16) ─────────
  const ICONS = {
    coin(g) {
      circle(g, 8, 8, 6.6, '#e39a19');
      circle(g, 8, 8, 5.6, '#ffd23f');
      ring(g, 8, 8, 3.6, 4.4, '#f0b429');
      rect(g, 7, 5, 2, 6, '#c77d0e');
      set(g, 5, 4, '#fff6c2'); set(g, 4, 5, '#fff6c2'); set(g, 6, 3, '#fff6c2');
      outline(g, K);
    },
    bolt(g) {
      poly(g, [[10, 0.5], [3, 9], [7.5, 9], [5, 15.5], [13, 6], [8.5, 6], [11.5, 0.5]], (x, y) => (y < 7 ? '#fff27a' : '#ffc21a'));
      outline(g, K);
    },
    star(g) {
      const pts = [];
      for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 3.2 : 7.4; pts.push([8 + Math.cos(a) * r, 8.4 + Math.sin(a) * r]); }
      poly(g, pts, (x, y) => (y < 7 ? '#fff27a' : '#ffc21a'));
      set(g, 6, 7, K); set(g, 9, 7, K); set(g, 6, 8, K); set(g, 9, 8, K);
      outline(g, K);
    },
    starpower(g) {
      const pts = [];
      for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 3.2 : 7.4; pts.push([8 + Math.cos(a) * r, 8.4 + Math.sin(a) * r]); }
      const rb = ['#ff3b3b', '#ff8a1f', '#ffe23b', '#4bff6b', '#3bb4ff', '#b45cff'];
      poly(g, pts, (x, y) => rb[Math.min(5, Math.floor((x + y) / 5.2))]);
      set(g, 6, 7, K); set(g, 9, 7, K); set(g, 6, 8, K); set(g, 9, 8, K);
      outline(g, K);
    },
    heart(g) {
      for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
        const X = (x + 0.5 - 8) / 6.4, Y = -(y + 0.5 - 8.2) / 5.9;
        const v = Math.pow(X * X + Y * Y - 1, 3) - X * X * Y * Y * Y;
        if (v <= 0) set(g, x, y, y < 7 ? '#ff5c7a' : '#e8243c');
      }
      set(g, 4, 4, '#ffd0d8'); set(g, 5, 4, '#ffd0d8'); set(g, 4, 5, '#ffd0d8');
      outline(g, K);
    },
    chest(g) {
      rect(g, 2, 6, 12, 8, '#8a4b1f');
      rect(g, 2, 3, 12, 4, '#b8672a');
      rect(g, 2, 7, 12, 1, '#5a2e10');
      rect(g, 2, 3, 1, 11, '#ffd23f'); rect(g, 13, 3, 1, 11, '#ffd23f');
      rect(g, 7, 6, 2, 3, '#ffd23f'); set(g, 7, 8, K);
      rect(g, 3, 4, 10, 1, '#d98a45');
      outline(g, K);
    },
    glitch(g) {
      const cols = ['#ff2bd6', '#2bfff1', '#7dff2b', '#ffffff', '#1b1b3a'];
      let s = 7;
      for (let y = 1; y < 15; y++) for (let x = 1; x < 15; x++) {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        if ((s >> 8) % 7 !== 0) set(g, x, y, cols[(s >> 4) % 5]);
      }
      rect(g, 1, 6, 14, 2, '#ff2bd6');
      outline(g, K);
    },
    cursor(g) {
      poly(g, [[3, 1], [3, 13.5], [6, 10.5], [8.5, 15], [10.5, 14], [8.2, 9.8], [12.5, 9.8]], '#ffffff');
      outline(g, K);
    },
    chip(g) {
      rect(g, 3, 3, 10, 10, '#2c9a5a');
      rect(g, 5, 5, 6, 6, '#1a1a24');
      rect(g, 6, 6, 2, 2, '#4a4a60');
      for (let i = 4; i < 13; i += 2) { set(g, i, 1, '#d9dde8'); set(g, i, 2, '#d9dde8'); set(g, i, 13, '#d9dde8'); set(g, i, 14, '#d9dde8'); set(g, 1, i, '#d9dde8'); set(g, 2, i, '#d9dde8'); set(g, 13, i, '#d9dde8'); set(g, 14, i, '#d9dde8'); }
      outline(g, K);
    },
    link(g) {
      ring(g, 5.5, 8, 2, 3.8, '#d9dde8');
      ring(g, 10.5, 8, 2, 3.8, '#aab2c4');
      outline(g, K);
    },
    flame(g) {
      poly(g, [[8, 0.5], [13, 7], [13.5, 11], [11, 15], [5, 15], [2.5, 11], [3, 7], [5.5, 4], [6.5, 7]], '#ff5a1f');
      poly(g, [[8.5, 5], [11, 10], [10, 14], [6, 14], [5, 10.5], [7, 9]], '#ffb21f');
      poly(g, [[8, 9.5], [9.5, 12], [8.8, 14], [7, 14], [6.8, 12]], '#fff27a');
      outline(g, K);
    },
    crit(g) {
      const pts = [];
      for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, r = i % 2 ? 3.2 : 7.6; pts.push([8 + Math.cos(a) * r, 8 + Math.sin(a) * r]); }
      poly(g, pts, '#ff3b3b');
      circle(g, 8, 8, 3, '#ffe23b');
      outline(g, K);
    },
    sword(g) {
      for (let i = 0; i < 9; i++) { set(g, 5 + i, 10 - i, '#e6ecf5'); set(g, 6 + i, 10 - i, '#aab4c6'); set(g, 5 + i, 9 - i, '#ffffff'); }
      line(g, 2, 9, 7, 14, '#ffd23f'); line(g, 3, 9, 7, 13, '#e39a19');
      line(g, 1, 14, 4, 11, '#8a4b1f'); set(g, 1, 15, '#ffd23f');
      outline(g, K);
    },
    trophy(g) {
      rect(g, 4, 2, 8, 6, '#ffd23f');
      rect(g, 5, 8, 6, 1, '#ffd23f');
      rect(g, 6, 9, 4, 1, '#e39a19');
      rect(g, 7, 10, 2, 2, '#e39a19');
      rect(g, 4, 12, 8, 2, '#8a4b1f');
      ring(g, 3.5, 5, 1.2, 2.3, '#e39a19'); ring(g, 12.5, 5, 1.2, 2.3, '#e39a19');
      rect(g, 5, 3, 1, 3, '#fff6c2');
      outline(g, K);
    },
    disk(g) {
      rect(g, 2, 2, 12, 12, '#2d5bd7');
      rect(g, 5, 2, 6, 4, '#cfd6e3'); rect(g, 8, 3, 2, 2, '#5a6478');
      rect(g, 4, 8, 8, 5, '#f4f1e8'); rect(g, 5, 9, 6, 1, '#e8243c'); rect(g, 5, 11, 5, 1, '#8b93a7');
      outline(g, K);
    },
    clock(g) {
      circle(g, 8, 8, 6.6, '#f4f1e8');
      ring(g, 8, 8, 5.6, 6.6, '#43a8ff');
      rect(g, 7, 4, 2, 5, K); rect(g, 8, 7, 4, 2, K);
      outline(g, K);
    },
    cart(g) {
      poly(g, [[1.5, 8.5], [8, 2], [14.5, 2], [14.5, 8.5], [8, 15]], '#ffd23f');
      poly(g, [[3.5, 8.5], [8.5, 3.5], [8.5, 5], [5, 8.5]], '#fff6c2');
      circle(g, 11.5, 5, 1.3, K);
      set(g, 6, 9, '#c77d0e'); set(g, 7, 10, '#c77d0e'); set(g, 8, 11, '#c77d0e'); set(g, 9, 8, '#c77d0e'); set(g, 10, 9, '#c77d0e');
      outline(g, K);
    },
    tape(g) {
      rect(g, 1, 3, 14, 10, '#3a3450');
      rect(g, 3, 5, 10, 4, '#f4f1e8');
      circle(g, 5.5, 7, 1.4, '#3a3450'); circle(g, 10.5, 7, 1.4, '#3a3450');
      rect(g, 4, 10, 8, 3, '#6d6488');
      rect(g, 3, 4, 10, 1, '#b45cff');
      outline(g, K);
    },
    skull(g) {
      circle(g, 8, 7, 5.6, '#f4f1e8');
      rect(g, 5, 10, 6, 4, '#f4f1e8');
      rect(g, 5, 6, 2, 3, K); rect(g, 9, 6, 2, 3, K);
      set(g, 7, 12, K); set(g, 9, 12, K); set(g, 8, 9, '#8b93a7');
      outline(g, K);
    },
    gem(g) {
      poly(g, [[4, 2], [12, 2], [15, 6], [8, 15], [1, 6]], '#5cffe8');
      poly(g, [[4, 2], [8, 2], [6, 6], [1, 6]], '#c9fff7');
      poly(g, [[1, 6], [15, 6], [8, 15]], '#23c4b3');
      outline(g, K);
    },
  };

  // ───────── Bosse (gespiegelte 8-Pixel-Hälften → 16×16) ─────────
  const BOSSES = {
    boss_blob: { pal: { k: K, g: '#39d353', G: '#b6ffb0', w: '#ffffff' }, rows: [
      '........', '........', '......kk', '....kkgg', '...kgggg', '..kgGGgg', '..kgGggg', '.kgggggg',
      '.kggwwkg', '.kggwkkg', '.kgggggg', '.kggggkk', '.kgggggg', '..kggggg', '...kkkkk', '........'] },
    boss_ship: { pal: { k: K, p: '#9b4dff', P: '#d2b0ff', c: '#39e6ff', C: '#c8fbff', y: '#ffe23b', r: '#ff3b6b' }, rows: [
      '........', '........', '........', '.....kkk', '....kccc', '...kcCcc', '..kkkkkk', '.kpppppp',
      'kpPPpPPp', 'kpyppypp', '.kpppppp', '..kkkkkk', '...r..rr', '...r...r', '..r....r', '........'] },
    boss_dust: { pal: { k: K, d: '#8c8ca0', D: '#c9c9d8', w: '#ffffff', r: '#ff3b3b' }, rows: [
      '........', '....d.d.', '..d.dddd', '...ddDDd', '.dddDDdd', '..dddkkd', '.ddddwwk', 'dddwwrkd',
      '.ddwwkkd', 'dddddddd', '.ddkkkkk', 'ddkdkdkd', '.ddddddd', '..dddddd', '...d.dd.', '........'] },
    boss_dragon: { pal: { k: K, r: '#e8243c', R: '#9c1026', o: '#ff8a1f', y: '#ffe23b', w: '#ffffff' }, rows: [
      'k.......', 'ok......', 'rok.....', '.rrk..kk', '.krrkkrr', '..krrrrr', '..krRrrr', '.kryykrr',
      '.krykkrr', '..krrrrr', '..kRRooo', '.krrkkkk', '.krwkwkw', '..krrrrr', '...kkkkk', '........'] },
    boss_golem: { pal: { k: K, t: '#1fa99b', T: '#7ff0e3', y: '#ffe23b' }, rows: [
      '........', '....kkkk', '...kTTtt', '...ktyyt', '...ktttt', '....kkkk', '.kkkTTtt', 'kTTkTttt',
      'kTtkTttt', 'kttkttkt', 'kttktttt', '.kkkttkk', '...kttk.', '...kttk.', '..kkkkk.', '........'] },
    boss_lag: { pal: { k: K, p: '#7a3cff', P: '#b48cff', y: '#ffe23b', w: '#ffffff', o: '#ff8a1f' }, rows: [
      '..k.....', '..pk....', '..ppk...', '...kkkkk', '..kppppp', '.kppyykp', '.kpppppp', '.kppkkkk',
      '..kpppwp', '...kkkkk', '..kPPkwk', '.kPPPkok', '.kPPkwwk', '..kkk.kk', '........', '........'] },
    boss_rrod: { pal: { k: K, g: '#c9ced9', w: '#f4f6fa', r: '#ff2b2b' }, rows: [
      '........', '.....kkk', '...kkggg', '..kgrrrr', '.kgrkkkk', '.kgrkwww', 'kgrkwkkw', 'kgrkwwkw',
      'kgrkwwww', 'kgrkwkkk', '.kgrkwww', '.kgrkkkk', '..kgrrrr', '...kkggg', '.....kkk', '........'] },
    boss_mimic: { pal: { k: K, b: '#8a4b1f', B: '#c07a3a', y: '#ffd23f', w: '#ffffff', r: '#ff5c7a', m: '#2a0a12', e: '#ff2b2b' }, rows: [
      '........', '..kkkkkk', '.kBBBBBB', '.kByyByy', '.kbbbeeb', '.kbbbbbb', '.kwkwkwk', '.kmmmmmm',
      '.kmmrrrr', '.kmmrrrm', '.kwkwkwk', '.kbbbybb', '.kbbbybb', '.kkkkkkk', '........', '........'] },
    boss_scalper: { pal: { k: K, s: '#9aa4b4', S: '#dfe4ee', g: '#39d353', r: '#ff3b3b', y: '#ffe23b' }, rows: [
      '.......k', '.......y', '.......k', '..kkkkkk', '.kSSSSSS', '.kSsssss', '.ksgggss', '.ksgkgss',
      '.ksgggss', '.kssssss', '.ksrrrrr', '.kssssss', '..kkkkkk', '....kssk', '..kkssss', '..kkkkkk'] },
    boss_ai: { pal: { k: K, c: '#39e6ff', C: '#b8f7ff', b: '#1b3a8a', w: '#ffffff', m: '#ff5cf0' }, rows: [
      '........', '....kkkk', '..kkbbbb', '.kbbcccc', '.kbcCCCC', 'kbcCwwww', 'kbcwwkkk', 'kbcwwkmm',
      'kbcwwkmm', 'kbcwwkkk', 'kbcCwwww', '.kbcCCCC', '.kbbcccc', '..kkbbbb', '....kkkk', '........'] },
    boss_bug: { pal: { k: K, g: '#2fbf5a', G: '#a6ffb9', y: '#ffd23f', r: '#ff3b3b' }, rows: [
      '....y..y', '....yyyy', '...kkkkk', 'k..krkkk', '.k.kkkkk', '..kkgggg', '.kgGGggg', 'kkgGgggk',
      '.kgggggk', 'kkgggggk', '.kgggggk', 'kkgggggk', '..kggggk', '...kkkkk', '........', '........'] },
    boss_crunch: { pal: { k: K, w: '#f4f1e8', r: '#e8243c', y: '#ffd23f' }, rows: [
      '.yy.....', 'yyyk....', '.yykkkkk', '..krrrrr', '.krwwwww', 'krwwwwwk', 'krwkkwwk', 'krwwkwwk',
      'krwwwwwk', 'krwwkkkk', 'krwkwwww', '.krwwwww', '..krrrrr', '..kk..kk', '........', '........'] },
  };

  /** Liefert eine Data-URL für ein Sprite. */
  SPR.url = function (name, scale) {
    scale = scale || 4;
    const key = name + '@' + scale;
    if (cache[key]) return cache[key];
    let g;
    if (ICONS[name]) { g = grid(16, 16); ICONS[name](g); }
    else if (BOSSES[name]) { const b = BOSSES[name]; g = fromMap(b.rows, b.pal, true); }
    else { g = grid(16, 16); ICONS.coin(g); }
    const url = toCanvas(g, scale).toDataURL();
    cache[key] = url;
    return url;
  };
  SPR.img = function (name, cls, scale) {
    return '<img class="spr ' + (cls || '') + '" src="' + SPR.url(name, scale) + '" alt="" draggable="false">';
  };
  SPR.names = function () { return Object.keys(ICONS).concat(Object.keys(BOSSES)); };
  // für Vorschau-Tests
  SPR._raw = { ICONS, BOSSES, grid, fromMap };
})();
