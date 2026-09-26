/* PIXELZEIT – animierte Hintergründe je Epoche */
(function () {
  'use strict';
  const PZ = (window.PZ = window.PZ || {});
  const BG = (PZ.BG = {});
  let cv, ctx, W = 0, H = 0, scale = 1, scene = null, sceneId = null, running = false;
  let intensity = 0, fade = 0, pendingScene = null, mood = 0;
  BG.enabled = true;
  BG.lowPower = false;

  const rnd = (a, b) => a + Math.random() * (b - a);

  // Pixel-Epochen werden in niedriger Auflösung gezeichnet
  const PIXEL = { phosphor: 3, starfield: 3, nes: 4, mode7: 3 };

  const SCENES = {};

  // ── Ära 0: Pong spielt sich selbst auf grünem Phosphor ──
  SCENES.phosphor = {
    init() { this.b = { x: W / 2, y: H / 2, vx: W * 0.28, vy: H * 0.21 }; this.p1 = H / 2; this.p2 = H / 2; this.s1 = 0; this.s2 = 0; },
    draw(t, dt) {
      ctx.fillStyle = '#020803'; ctx.fillRect(0, 0, W, H);
      const b = this.b, ph = Math.max(6, H * 0.12), pw = Math.max(2, W * 0.012), m = W * 0.06;
      const sp = 1 + intensity * 1.5;
      b.x += b.vx * dt * sp; b.y += b.vy * dt * sp;
      if (b.y < 2 || b.y > H - 4) { b.vy *= -1; b.y = Math.max(2, Math.min(H - 4, b.y)); }
      this.p1 += (b.y - this.p1) * Math.min(1, dt * 5); this.p2 += (b.y - this.p2) * Math.min(1, dt * 4.2);
      if (b.x < m + pw && b.vx < 0) { if (Math.abs(b.y - this.p1) < ph * 0.6) b.vx *= -1; }
      if (b.x > W - m - pw && b.vx > 0) { if (Math.abs(b.y - this.p2) < ph * 0.6) b.vx *= -1; }
      if (b.x < 0 || b.x > W) { if (b.x < 0) this.s2++; else this.s1++; b.x = W / 2; b.y = rnd(H * 0.2, H * 0.8); b.vx = (Math.random() < 0.5 ? -1 : 1) * W * 0.28; }
      ctx.fillStyle = 'rgba(57,255,136,0.22)';
      for (let y = 0; y < H; y += 8) ctx.fillRect(W / 2 - 1, y, 2, 4);
      ctx.fillStyle = 'rgba(57,255,136,0.5)';
      ctx.fillRect(m, this.p1 - ph / 2, pw, ph);
      ctx.fillRect(W - m - pw, this.p2 - ph / 2, pw, ph);
      ctx.fillRect(b.x - 2, b.y - 2, 4, 4);
      ctx.font = Math.floor(H * 0.1) + 'px monospace'; ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(57,255,136,0.25)';
      ctx.fillText(String(this.s1 % 100), W * 0.35, H * 0.16); ctx.fillText(String(this.s2 % 100), W * 0.65, H * 0.16);
    },
  };

  // ── Ära 1: Sternenfeld & Invasoren ──
  SCENES.starfield = {
    init() {
      this.stars = Array.from({ length: 120 }, () => ({ x: Math.random() * W, y: Math.random() * H, z: Math.random() }));
      this.inv = 0;
    },
    draw(t, dt) {
      ctx.fillStyle = '#07020f'; ctx.fillRect(0, 0, W, H);
      const sp = 1 + intensity * 3;
      for (const s of this.stars) {
        s.y += (8 + s.z * 30) * dt * sp;
        if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
        ctx.fillStyle = s.z > 0.7 ? '#ffffff' : s.z > 0.4 ? '#29d3ff' : '#ff3fa4';
        ctx.globalAlpha = 0.35 + s.z * 0.5;
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.z > 0.8 ? 2 : 1, s.z > 0.8 ? 2 : 1);
      }
      ctx.globalAlpha = 0.16;
      const INV = ['0010000100', '0001001000', '0011111100', '0110110110', '1111111111', '1011111101', '1010000101', '0001101100'];
      const cols = 6, cw = 14, off = Math.sin(t * 0.6) * W * 0.12, frame = Math.floor(t * 2) % 2;
      for (let c = 0; c < cols; c++) for (let r = 0; r < 2; r++) {
        const ox = W / 2 - (cols * cw) / 2 + c * cw + off, oy = H * 0.1 + r * 12;
        ctx.fillStyle = r === 0 ? '#ff3fa4' : '#29d3ff';
        INV.forEach((row, y) => { for (let x = 0; x < 10; x++) if (row[frame ? 9 - x : x] === '1') ctx.fillRect(ox + x, oy + y, 1, 1); });
      }
      ctx.globalAlpha = 1;
      // Neon-Horizont
      const g = ctx.createLinearGradient(0, H * 0.75, 0, H);
      g.addColorStop(0, 'rgba(255,63,164,0)'); g.addColorStop(1, 'rgba(255,63,164,0.25)');
      ctx.fillStyle = g; ctx.fillRect(0, H * 0.75, W, H * 0.25);
    },
  };

  // ── Ära 2: 8-Bit-Parallax-Landschaft ──
  SCENES.nes = {
    init() {
      this.x = 0;
      this.clouds = Array.from({ length: 5 }, (_, i) => ({ x: Math.random() * W, y: H * (0.1 + Math.random() * 0.3), w: 14 + Math.random() * 16 }));
    },
    draw(t, dt) {
      const sp = 1 + intensity * 3;
      this.x += dt * 14 * sp;
      ctx.fillStyle = '#10163a'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#1b2660'; ctx.fillRect(0, H * 0.35, W, H * 0.65);
      for (const c of this.clouds) {
        c.x -= dt * 3 * sp; if (c.x < -c.w * 2) c.x = W + c.w;
        ctx.fillStyle = 'rgba(120,150,255,0.28)';
        ctx.fillRect(Math.floor(c.x), Math.floor(c.y), c.w, 4);
        ctx.fillRect(Math.floor(c.x + 3), Math.floor(c.y - 3), c.w - 6, 3);
      }
      // Hügel
      ctx.fillStyle = '#123a2a';
      for (let x = 0; x < W; x++) {
        const hx = x + this.x * 0.3;
        const h = H * 0.62 + Math.sin(hx * 0.05) * 8 + Math.sin(hx * 0.013) * 12;
        ctx.fillRect(x, Math.floor(h), 1, H - h);
      }
      // Ziegelboden
      const by = Math.floor(H * 0.86), bs = 8;
      ctx.fillStyle = '#7a3a18'; ctx.fillRect(0, by, W, H - by);
      ctx.fillStyle = '#b8592a';
      for (let row = 0; row < Math.ceil((H - by) / bs); row++) {
        const ox = -((this.x + (row % 2) * bs / 2) % bs);
        for (let x = ox; x < W; x += bs) ctx.fillRect(Math.floor(x), by + row * bs, bs - 1, bs - 1);
      }
      // ?-Blöcke
      const qx = ((-this.x * 1.0) % (W + 80)) + W + 40;
      const bob = Math.floor(Math.sin(t * 4) * 1);
      for (let i = 0; i < 3; i++) {
        const x = Math.floor((qx + i * 10) % (W + 60)) - 30, y = Math.floor(H * 0.6) + bob;
        ctx.fillStyle = '#e39a19'; ctx.fillRect(x, y, 9, 9);
        ctx.fillStyle = '#ffd23f'; ctx.fillRect(x + 1, y + 1, 7, 7);
        ctx.fillStyle = '#7a3a18'; ctx.fillRect(x + 3, y + 2, 3, 1); ctx.fillRect(x + 5, y + 3, 1, 2); ctx.fillRect(x + 4, y + 5, 1, 1); ctx.fillRect(x + 4, y + 7, 1, 1);
      }
    },
  };

  // ── Ära 3: Mode-7-Boden ──
  SCENES.mode7 = {
    init() { this.a = 0; this.z = 0; },
    draw(t, dt) {
      const sp = 1 + intensity * 3;
      this.a += dt * 0.15 * sp; this.z += dt * 40 * sp;
      const hz = Math.floor(H * 0.45);
      const sky = ctx.createLinearGradient(0, 0, 0, hz);
      sky.addColorStop(0, '#060a2a'); sky.addColorStop(0.7, '#3a1a6a'); sky.addColorStop(1, '#ff7a3a');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, hz);
      ctx.fillStyle = '#ffd23f'; ctx.globalAlpha = 0.8;
      ctx.beginPath(); ctx.arc(W / 2, hz, H * 0.12, Math.PI, 0); ctx.fill(); ctx.globalAlpha = 1;
      const img = ctx.createImageData(W, H - hz);
      const ca = Math.cos(this.a), sa = Math.sin(this.a);
      for (let y = 0; y < H - hz; y++) {
        const dist = (H * 0.9) / (y + 1);
        for (let x = 0; x < W; x++) {
          const sx = (x - W / 2) * dist / W * 3;
          const wx = sx * ca - dist * sa, wy = sx * sa + dist * ca + this.z * 0.05;
          const chk = ((Math.floor(wx) + Math.floor(wy)) & 1);
          const fog = Math.min(1, y / (H - hz) * 1.6);
          const i = (y * W + x) * 4;
          img.data[i] = chk ? 30 * fog + 10 : 63 * fog;
          img.data[i + 1] = chk ? 60 * fog + 10 : 140 * fog;
          img.data[i + 2] = chk ? 140 * fog + 30 : 255 * fog;
          img.data[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, hz);
    },
  };

  // ── Ära 4: Low-Poly-Objekte ──
  function project(p, rot, cx, cy, s) {
    let [x, y, z] = p;
    let c = Math.cos(rot.y), si = Math.sin(rot.y);
    [x, z] = [x * c - z * si, x * si + z * c];
    c = Math.cos(rot.x); si = Math.sin(rot.x);
    [y, z] = [y * c - z * si, y * si + z * c];
    const f = s / (z + 4);
    return [cx + x * f, cy + y * f, z];
  }
  const ICO = (() => {
    const t = (1 + Math.sqrt(5)) / 2;
    const v = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map((p) => { const l = Math.hypot(...p); return p.map((q) => q / l); });
    const f = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
    return { v, f };
  })();
  SCENES.polygon = {
    init() { this.objs = Array.from({ length: 6 }, (_, i) => ({ x: rnd(0.1, 0.9), y: rnd(0.1, 0.9), s: rnd(0.08, 0.2), r: { x: rnd(0, 6), y: rnd(0, 6) }, v: rnd(0.2, 0.6), hue: i })); },
    draw(t, dt) {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#031211'); g.addColorStop(1, '#0a2422');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // Boden-Gitter
      ctx.strokeStyle = 'rgba(25,211,197,0.12)'; ctx.lineWidth = 1;
      const hz = H * 0.62;
      for (let i = -10; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + i * W * 0.02, hz); ctx.lineTo(W / 2 + i * W * 0.2, H); ctx.stroke(); }
      const off = (t * 30 * (1 + intensity * 2)) % 40;
      for (let y = 0; y < 12; y++) { const yy = hz + Math.pow((y * 40 + off) / 480, 2) * (H - hz); ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); }
      const light = [0.4, -0.7, -0.6];
      const cols = [[25, 211, 197], [255, 204, 51], [120, 90, 255], [255, 90, 120], [25, 211, 197], [255, 255, 255]];
      for (const o of this.objs) {
        o.r.x += dt * o.v * (1 + intensity); o.r.y += dt * o.v * 1.3 * (1 + intensity);
        const s = Math.min(W, H) * o.s * 3, cx = o.x * W, cy = o.y * H * 0.8;
        const pts = ICO.v.map((p) => project(p, o.r, cx, cy, s));
        const faces = ICO.f.map((f) => ({ f: f, z: (pts[f[0]][2] + pts[f[1]][2] + pts[f[2]][2]) / 3 })).sort((a, b) => b.z - a.z);
        for (const { f } of faces) {
          const [a, b, c] = f.map((i) => pts[i]);
          const ux = b[0] - a[0], uy = b[1] - a[1], vx = c[0] - a[0], vy = c[1] - a[1];
          if (ux * vy - uy * vx < 0) continue;
          const n = [ICO.v[f[0]][0] + ICO.v[f[1]][0] + ICO.v[f[2]][0], 0, 0];
          const sh = 0.35 + 0.65 * Math.max(0, Math.sin(o.r.y + n[0]) * light[0] + 0.5);
          const col = cols[o.hue];
          ctx.fillStyle = 'rgba(' + Math.floor(col[0] * sh) + ',' + Math.floor(col[1] * sh) + ',' + Math.floor(col[2] * sh) + ',0.35)';
          ctx.beginPath(); ctx.moveTo(Math.round(a[0]), Math.round(a[1])); ctx.lineTo(Math.round(b[0]), Math.round(b[1])); ctx.lineTo(Math.round(c[0]), Math.round(c[1])); ctx.closePath(); ctx.fill();
        }
      }
    },
  };

  // ── Ära 5: Netzwerk-Knoten ──
  SCENES.network = {
    init() {
      const n = BG.lowPower ? 26 : 44;
      this.nodes = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: rnd(-12, 12), vy: rnd(-12, 12) }));
      this.packets = [];
    },
    draw(t, dt) {
      ctx.fillStyle = '#0b0603'; ctx.fillRect(0, 0, W, H);
      const sp = 1 + intensity * 2, maxD = Math.min(W, H) * 0.22;
      for (const n of this.nodes) { n.x += n.vx * dt * sp; n.y += n.vy * dt * sp; if (n.x < 0 || n.x > W) n.vx *= -1; if (n.y < 0 || n.y > H) n.vy *= -1; }
      ctx.lineWidth = 1;
      for (let i = 0; i < this.nodes.length; i++) for (let j = i + 1; j < this.nodes.length; j++) {
        const a = this.nodes[i], b = this.nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < maxD) {
          ctx.strokeStyle = 'rgba(255,122,26,' + (0.18 * (1 - d / maxD)) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          if (Math.random() < 0.0015 * sp) this.packets.push({ a: a, b: b, p: 0 });
        }
      }
      for (const n of this.nodes) { ctx.fillStyle = 'rgba(90,162,255,0.55)'; ctx.fillRect(n.x - 1.5, n.y - 1.5, 3, 3); }
      for (let i = this.packets.length - 1; i >= 0; i--) {
        const k = this.packets[i]; k.p += dt * 1.2 * sp;
        if (k.p >= 1) { this.packets.splice(i, 1); continue; }
        ctx.fillStyle = '#ffd08a';
        ctx.fillRect(k.a.x + (k.b.x - k.a.x) * k.p - 1.5, k.a.y + (k.b.y - k.a.y) * k.p - 1.5, 3, 3);
      }
    },
  };

  // ── Ära 6: glänzende Blasen / Bokeh ──
  SCENES.glossy = {
    init() { this.b = Array.from({ length: 16 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: rnd(20, 90) * (W / 900 + 0.4), v: rnd(6, 20), h: Math.random() < 0.6 ? 0 : 1 })); },
    draw(t, dt) {
      const g = ctx.createRadialGradient(W / 2, H * 0.4, 10, W / 2, H * 0.5, Math.max(W, H) * 0.8);
      g.addColorStop(0, '#16260a'); g.addColorStop(1, '#040702');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // „Blades“
      ctx.fillStyle = 'rgba(134,224,30,0.05)';
      for (let i = 0; i < 4; i++) { const x = ((t * 20 + i * W / 3) % (W * 1.4)) - W * 0.2; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + W * 0.12, 0); ctx.lineTo(x - W * 0.1, H); ctx.lineTo(x - W * 0.22, H); ctx.fill(); }
      for (const b of this.b) {
        b.y -= b.v * dt * (1 + intensity * 2);
        if (b.y < -b.r) { b.y = H + b.r; b.x = Math.random() * W; }
        const rg = ctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.1, b.x, b.y, b.r);
        const c = b.h ? '233,243,255' : '134,224,30';
        rg.addColorStop(0, 'rgba(' + c + ',0.20)'); rg.addColorStop(1, 'rgba(' + c + ',0)');
        ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
      }
    },
  };

  // ── Ära 7: Stream-Chat & Equalizer ──
  const EMOTES = ['♥', '★', 'GG', 'W', 'POG', 'LOL', '!!', '<3', 'F', 'EZ', '+1', 'HYPE'];
  SCENES.stream = {
    init() { this.e = []; this.acc = 0; },
    draw(t, dt) {
      ctx.fillStyle = '#0a0614'; ctx.fillRect(0, 0, W, H);
      const bars = 48, bw = W / bars;
      for (let i = 0; i < bars; i++) {
        const h = (0.15 + 0.5 * Math.abs(Math.sin(t * (1.3 + (i % 7) * 0.21) + i * 0.7)) * (0.6 + intensity)) * H * 0.35;
        const g = ctx.createLinearGradient(0, H - h, 0, H);
        g.addColorStop(0, 'rgba(255,92,138,0.22)'); g.addColorStop(1, 'rgba(169,112,255,0.05)');
        ctx.fillStyle = g; ctx.fillRect(i * bw + 1, H - h, bw - 2, h);
      }
      this.acc += dt * (3 + intensity * 12);
      while (this.acc > 1) { this.acc -= 1; this.e.push({ x: rnd(0.05, 0.95) * W, y: H + 10, v: rnd(30, 70), s: rnd(10, 20), t: EMOTES[Math.floor(Math.random() * EMOTES.length)], a: 1 }); }
      ctx.textAlign = 'center';
      for (let i = this.e.length - 1; i >= 0; i--) {
        const e = this.e[i]; e.y -= e.v * dt; e.x += Math.sin(t * 2 + i) * 0.3;
        if (e.y < H * 0.2) e.a -= dt * 1.5;
        if (e.a <= 0) { this.e.splice(i, 1); continue; }
        ctx.globalAlpha = e.a * 0.35; ctx.fillStyle = i % 3 ? '#a970ff' : '#ff5c8a';
        ctx.font = 'bold ' + Math.floor(e.s) + 'px sans-serif'; ctx.fillText(e.t, e.x, e.y);
      }
      ctx.globalAlpha = 1;
    },
  };

  // ── Ära 8: Lichtwellen & Partikel ──
  SCENES.particles = {
    init() { this.p = Array.from({ length: BG.lowPower ? 50 : 110 }, () => ({ x: Math.random() * W, y: Math.random() * H, v: rnd(4, 18), s: rnd(0.5, 2) })); },
    draw(t, dt) {
      ctx.fillStyle = '#03060d'; ctx.fillRect(0, 0, W, H);
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 8) {
          const y = H * (0.55 + k * 0.08) + Math.sin(x * 0.004 + t * (0.4 + k * 0.15)) * H * 0.08 + Math.sin(x * 0.011 - t * 0.3) * H * 0.03;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = k === 1 ? 'rgba(245,248,255,0.12)' : 'rgba(67,168,255,0.18)'; ctx.lineWidth = 2 + k; ctx.stroke();
      }
      for (const p of this.p) {
        p.y -= p.v * dt * (1 + intensity * 3); p.x += Math.sin(t + p.y * 0.01) * 0.2;
        if (p.y < 0) { p.y = H; p.x = Math.random() * W; }
        ctx.fillStyle = 'rgba(180,215,255,' + (0.25 + p.s * 0.2) + ')';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fill();
      }
    },
  };

  // ── Ära 9: Holo-Tunnel ──
  SCENES.holo = {
    init() { this.z = 0; },
    draw(t, dt) {
      ctx.fillStyle = '#07020b'; ctx.fillRect(0, 0, W, H);
      this.z += dt * (0.4 + intensity * 1.5);
      const cx = W / 2 + Math.sin(t * 0.3) * W * 0.05, cy = H * 0.45 + Math.cos(t * 0.25) * H * 0.04;
      for (let i = 0; i < 14; i++) {
        const d = ((i + this.z) % 14) / 14;
        const s = Math.pow(d, 2.2) * Math.max(W, H) * 1.3;
        ctx.strokeStyle = i % 2 ? 'rgba(255,92,240,' + d * 0.35 + ')' : 'rgba(92,255,232,' + d * 0.35 + ')';
        ctx.lineWidth = 1 + d * 2;
        ctx.strokeRect(cx - s / 2, cy - s / 2 * 0.62, s, s * 0.62);
      }
      ctx.strokeStyle = 'rgba(92,255,232,0.08)';
      for (let i = 0; i < 16; i++) {
        const a = i / 16 * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * W, cy + Math.sin(a) * W * 0.62); ctx.stroke();
      }
      const sy = (t * 60) % H;
      ctx.fillStyle = 'rgba(255,92,240,0.05)'; ctx.fillRect(0, sy, W, 3);
    },
  };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const px = PIXEL[sceneId];
    const cw = window.innerWidth, ch = window.innerHeight;
    scale = px ? px : (BG.lowPower ? 1 : Math.min(dpr, 1.5));
    if (px) { W = Math.ceil(cw / px); H = Math.ceil(ch / px); }
    else { W = Math.ceil(cw * scale); H = Math.ceil(ch * scale); }
    if (sceneId === 'mode7') { W = Math.ceil(cw / 4); H = Math.ceil(ch / 4); }
    cv.width = W; cv.height = H;
    cv.style.imageRendering = px || sceneId === 'mode7' ? 'pixelated' : 'auto';
    ctx.imageSmoothingEnabled = false;
    if (scene && scene.init) scene.init();
  }

  BG.init = function (canvas) {
    cv = canvas; ctx = cv.getContext('2d', { alpha: false });
    BG.lowPower = (navigator.hardwareConcurrency || 4) <= 4 || Math.min(window.innerWidth, window.innerHeight) < 500;
    window.addEventListener('resize', () => { clearTimeout(BG._rt); BG._rt = setTimeout(resize, 150); });
    running = true;
    requestAnimationFrame(loop);
  };

  BG.setScene = function (id, instant) {
    if (id === sceneId) return;
    if (!sceneId || instant) { sceneId = id; scene = SCENES[id]; resize(); fade = 0; return; }
    pendingScene = id; fade = 0.0001;
  };
  BG.setIntensity = function (v) { intensity = v; };
  BG.setMood = function (v) { mood = v; };

  let acc = 0, prev = 0;
  function loop(now) {
    if (!running) return;
    requestAnimationFrame(loop);
    const dt = Math.min(0.1, prev ? (now - prev) / 1000 : 0.016);
    prev = now;
    if (document.hidden || !scene) return;
    acc += dt;
    const frameT = BG.lowPower ? 1 / 24 : 1 / 30;
    if (acc < frameT) return;
    const step = Math.min(0.1, acc); acc = 0;
    if (!BG.enabled) {
      if (!BG._static) { scene.draw(now / 1000, 0.016); BG._static = true; }
      return;
    }
    BG._static = false;
    scene.draw(now / 1000, step);
    if (mood > 0) { ctx.fillStyle = 'rgba(255,20,40,' + (0.12 * mood) + ')'; ctx.fillRect(0, 0, W, H); }
    if (pendingScene || fade > 0) {
      if (pendingScene) {
        fade += step * 1.6;
        if (fade >= 1) { sceneId = pendingScene; scene = SCENES[pendingScene]; pendingScene = null; resize(); fade = 1; }
      } else fade = Math.max(0, fade - step * 1.2);
      ctx.fillStyle = 'rgba(0,0,0,' + Math.min(1, fade) + ')'; ctx.fillRect(0, 0, W, H);
    }
  }
})();
