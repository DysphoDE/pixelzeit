/* PIXELZEIT – Start, Spielschleife, Eingabe, Speichern (lokal + Cloud) */
(function () {
  'use strict';
  const PZ = window.PZ, U = PZ.U, E = PZ.E, UI = PZ.UI, A = PZ.Audio, SPR = PZ.SPR;
  const Main = (PZ.Main = {});
  const $ = (s) => document.querySelector(s);
  const hot = window.claude && window.claude.hot;

  if (!window.claude) document.documentElement.classList.add('local');

  // ───────────────────────── Speichern ─────────────────────────
  let lastLocalSave = 0;
  Main.save = function (force) {
    const str = E.serialize();
    U.lsSet(E.SAVE_KEY, str);
    lastLocalSave = Date.now();
    Cloud.push(str, force);
  };
  Main.loadState = function (S) {
    E.load(S);
    UI.applySettings();
    UI.applyTheme(E.S.era, true);
    UI.fullRefresh();
    Main.save(true);
  };
  Main.hardReset = function () {
    U.lsDel(E.SAVE_KEY);
    const settings = E.S.settings;
    E.load(E.newState());
    E.S.settings = settings;
    Cloud.push(E.serialize(), true);
    UI.applySettings();
    UI.applyTheme(0, true);
    UI.fullRefresh();
    UI.toast({ icon: 'skull', small: 'NEUSTART', title: 'Alles zurückgesetzt. Insert Coin!' });
  };

  // ───────────────────────── Cloud (Artifact-Datenbank) ─────────────────────────
  const Cloud = { db: null, ref: null, ready: false, lastPush: 0, lastStr: '', pushing: false, remoteT: 0, state: 'off' };
  Main.cloudStatus = function () {
    if (Cloud.state === 'on') return '<b>Cloud-Sync aktiv</b> – dein Spielstand folgt dir zwischen PC und Smartphone.' + (Cloud.lastPush ? ' Zuletzt: ' + new Date(Cloud.lastPush).toLocaleTimeString('de-DE') : '');
    if (Cloud.state === 'wait') return 'Cloud-Sync wird verbunden …';
    return 'Lokal im Browser gespeichert. Nutze Export/Import, um den Spielstand auf ein anderes Gerät zu bringen.';
  };
  Cloud.init = async function () {
    if (!window.claude || !window.claude.use) return;
    Cloud.state = 'wait';
    try {
      const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
      if (!db || !user) { Cloud.state = 'off'; return; }
      const uid = await user.id();
      if (!uid) { Cloud.state = 'off'; return; }
      Cloud.db = db;
      Cloud.ref = db.doc('data/users/' + uid + '/save');
      const snap = await Cloud.ref.get();
      Cloud.ready = true; Cloud.state = 'on';
      if (snap.exists) {
        const d = snap.data();
        Cloud.remoteT = d.t || 0;
        if (d.save && d.t > (E.S.lastSave || 0) + 3000) Cloud.offer(d);
        else Cloud.push(E.serialize(), true);
      } else Cloud.push(E.serialize(), true);
    } catch (e) { Cloud.state = 'off'; }
  };
  Cloud.offer = function (d) {
    let S;
    try { S = E.deserialize(d.save); } catch (e) { return; }
    const localNew = E.S.totalEarned < 100 && E.S.clicks < 30;
    if (localNew) { Main.loadState(S); UI.toast({ icon: 'disk', small: 'CLOUD', title: 'Spielstand geladen', text: 'Stand vom ' + new Date(d.t).toLocaleString('de-DE') }); return; }
    const m = UI.modal('<h2>Neuerer Spielstand gefunden</h2><p>Auf einem anderen Gerät hast du weitergespielt (' + new Date(d.t).toLocaleString('de-DE') + ').</p>' +
      '<p class="hint">Cloud: Epoche „' + U.esc(PZ.ERAS[S.era].name) + '“, ' + U.fmt(S.totalEarned) + ' Münzen insgesamt.<br>Hier: Epoche „' + U.esc(PZ.ERAS[E.S.era].name) + '“, ' + U.fmt(E.S.totalEarned) + ' Münzen insgesamt.</p>' +
      '<div class="modal-actions"><button class="btn ghost" id="keepLocal">Diesen behalten</button><button class="btn" id="takeCloud">Cloud-Stand laden</button></div>', { noClose: true });
    m.querySelector('#takeCloud').addEventListener('click', () => { UI.closeModal(m); Main.loadState(S); });
    m.querySelector('#keepLocal').addEventListener('click', () => { UI.closeModal(m); Cloud.push(E.serialize(), true); });
  };
  Cloud.push = async function (str, force) {
    if (!Cloud.ready || !Cloud.ref || Cloud.pushing) return;
    const now = Date.now();
    if (!force && now - Cloud.lastPush < 45000) return;
    if (str === Cloud.lastStr) return;
    Cloud.pushing = true;
    try {
      await Cloud.ref.set({ t: E.S.lastSave, save: str, era: E.S.era, v: E.VERSION });
      Cloud.lastPush = now; Cloud.lastStr = str; Cloud.remoteT = E.S.lastSave;
    } catch (e) {
      if (e && (e.code === 'invalid_argument' || e.code === 'revoked' || e.code === 'not_granted')) { Cloud.ready = false; Cloud.state = 'off'; }
    }
    Cloud.pushing = false;
  };
  Cloud.checkRemote = async function () {
    if (!Cloud.ready || !Cloud.ref) return;
    try {
      const snap = await Cloud.ref.get();
      if (!snap.exists) return;
      const d = snap.data();
      if (d.t > Cloud.remoteT + 3000 && d.t > (E.S.lastSave || 0) + 3000 && d.save !== Cloud.lastStr) { Cloud.remoteT = d.t; Cloud.offer(d); }
    } catch (e) { /* ignorieren */ }
  };

  // ───────────────────────── Eingabe ─────────────────────────
  let pressT = 0, altPress = false;
  function doClick(clientX, clientY) {
    const S = E.S;
    A.unlock();
    const r = E.click(false);
    const stage = $('#stage').getBoundingClientRect();
    const x = clientX - stage.left, y = clientY - stage.top;
    if (S.boss || r.dmg) {
      A.play('boss_hit', { rate: 0.9 + Math.random() * 0.25, throttle: 25 });
      UI.floater(x + U.rand(-20, 20), y - 10, '-' + U.fmt(r.dmg), 'dmg');
      const bi = $('#bossImg');
      bi.classList.remove('hit'); void bi.offsetWidth; bi.classList.add('hit');
      if (PZ.FX) PZ.FX.burst(x, y, 6, ['#ff5470', '#ffffff', '#ff8a1f'], 200);
    } else {
      const c = $('#controller');
      altPress = !altPress;
      c.classList.add('press'); c.classList.toggle('alt', altPress);
      clearTimeout(pressT); pressT = setTimeout(() => c.classList.remove('press'), 70);
      A.play('click', { rate: 0.94 + S.heat / 500 + Math.random() * 0.06, throttle: 30, vol: S.settings.clickVol });
      UI.floater(x + U.rand(-24, 24), y - 20, '+' + U.fmt(r.value, 1), r.crit ? 'crit' : '');
      if (PZ.FX) PZ.FX.burst(x, y, r.crit ? 16 : 4, ['#ffd23f', '#fff6c2', PZ.ERAS[S.era].accent], r.crit ? 300 : 170);
    }
    if (r.crit) { A.play('crit', { throttle: 60 }); UI.shake(false); }
  }
  function bindInput() {
    const zone = $('#clickZone');
    zone.addEventListener('pointerdown', (e) => {
      if (UI.paused) return;
      const onCtrl = e.target.closest('#controller');
      const onBoss = E.S.boss && e.target.closest('#bossLayer');
      if (!onCtrl && !onBoss) return;
      e.preventDefault();
      doClick(e.clientX, e.clientY);
    });
    $('#controller').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); kbClick(); } });
    $('#controller').addEventListener('click', (e) => e.preventDefault());
    document.addEventListener('contextmenu', (e) => { if (e.target.closest('#clickZone')) e.preventDefault(); });
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('dblclick', (e) => { if (e.target.closest('#stage')) e.preventDefault(); }, { passive: false });

    // Tastatur
    const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let kpos = 0;
    document.addEventListener('keydown', (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === KONAMI[kpos]) { kpos++; if (kpos === KONAMI.length) { kpos = 0; Main.cheat('KONAMI'); } } else kpos = k === KONAMI[0] ? 1 : 0;
      if (e.target.closest('input,textarea,select')) return;
      if (e.key === 'Escape') { const m = document.querySelector('#modalRoot .modal-wrap:last-child'); if (m && m.querySelector('[data-close]')) m.remove(); if (UI.paused) UI.pause(false); return; }
      if (k === 'p') { UI.paused ? UI.pause(false) : UI.pause(true); return; }
      if (UI.paused || UI.modalOpen()) return;
      if (e.code === 'Space') { e.preventDefault(); if (!e.repeat) kbClick(); }
      else if (k === '1') { UI.buyMode = 1; UI.syncBuySeg(); UI.updateGens(true); }
      else if (k === '2') { UI.buyMode = 10; UI.syncBuySeg(); UI.updateGens(true); }
      else if (k === '3') { UI.buyMode = 100; UI.syncBuySeg(); UI.updateGens(true); }
      else if (k === '4') { UI.buyMode = 'max'; UI.syncBuySeg(); UI.updateGens(true); }
      else if (k === 'b') { E.bossStart(); }
    });
    // Konami per Wischgesten (Handy): ↑↑↓↓←→←→ auf der Bühne, dann zweimal tippen
    let sx = 0, sy = 0, swipes = [];
    const stage = $('#stage');
    stage.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    stage.addEventListener('touchend', (e) => {
      const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 40) {
        if (swipes.length >= 8) { swipes.push('tap'); if (swipes.length >= 10) { if (swipes.slice(0, 8).join() === 'u,u,d,d,l,r,l,r') Main.cheat('KONAMI'); swipes = []; } }
        return;
      }
      swipes.push(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'r' : 'l') : (dy > 0 ? 'd' : 'u'));
      if (swipes.length > 10) swipes.shift();
    }, { passive: true });
  }
  function kbClick() {
    const c = $('#controller').getBoundingClientRect();
    doClick(c.left + c.width / 2 + U.rand(-c.width * 0.25, c.width * 0.25), c.top + c.height / 2 + U.rand(-c.height * 0.2, c.height * 0.2));
  }

  // ───────────────────────── Cheat-Codes ─────────────────────────
  Main.cheat = function (raw) {
    const code = String(raw || '').toUpperCase().replace(/[\s,.-]/g, '').replace(/↑/g, 'U').replace(/↓/g, 'D').replace(/←/g, 'L').replace(/→/g, 'R');
    const S = E.S;
    const ok = (t, txt) => { A.play('achievement'); UI.toast({ icon: 'star', small: 'CHEAT AKTIVIERT', title: t, text: txt }); E.recalc(); };
    if (code === 'KONAMI' || code === 'UUDDLRLRBA' || code === 'UPUPDOWNDOWNLEFTRIGHTLEFTRIGHTBA') {
      if (S.secrets.konami) { UI.toast({ icon: 'heart', small: 'KONAMI', title: 'Du hast schon 30 Leben.' }); return; }
      S.secrets.konami = 1; ok('30 Leben!', 'Neuer Geheim-Perk in der Hall of Fame – kostenlos.');
    } else if (code === 'IDDQD') { S.secrets.iddqd = 1; ok('Gott-Modus', 'Boss-Schaden +50 % für immer.'); }
    else if (code === 'IDKFA') { S.secrets.idkfa = 1; E.gain(E.cps * 60 + 100); ok('Alle Waffen & Schlüssel', 'Eine Minute Produktion gratis.'); }
    else if (code === 'XYZZY') { S.secrets.xyzzy = 1; UI.toast({ icon: 'skull', small: 'XYZZY', title: 'Nichts passiert.' }); }
    else if (code === 'MISSINGNO') { S.secrets.glitchy = 1; ok('MissingNo.', 'Glitches erscheinen häufiger. Auf eigene Gefahr.'); }
    else if (code === 'JUSTIN BAILEY' || code === 'JUSTINBAILEY') { ok('Justin Bailey', 'Ein Metroid-Passwort. Leider ohne Wirkung – aber stilvoll.'); }
    else { A.play('deny'); UI.toast({ icon: 'skull', small: 'CHEAT', title: 'Unbekannter Code' }); }
  };

  // ───────────────────────── Spielschleife ─────────────────────────
  let lastT = 0, uiAcc = 0, slowAcc = 0, achAcc = 0;
  function catchUp(sec) {
    // Kurze Unterbrechungen voll simulieren, lange Pausen als Offline-Ertrag
    const live = Math.min(sec, 600);
    let t = live;
    while (t > 0) { const s = Math.min(1, t); E.tick(s); t -= s; }
    if (sec > 600) {
      const r = E.applyOffline(sec - 600);
      if (r && r.gain > 0) UI.offlineModal(r);
    }
  }
  function loop() {
    const now = Date.now();
    let dt = (now - lastT) / 1000;
    lastT = now;
    if (UI.paused) return;
    if (dt > 3) { catchUp(dt); dt = 0; }
    if (dt > 0) E.tick(dt);
    uiAcc += dt; slowAcc += dt; achAcc += dt;
    if (uiAcc >= 0.2) { uiAcc = 0; UI.refresh(); }
    if (slowAcc >= 1) {
      slowAcc = 0; UI.slowRefresh();
      const h = new Date().getHours();
      if (h >= 2 && h < 4) E.S.secrets.nightowl = 1;
    }
    if (achAcc >= 1.5) { achAcc = 0; PZ.checkAchievements(); }
    if (now - lastLocalSave > 15000) Main.save(false);
  }
  Main.resumeFromPause = function () { lastT = Date.now(); };

  // ───────────────────────── Tagesbonus ─────────────────────────
  const dayKey = (d) => d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  Main.dailyBonus = function () {
    const S = E.S;
    const today = dayKey(new Date());
    if (S.secrets.lastDay === today) return;
    const y = new Date(); y.setDate(y.getDate() - 1);
    S.secrets.streak = S.secrets.lastDay === dayKey(y) ? (S.secrets.streak || 0) + 1 : 1;
    const first = !S.secrets.lastDay;
    S.secrets.lastDay = today;
    if (first && S.totalEarned < 50) return; // ganz neues Spiel: kein Bonus am ersten Tag
    const st = Math.min(7, S.secrets.streak);
    const coins = Math.max(100, E.cpsBase * 300 * st);
    E.gain(coins);
    const loot = S.era >= 1 ? E.lootRoll(st >= 7 ? 'boss' : 'bin') : null;
    UI.modal('<h2>Tagesbonus · Tag ' + S.secrets.streak + '</h2><p>Schön, dass du wieder da bist! Jeden Tag in Folge wird der Bonus größer (bis Tag 7).</p>' +
      '<div class="big-num"><img class="spr" style="width:28px;height:28px" src="' + SPR.url('coin', 3) + '" alt="">+' + U.fmt(coins) + '</div>' +
      (loot ? '<p class="hint">Dazu aus dem Überraschungspaket: <b>' + U.esc(loot.game.name) + '</b></p>' : '') +
      '<div class="modal-actions"><button class="btn" data-close>Danke!</button></div>');
    A.play('powerup');
  };

  // ───────────────────────── Start ─────────────────────────
  function boot(hotData) {
    let S = null;
    const fromHot = hotData && hotData.save;
    const str = fromHot || U.lsGet(E.SAVE_KEY);
    if (str) { try { S = E.deserialize(str); } catch (e) { S = null; } }
    E.load(S || E.newState());
    UI.init();
    UI.applySettings();
    PZ.BG.init($('#bg'));
    UI.applyTheme(E.S.era, true);
    UI.fullRefresh();
    // Offline-Ertrag (nach dem Titelbildschirm anzeigen)
    let offline = null;
    if (S && !fromHot) {
      const away = (Date.now() - (S.lastSave || Date.now())) / 1000;
      offline = E.applyOffline(away);
    }
    E.S.lastSave = Date.now();
    const afterStart = () => {
      A.playMusic(A.trackForEra(E.S.era));
      setTimeout(Main.dailyBonus, 1200);
      if (offline && offline.gain > 0) UI.offlineModal(offline);
      const w = E.pendingWar(); if (w && !(offline && offline.gain > 0)) setTimeout(() => UI.warModal(w), 300);
    };
    if (fromHot || /skipintro/.test(location.search)) afterStart(); else UI.splash(afterStart);
    bindInput();
    // Audio erst nach Nutzerinteraktion
    const unlock = () => { A.unlock(); A.playMusic(A.trackForEra(E.S.era)); };
    document.addEventListener('pointerdown', unlock, { once: true, capture: true });
    document.addEventListener('keydown', unlock, { once: true, capture: true });
    // Sichtbarkeit
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { Main.save(true); A.suspend(); }
      else { A.resume(); Cloud.checkRemote(); }
    });
    window.addEventListener('pagehide', () => Main.save(true));
    window.addEventListener('beforeunload', () => { const s = E.serialize(); U.lsSet(E.SAVE_KEY, s); });
    lastT = Date.now();
    setInterval(loop, 50);
    Cloud.init();
    if (hot && hot.snapshot) { try { hot.snapshot(() => ({ save: E.serialize() })); } catch (e) { /* optional */ } }
    Main.booted = true;
  }

  function start(data) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => boot(data));
    else boot(data);
  }
  if (hot && hot.ready) hot.ready(start); else start((hot && hot.data) || {});
})();
