/* PIXELZEIT – Audio: Musik (Crossfade) & Soundeffekte (Samples mit Synth-Fallback) */
(function () {
  'use strict';
  const PZ = (window.PZ = window.PZ || {});
  const A = (PZ.Audio = {});

  const SFX_IDS = ['click', 'buy', 'upgrade', 'deny', 'crit', 'coin', 'powerup_spawn', 'powerup', 'achievement', 'boss_appear',
    'boss_hit', 'boss_win', 'boss_lose', 'era', 'loot', 'loot_legendary', 'fever', 'crash', 'tab', 'toggle'];
  const ERA_MUSIC = ['m0', 'm0', 'm1', 'm2', 'm3', 'm3', 'm4', 'm4', 'm5', 'm5'];

  let ctx = null, master = null, sfxGain = null, musicGain = null;
  const buffers = {};
  let sfxVol = 0.7, musicVol = 0.45, unlocked = false;
  const isFile = typeof location !== 'undefined' && location.protocol === 'file:';

  A.setVolumes = function (s, m) {
    sfxVol = s; musicVol = m;
    if (sfxGain) sfxGain.gain.value = s;
    if (musicGain) musicGain.gain.value = m;
    if (cur && cur.el) cur.el.volume = Math.min(1, m);
    if (m <= 0.001) A.pauseMusic(); else if (unlocked && wantTrack && !cur) A.playMusic(wantTrack, true);
  };

  /** Beim ersten Nutzer-Input aufrufen */
  A.unlock = function () {
    if (unlocked) { if (ctx && ctx.state === 'suspended') ctx.resume(); return; }
    unlocked = true;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
      master = ctx.createGain(); master.connect(ctx.destination);
      sfxGain = ctx.createGain(); sfxGain.gain.value = sfxVol; sfxGain.connect(master);
      musicGain = ctx.createGain(); musicGain.gain.value = musicVol; musicGain.connect(master);
    } catch (e) { ctx = null; }
    loadSfx();
    if (wantTrack) A.playMusic(wantTrack, true);
  };

  function loadSfx() {
    if (!ctx || typeof fetch === 'undefined') return;
    SFX_IDS.forEach((id) => {
      fetch('assets/audio/sfx/' + id + '.mp3').then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()))
        .then((ab) => new Promise((res, rej) => ctx.decodeAudioData(ab, res, rej)))
        .then((buf) => { buffers[id] = buf; })
        .catch(() => { /* Synth-Fallback */ });
    });
  }

  // Einfache Chiptune-Synth-Sounds als Fallback
  const SYNTH = {
    click: [['triangle', 330, 0.05, 0.1]], buy: [['square', 660, 0.05], ['square', 990, 0.07]], upgrade: [['square', 523, 0.06], ['square', 659, 0.06], ['square', 784, 0.06], ['square', 1047, 0.12]],
    deny: [['sawtooth', 140, 0.14]], crit: [['square', 1200, 0.04], ['triangle', 300, 0.1]], coin: [['square', 988, 0.05], ['square', 1319, 0.12]],
    powerup_spawn: [['triangle', 1200, 0.05], ['triangle', 1600, 0.05], ['triangle', 2000, 0.08]], powerup: [['square', 523, 0.05], ['square', 784, 0.05], ['square', 1047, 0.05], ['square', 1568, 0.12]],
    achievement: [['square', 784, 0.08], ['square', 988, 0.08], ['square', 1175, 0.08], ['square', 1568, 0.25]], boss_appear: [['sawtooth', 110, 0.3], ['sawtooth', 98, 0.4]],
    boss_hit: [['square', 220, 0.03, 0.1]], boss_win: [['square', 523, 0.1], ['square', 659, 0.1], ['square', 784, 0.1], ['square', 1047, 0.35]], boss_lose: [['triangle', 392, 0.2], ['triangle', 330, 0.2], ['triangle', 262, 0.45]],
    era: [['square', 392, 0.1], ['square', 523, 0.1], ['square', 659, 0.1], ['square', 784, 0.1], ['square', 1047, 0.4]], loot: [['triangle', 880, 0.06], ['triangle', 1320, 0.1]],
    loot_legendary: [['square', 659, 0.08], ['square', 880, 0.08], ['square', 1175, 0.08], ['square', 1760, 0.3]], fever: [['sawtooth', 300, 0.08], ['sawtooth', 600, 0.08], ['sawtooth', 1200, 0.2]],
    crash: [['sawtooth', 200, 0.2], ['sawtooth', 100, 0.3], ['sawtooth', 50, 0.5]], tab: [['square', 1400, 0.015, 0.08]], toggle: [['square', 1000, 0.03, 0.1]],
  };
  function synth(id, rate) {
    const seq = SYNTH[id];
    if (!seq || !ctx) return;
    let t = ctx.currentTime;
    for (const [type, f, dur, vol] of seq) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = f * (rate || 1);
      g.gain.setValueAtTime((vol || 0.18), t);
      g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
      o.connect(g); g.connect(sfxGain);
      o.start(t); o.stop(t + dur + 0.02);
      t += dur * 0.9;
    }
  }

  const lastPlay = {};
  /** Spielt einen Soundeffekt. opts: {rate, vol, throttle(ms)} */
  A.play = function (id, opts) {
    if (!ctx || sfxVol <= 0.001) return;
    opts = opts || {};
    const now = performance.now();
    const th = opts.throttle !== undefined ? opts.throttle : 35;
    if (lastPlay[id] && now - lastPlay[id] < th) return;
    lastPlay[id] = now;
    if (ctx.state === 'suspended') ctx.resume();
    const buf = buffers[id];
    if (!buf) { synth(id, opts.rate); return; }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = opts.rate || 1;
    const g = ctx.createGain();
    g.gain.value = opts.vol !== undefined ? opts.vol : 1;
    src.connect(g); g.connect(sfxGain);
    src.start();
  };

  // ───────── Musik ─────────
  // Bevorzugt Web Audio (lückenlose Loops), sonst <audio loop> (z. B. bei file://)
  const musicBufs = {}, musicLoading = {};
  let cur = null, currentTrack = null, wantTrack = null, reqId = 0;
  const useBuffers = () => ctx && !isFile && typeof fetch !== 'undefined';
  function loadTrack(id) {
    if (musicBufs[id]) return Promise.resolve(musicBufs[id]);
    if (musicLoading[id]) return musicLoading[id];
    musicLoading[id] = fetch('assets/audio/music/' + id + '.mp3').then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()))
      .then((ab) => new Promise((res, rej) => ctx.decodeAudioData(ab, res, rej)))
      .then((buf) => {
        musicBufs[id] = buf;
        delete musicLoading[id];
        // Speicher sparen: höchstens zwei dekodierte Titel behalten
        const keep = [id, currentTrack, wantTrack];
        const ids = Object.keys(musicBufs);
        for (let i = 0; i < ids.length && Object.keys(musicBufs).length > 2; i++) {
          if (keep.indexOf(ids[i]) < 0) delete musicBufs[ids[i]];
        }
        return buf;
      }, (err) => { delete musicLoading[id]; throw err; });
    return musicLoading[id];
  }
  function stopCur(ms) {
    const c = cur; cur = null;
    if (!c) return;
    if (c.el) { fadeEl(c.el, 0, ms); return; }
    const g = c.gain.gain, t = ctx.currentTime;
    g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(0, t + ms / 1000);
    setTimeout(() => { try { c.src.stop(); } catch (e) { /* schon gestoppt */ } c.src.disconnect(); c.gain.disconnect(); }, ms + 80);
  }
  function fadeEl(el, to, ms) {
    const start = el.volume, t0 = performance.now();
    const step = () => {
      const p = Math.min(1, (performance.now() - t0) / ms);
      el.volume = Math.max(0, Math.min(1, start + (to * musicVol - start) * p));
      if (p < 1) requestAnimationFrame(step); else if (to === 0) el.pause();
    };
    step();
  }
  function startBuffer(id, buf) {
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    src.connect(gain); gain.connect(musicGain);
    src.start();
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(1, t + 1.6);
    cur = { src: src, gain: gain, id: id };
  }
  function startElement(id) {
    const el = new Audio('assets/audio/music/' + id + '.mp3');
    el.loop = true; el.volume = 0;
    const p = el.play(); if (p && p.catch) p.catch(() => {});
    fadeEl(el, 1, 1600);
    cur = { el: el, id: id };
  }

  A.trackForEra = (era) => ERA_MUSIC[era] || 'm0';
  A.playMusic = function (id, force) {
    wantTrack = id;
    if (!unlocked || musicVol <= 0.001) return;
    // Läuft oder lädt dieser Titel bereits? Dann nichts tun.
    if (id === currentTrack && (cur || musicLoading[id])) return;
    currentTrack = id;
    const my = ++reqId;
    if (useBuffers()) {
      if (ctx.state === 'suspended') ctx.resume();
      loadTrack(id).then((buf) => {
        if (my !== reqId) return;
        stopCur(1400);
        startBuffer(id, buf);
      }).catch(() => { if (my !== reqId) return; stopCur(600); startElement(id); });
    } else { stopCur(1200); startElement(id); }
  };
  A.pauseMusic = function () { reqId++; stopCur(400); currentTrack = null; };
  A.suspend = function () { if (ctx && ctx.state === 'running') ctx.suspend(); if (cur && cur.el && !cur.el.paused) { cur.el._was = true; cur.el.pause(); } };
  A.resume = function () {
    if (ctx && ctx.state === 'suspended') ctx.resume();
    if (cur && cur.el && cur.el._was) { cur.el._was = false; const p = cur.el.play(); if (p && p.catch) p.catch(() => {}); }
  };
  A.isUnlocked = () => unlocked;
})();
