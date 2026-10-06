/* PIXELZEIT – Benutzeroberfläche */
(function () {
  'use strict';
  const PZ = window.PZ, U = PZ.U, E = PZ.E, SPR = PZ.SPR, A = PZ.Audio;
  const UI = (PZ.UI = {});
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = U.esc;
  const H = PZ.HISTORY || { gens: {}, eras: {}, news: [], jokes: [] };
  const fmt = (n) => U.fmt(n);
  const coinImg = () => '<img class="spr" src="' + SPR.url('coin', 2) + '" alt="">';

  UI.buyMode = 1;
  UI.tab = 'gens';
  UI.layout = 0;
  UI.paused = false;
  UI.selUpg = null;
  UI.achFilter = 'all';
  UI.fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Bild-Metadaten (Freisteller vs. Foto, Credits)
  const IMG = {};
  UI.imgMeta = function () {
    const list = (PZ.CREDITS && PZ.CREDITS.images) || [];
    list.forEach((c) => { IMG[c.id] = c; });
  };
  const isPhoto = (id) => IMG[id] && IMG[id].kind === 'photo';

  const TABS = [
    { id: 'gens', name: 'Geräte', icon: 'chip' },
    { id: 'upgrades', name: 'Upgrades', icon: 'bolt' },
    { id: 'era', name: 'Epoche', icon: 'clock' },
    { id: 'loot', name: 'Sammlung', icon: 'chest' },
    { id: 'ach', name: 'Trophäen', icon: 'trophy' },
    { id: 'perks', name: 'Hall of Fame', icon: 'tape' },
    { id: 'museum', name: 'Museum', icon: 'star' },
    { id: 'stats', name: 'Statistik', icon: 'disk' },
    { id: 'options', name: 'Optionen', icon: 'cursor' },
  ];
  const NAV = [
    { id: 'gens', name: 'Geräte', icon: 'chip' },
    { id: 'upgrades', name: 'Upgrades', icon: 'bolt' },
    { id: 'era', name: 'Epoche', icon: 'clock' },
    { id: 'loot', name: 'Sammlung', icon: 'chest' },
    { id: 'more', name: 'Mehr', icon: 'trophy' },
  ];
  const KIND_COL = { gen: '#ffd23f', click: '#ff5cf0', tech: 'var(--acc)', synergy: '#5cffe8', misc: '#ff8a1f', weapon: '#ff5470', trophy: '#9fe8ff' };
  const KIND_NAME = { gen: 'Geräte-Upgrade', click: 'Klick-Upgrade', tech: 'Epochen-Technik', synergy: 'Synergie', misc: 'Spezial', weapon: 'Waffenkammer', trophy: 'Vitrine' };

  // ───────────────────────── Aufbau ─────────────────────────
  UI.init = function () {
    UI.imgMeta();
    $$('.spr-slot').forEach((el) => { el.innerHTML = SPR.img(el.dataset.spr, '', 3); });
    // Tabs
    $('#tabs').innerHTML = TABS.map((t) => '<button class="tab" role="tab" data-tab="' + t.id + '"><img class="spr" src="' + SPR.url(t.icon, 2) + '" alt="">' + t.name + '</button>').join('');
    $('#tabs').addEventListener('click', (e) => { const b = e.target.closest('.tab'); if (b) UI.showTab(b.dataset.tab); });
    $('#bottomNav').innerHTML = NAV.map((t) => '<button class="nav-btn" data-nav="' + t.id + '"><img class="spr" src="' + SPR.url(t.icon, 3) + '" alt="">' + t.name + '</button>').join('');
    $('#bottomNav').addEventListener('click', (e) => {
      const b = e.target.closest('.nav-btn'); if (!b) return;
      A.play('tab');
      const id = b.dataset.nav;
      const app = $('#app');
      const open = app.classList.contains('sheet-open');
      if (id === 'more') {
        const moreTabs = ['ach', 'perks', 'museum', 'stats', 'options'];
        if (open && moreTabs.includes(UI.tab)) { UI.closeSheet(); return; }
        UI.showTab(moreTabs.includes(UI.tab) ? UI.tab : 'ach');
      } else {
        if (open && UI.tab === id) { UI.closeSheet(); return; }
        UI.showTab(id);
      }
      app.classList.add('sheet-open');
      UI.syncNav();
    });
    // Swipe nach unten schließt das Sheet
    let sy = null;
    $('#tabs').addEventListener('touchstart', (e) => { sy = e.touches[0].clientY; }, { passive: true });
    $('#tabs').addEventListener('touchmove', (e) => { if (sy !== null && e.touches[0].clientY - sy > 60) { UI.closeSheet(); sy = null; } }, { passive: true });
    $('#stage').addEventListener('pointerdown', (e) => {
      if (UI.layout === 1 && $('#app').classList.contains('sheet-open') && !e.target.closest('#controller,#bossLayer,.powerup,.boss-btn,.era-btn')) UI.closeSheet();
    });

    UI.buildGensPage();
    UI.buildUpgradesPage();
    UI.buildOptions();
    UI.layoutCheck();
    window.addEventListener('resize', () => { clearTimeout(UI._lt); UI._lt = setTimeout(() => { UI.layoutCheck(); UI.fitUpgDetail(); }, 120); });
    UI.showTab(UI.layout === 3 ? 'era' : 'gens', true);
    UI.initTooltips();
    UI.initTicker();
    UI.initFx();
    $('#eraBtn').addEventListener('click', UI.onEraBtn);
    $('#bossBtn').addEventListener('click', () => { if (E.bossStart()) { /* Event übernimmt */ } });
    $('#btnPause').addEventListener('click', () => UI.pause(true));
    $('#btnSound').addEventListener('click', UI.toggleMute);
    $('#npChip').addEventListener('click', () => { UI.showTab('perks'); if (UI.layout === 1) $('#app').classList.add('sheet-open'); UI.syncNav(); });
    $('#yearBox').addEventListener('click', () => { UI.showTab('era'); if (UI.layout === 1) $('#app').classList.add('sheet-open'); UI.syncNav(); });
    UI.bindEvents();
  };

  UI.closeSheet = function () { $('#app').classList.remove('sheet-open'); UI.syncNav(); };
  UI.syncNav = function () {
    const open = $('#app').classList.contains('sheet-open');
    const more = ['ach', 'perks', 'museum', 'stats', 'options'].includes(UI.tab);
    $$('.nav-btn').forEach((b) => b.classList.toggle('active', open && (b.dataset.nav === UI.tab || (b.dataset.nav === 'more' && more))));
  };

  UI.layoutCheck = function () {
    const w = window.innerWidth;
    const mode = w >= 1320 ? 3 : w >= 900 ? 2 : 1;
    if (mode === UI.layout) return;
    UI.layout = mode;
    const app = $('#app');
    app.classList.add('switching');
    app.classList.remove('layout-1', 'layout-2', 'layout-3', 'sheet-open');
    app.classList.add('layout-' + mode);
    requestAnimationFrame(() => requestAnimationFrame(() => app.classList.remove('switching')));
    const shop = $('#shopCol'), body = $('#panelBody');
    const gp = $('#page-gens'), up = $('#page-upgrades');
    if (mode === 3) {
      shop.hidden = false;
      shop.appendChild(up); shop.appendChild(gp);
      up.classList.add('shop-upg'); gp.classList.add('shop-gens');
      $$('.tab[data-tab=gens],.tab[data-tab=upgrades]').forEach((t) => (t.hidden = true));
      if (UI.tab === 'gens' || UI.tab === 'upgrades') UI.showTab('era', true);
    } else {
      shop.hidden = true;
      body.insertBefore(up, body.firstChild); body.insertBefore(gp, body.firstChild);
      up.classList.remove('shop-upg'); gp.classList.remove('shop-gens');
      $$('.tab[data-tab=gens],.tab[data-tab=upgrades]').forEach((t) => (t.hidden = false));
    }
    UI.showTab(UI.tab, true);
    UI.syncNav();
    if (PZ.FX) PZ.FX.resize();
  };

  UI.showTab = function (id, silent) {
    if (UI.layout === 3 && (id === 'gens' || id === 'upgrades')) id = 'era';
    UI.tab = id;
    $$('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === id));
    $$('#panelBody > .tab-page').forEach((p) => p.classList.toggle('active', p.dataset.tab === id));
    if (UI.layout === 3) { $('#page-gens').classList.add('active'); $('#page-upgrades').classList.add('active'); }
    const tabBtn = $('.tab[data-tab="' + id + '"]');
    if (tabBtn && tabBtn.scrollIntoView && !silent) tabBtn.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    if (!silent) A.play('tab');
    UI.renderTab(id);
    UI.syncNav();
  };
  UI.renderTab = function (id) {
    switch (id) {
      case 'gens': UI.renderGens(); break;
      case 'upgrades': UI.renderUpgrades(true); break;
      case 'era': UI.renderEra(); break;
      case 'loot': UI.renderLoot(); break;
      case 'ach': UI.renderAch(); break;
      case 'perks': UI.renderPerks(); break;
      case 'museum': UI.renderMuseum(); break;
      case 'stats': UI.renderStats(); break;
      case 'options': UI.syncOptions(); break;
    }
  };
  UI.visible = function (id) {
    if (UI.layout === 3 && (id === 'gens' || id === 'upgrades')) return true;
    if (UI.tab !== id) return false;
    if (UI.layout === 1) return $('#app').classList.contains('sheet-open');
    return true;
  };

  // ───────────────────────── Thema je Epoche ─────────────────────────
  function lum(hex) {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }
  UI.applyTheme = function (era, instant) {
    const e = PZ.ERAS[era];
    const root = document.documentElement.style;
    root.setProperty('--acc', e.accent);
    root.setProperty('--acc2', e.accent2);
    root.setProperty('--acc-ink', lum(e.accent) > 0.55 ? '#0b0a12' : '#ffffff');
    root.setProperty('--era-bg', e.bg);
    const crtLv = [0.95, 0.85, 0.75, 0.6, 0.5, 0.4, 0.3, 0.25, 0.2, 0.2][era];
    root.setProperty('--crt', String(crtLv));
    document.body.classList.toggle('crt-flicker', era === 0 && E.S.settings.crt && E.S.settings.motion);
    document.body.dataset.era = era;
    $('#ctrlImg').src = 'assets/img/ctrl/' + e.ctrl + '.webp';
    $('#ctrlImg').alt = e.ctrlName;
    $('#eraName').textContent = e.name;
    const meta = document.querySelector('meta[name=theme-color]');
    if (meta) meta.content = e.bg;
    PZ.BG.setScene(e.scene, instant);
    A.playMusic(A.trackForEra(era));
    UI.renderShelf();
  };

  // ───────────────────────── Geräte ─────────────────────────
  UI.genRows = {};
  UI.buildGensPage = function () {
    const p = $('#page-gens');
    p.innerHTML = '<div class="page-head"><span class="col-title">GERÄTE</span><div class="seg" id="buySeg">' +
      [1, 10, 100, 'max'].map((m) => '<button data-m="' + m + '">' + (m === 'max' ? 'MAX' : '×' + m) + '</button>').join('') +
      '</div></div><div class="gen-list" id="genList"></div>';
    $('#buySeg').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      UI.buyMode = b.dataset.m === 'max' ? 'max' : +b.dataset.m;
      A.play('toggle');
      UI.syncBuySeg(); UI.updateGens(true);
    });
    UI.syncBuySeg();
    $('#genList').addEventListener('click', (e) => {
      const row = e.target.closest('.gen'); if (!row || row.classList.contains('locked')) return;
      UI.buyGen(row.dataset.id, row);
    });
    $('#genList').addEventListener('contextmenu', (e) => {
      const row = e.target.closest('.gen'); if (!row || row.classList.contains('locked')) return;
      e.preventDefault(); UI.openMuseum(row.dataset.id);
    });
    // Langer Druck → Museum
    let lp = null;
    $('#genList').addEventListener('touchstart', (e) => {
      const row = e.target.closest('.gen'); if (!row || row.classList.contains('locked')) return;
      lp = setTimeout(() => { lp = 'fired'; UI.openMuseum(row.dataset.id); }, 550);
    }, { passive: true });
    const cancel = () => { if (lp && lp !== 'fired') clearTimeout(lp); };
    $('#genList').addEventListener('touchend', (e) => { if (lp === 'fired') { e.preventDefault(); } cancel(); lp = null; });
    $('#genList').addEventListener('touchmove', cancel, { passive: true });
  };
  UI.syncBuySeg = function () { $$('#buySeg button').forEach((b) => b.classList.toggle('on', String(UI.buyMode) === b.dataset.m)); };

  UI.buyGen = function (id, row) {
    const S = E.S;
    let n = UI.buyMode === 'max' ? E.maxAffordable(id) : UI.buyMode;
    if (!n) n = 1;
    const got = E.buyGen(id, n);
    if (got) {
      A.play('buy', { rate: 0.95 + Math.random() * 0.1 });
      if (row) { row.classList.remove('bump'); void row.offsetWidth; row.classList.add('bump'); row.classList.remove('fresh'); }
      UI._seenGens = UI._seenGens || {};
      UI._seenGens[id] = true;
      UI.updateGens(true);
    } else A.play('deny');
    return got;
  };

  // ───────────────────────── Regal ─────────────────────────
  // Gekaufte Geräte der aktuellen Epoche stehen unter dem Controller; Rahmen ab 10/25/50 Stück
  const SHELF_TIERS = [10, 25, 50];
  UI.shelf = { era: -1, items: {} };
  UI.renderShelf = function () {
    const S = E.S, sh = UI.shelf;
    if (sh.era !== S.era) {
      sh.era = S.era; sh.items = {};
      const row = $('#shelfRow');
      row.innerHTML = '';
      PZ.ERAS[S.era].gens.forEach((g) => {
        const el = document.createElement('div');
        el.className = 'sh-item' + (isPhoto(g.id) ? ' photo' : '');
        el.innerHTML = '<img src="' + g.img + '" alt="" draggable="false"><span class="n"></span>';
        row.appendChild(el);
        sh.items[g.id] = { el: el, img: $('img', el), n: $('.n', el), owned: -1 };
      });
    }
    for (const id in sh.items) updateShelfItem(id);
  };
  function updateShelfItem(id) {
    const it = UI.shelf.items[id];
    const owned = E.S.gens[id] || 0;
    if (owned === it.owned) return;
    it.owned = owned;
    const tier = SHELF_TIERS.filter((t) => owned >= t).length;
    it.el.classList.toggle('empty', !owned);
    it.el.classList.remove('t1', 't2', 't3');
    if (tier) it.el.classList.add('t' + tier);
    it.n.textContent = '×' + owned;
    it.el.title = PZ.GEN[id].name + (owned ? ' ×' + owned : ' (noch nicht gekauft)');
  }
  function restartAnim(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
  function shelfLanded(it) {
    restartAnim(it.el, 'pop');
    const r = it.el.getBoundingClientRect(), s = $('#stage').getBoundingClientRect();
    if (PZ.FX && r.width) PZ.FX.burst(r.left - s.left + r.width / 2, r.bottom - s.top - 6, 18, ['#ffd23f', '#ffffff', PZ.ERAS[E.S.era].accent], 150);
  }
  UI.shelfBought = function (id) {
    const it = UI.shelf.items[id];
    if (!it) return;
    const first = it.owned <= 0;
    updateShelfItem(id);
    if (!first) { restartAnim(it.el, 'bump'); return; }
    // Erstes Exemplar: Foto fliegt aus der Shop-Zeile ins Regal
    const row = UI.genRows && UI.genRows[id];
    const src = row && $('.gen-thumb img', row.el);
    const from = src && src.getBoundingClientRect();
    const to = it.img.getBoundingClientRect();
    const visible = from && from.width > 0 && from.bottom > 0 && from.top < window.innerHeight;
    if (!visible || !to.width || !E.S.settings.motion || !it.img.animate) { shelfLanded(it); return; }
    const fly = document.createElement('img');
    fly.className = 'sh-fly'; fly.src = PZ.GEN[id].img; fly.alt = '';
    fly.style.left = to.left + 'px'; fly.style.top = to.top + 'px';
    fly.style.width = to.width + 'px'; fly.style.height = to.height + 'px';
    document.body.appendChild(fly);
    it.img.style.visibility = 'hidden';
    const sc = Math.min(from.width / to.width, from.height / to.height);
    const dx = from.left + from.width / 2 - (to.left + to.width / 2), dy = from.top + from.height / 2 - (to.top + to.height / 2);
    fly.animate([
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + sc + ')', opacity: 0.7 },
      { transform: 'translate(' + dx * 0.45 + 'px,' + (Math.min(dy, 0) * 0.5 - 90) + 'px) scale(1.5)', opacity: 1, offset: 0.55 },
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
    ], { duration: 720, easing: 'cubic-bezier(.3,.1,.3,1)' }).onfinish = () => { fly.remove(); it.img.style.visibility = ''; shelfLanded(it); };
  };
  // Geräte werfen ab und zu eine Münze aus – öfter, je mehr sie zur Produktion beitragen
  UI.shelfTick = function () {
    if (!E.S.settings.particles || document.hidden || UI.paused) return;
    const shelf = $('#shelf'), base = shelf.getBoundingClientRect();
    if (!base.width || shelf.querySelectorAll('.sh-coin').length > 12) return;
    const total = Math.max(E.cpsBase, 1e-9);
    for (const id in UI.shelf.items) {
      const it = UI.shelf.items[id];
      if (it.owned <= 0) continue;
      if (Math.random() > 0.15 + ((E.genProd[id] || 0) / total) * 0.75) continue;
      const r = it.img.getBoundingClientRect();
      const c = document.createElement('img');
      c.className = 'sh-coin'; c.src = SPR.url('coin', 2); c.alt = '';
      c.style.left = (r.left - base.left + r.width * (0.3 + Math.random() * 0.4)) + 'px';
      c.style.top = (r.top - base.top + r.height * 0.2) + 'px';
      c.style.animationDelay = (Math.random() * 0.6).toFixed(2) + 's';
      shelf.appendChild(c);
      setTimeout(() => c.remove(), 1800);
    }
  };

  UI.renderGens = function () {
    const S = E.S;
    const list = $('#genList');
    const unlocked = PZ.GENS.filter((g) => g.era <= S.era);
    const next = S.era < 9 ? PZ.ERAS[S.era + 1].gens[0] : null;
    const sig = unlocked.map((g) => g.id).join(',') + '|' + (next ? next.id : '');
    if (list.dataset.sig !== sig) {
      list.dataset.sig = sig;
      UI.genRows = {};
      list.innerHTML = '';
      unlocked.slice().reverse().forEach((g) => {
        const photo = isPhoto(g.id);
        const hist = H.gens[g.id] || {};
        const el = document.createElement('button');
        el.className = 'gen' + ((S.gens[g.id] || 0) === 0 && S.era === g.era ? ' fresh' : '');
        el.dataset.id = g.id;
        el.innerHTML = '<div class="gen-thumb' + (photo ? ' photo' : '') + '"><img src="' + g.img + '" alt="" loading="lazy" draggable="false"></div>' +
          '<div class="gen-info"><div class="gen-name">' + esc(g.name) + ' <span class="gen-year">' + g.year + '</span></div>' +
          '<div class="gen-tag">' + esc(hist.tagline || '') + '</div>' +
          '<div class="gen-meta"><span class="gen-cost">' + coinImg() + '<span class="c"></span></span><span class="gen-prod"></span></div></div>' +
          '<div><div class="gen-count">0</div><span class="gen-buyn"></span></div>';
        el.dataset.tipGen = g.id;
        list.appendChild(el);
        UI.genRows[g.id] = { el: el, cost: $('.c', el), prod: $('.gen-prod', el), count: $('.gen-count', el), buyn: $('.gen-buyn', el), last: {} };
      });
      if (next) {
        const el = document.createElement('div');
        el.className = 'gen locked';
        el.innerHTML = '<div class="gen-thumb"><img src="' + next.img + '" alt="" loading="lazy"></div><div class="gen-info"><div class="gen-name">??? <span class="gen-year">' + next.year + '</span></div><div class="gen-tag">Wird in der Epoche „' + esc(PZ.ERAS[next.era].name) + '“ erfunden.</div></div><div></div>';
        list.appendChild(el);
      }
    }
    UI.updateGens(true);
  };

  UI.updateGens = function (force) {
    const S = E.S;
    const total = Math.max(E.cpsBase, 1e-9);
    for (const id in UI.genRows) {
      const r = UI.genRows[id];
      const g = PZ.GEN[id];
      const owned = S.gens[id] || 0;
      let n = UI.buyMode === 'max' ? E.maxAffordable(id) : UI.buyMode;
      const showN = n || 1;
      const cost = E.genCost(id, showN);
      const can = cost <= S.coins && (UI.buyMode !== 'max' || n > 0);
      const costTxt = fmt(cost);
      if (force || r.last.cost !== costTxt) { r.cost.textContent = costTxt; r.last.cost = costTxt; }
      if (force || r.last.can !== can) { r.el.classList.toggle('can', can); r.el.classList.toggle('cannot', !can); r.last.can = can; }
      if (force || r.last.owned !== owned) { r.count.textContent = owned; r.last.owned = owned; }
      const bn = UI.buyMode === 1 ? '' : '×' + showN;
      if (force || r.last.bn !== bn) { r.buyn.textContent = bn; r.last.bn = bn; }
      const each = g.baseProd * E.genMultOf(g) * E.globalMult(false);
      const prodTxt = owned ? fmt(E.genProd[id]) + '/s · ' + U.pct(E.genProd[id] / total, 1) : 'je ' + U.fmt(each, 1) + '/s';
      if (force || r.last.prod !== prodTxt) { r.prod.textContent = prodTxt; r.last.prod = prodTxt; }
    }
  };

  // ───────────────────────── Upgrades ─────────────────────────
  UI.buildUpgradesPage = function () {
    const p = $('#page-upgrades');
    p.innerHTML = '<div class="page-head"><span class="col-title">UPGRADES <span id="upgCount" style="color:var(--muted)"></span></span><button class="btn small gold" id="buyAll">Alle kaufen</button></div>' +
      '<div class="upg-detail" id="upgDetail"></div><div class="upg-grid" id="upgGrid"></div><div class="hint" id="upgEmpty" hidden>Keine Upgrades verfügbar. Kaufe mehr Geräte, klicke mehr – oder erreiche die nächste Epoche.</div>';
    $('#buyAll').addEventListener('click', () => {
      let n = 0;
      for (const u of E.availableUpgrades()) { if (u.cost <= E.S.coins && E.buyUpgrade(u.id)) n++; else if (u.cost > E.S.coins) break; }
      if (n) { UI.toast({ icon: 'bolt', small: 'UPGRADES', title: n + ' Upgrade' + (n > 1 ? 's' : '') + ' gekauft' }); } else A.play('deny');
      UI.renderUpgrades(true);
    });
    $('#upgGrid').addEventListener('click', (e) => {
      const t = e.target.closest('.upg-t'); if (!t) return;
      const id = t.dataset.id;
      if (UI.fine || UI.selUpg === id) UI.buyUpg(id);
      else { UI.selUpg = id; UI.renderUpgDetail(); UI.markSel(); A.play('toggle'); }
    });
    $('#upgGrid').addEventListener('mouseover', (e) => {
      const t = e.target.closest('.upg-t'); if (!t || !UI.fine) return;
      if (UI.selUpg !== t.dataset.id) { UI.selUpg = t.dataset.id; UI.renderUpgDetail(); UI.markSel(); }
    });
    $('#upgDetail').addEventListener('click', (e) => { const b = e.target.closest('[data-buy]'); if (b) UI.buyUpg(b.dataset.buy); });
  };
  UI.markSel = function () { $$('#upgGrid .upg-t').forEach((t) => t.classList.toggle('sel', t.dataset.id === UI.selUpg)); };
  UI.buyUpg = function (id) {
    if (E.buyUpgrade(id)) {
      UI.selUpg = null;
      UI.renderUpgrades(true);
      UI.updateGens(true);
    } else A.play('deny');
  };
  UI.upgIcon = function (u, cls) {
    const era = u.icon.era !== undefined ? u.icon.era : (u.req && u.req.era) || (u.gen ? PZ.GEN[u.gen].era : 0);
    const col = PZ.ERAS[era] ? PZ.ERAS[era].accent : '#888';
    let inner;
    if (u.icon.gen) inner = '<img class="gimg" src="' + PZ.GEN[u.icon.gen].img + '" alt="" loading="lazy"><span class="badge">' + U.roman(u.icon.tier + 1) + '</span>';
    else inner = '<img class="spr" src="' + SPR.url(u.icon.sprite, 3) + '" alt="">';
    return '<span class="upg-t ' + (cls || '') + '" data-id="' + u.id + '" style="background:color-mix(in srgb, ' + col + ' 16%, rgba(255,255,255,.03))"><span class="kind" style="background:' + KIND_COL[u.kind] + '"></span>' + inner + '</span>';
  };
  UI.renderUpgrades = function (force) {
    const list = E.availableUpgrades();
    const sig = list.map((u) => u.id).join(',');
    const grid = $('#upgGrid');
    if (force || grid.dataset.sig !== sig) {
      grid.dataset.sig = sig;
      grid.innerHTML = list.map((u) => UI.upgIcon(u).replace('<span class="upg-t', '<button class="upg-t').replace(/<\/span>$/, '</button>')).join('');
      $('#upgEmpty').hidden = list.length > 0;
      $('#upgCount').textContent = '(' + Object.keys(E.S.upg).length + '/' + PZ.UPGRADES.length + ')';
      if (UI.selUpg && !list.find((u) => u.id === UI.selUpg)) UI.selUpg = null;
      UI.renderUpgDetail();
      UI.fitUpgDetail();
      UI.markSel();
    }
    UI.updateUpgrades();
  };
  UI.updateUpgrades = function () {
    const c = E.S.coins;
    $$('#upgGrid .upg-t').forEach((t) => {
      const u = PZ.UPG[t.dataset.id];
      const can = u.cost <= c;
      t.classList.toggle('can', can); t.classList.toggle('cannot', !can);
    });
    const b = $('#upgDetail [data-buy]');
    if (b) b.disabled = PZ.UPG[b.dataset.buy].cost > c;
    const first = E.availableUpgrades()[0];
    $('#buyAll').disabled = !first || first.cost > c;
  };
  const upgCard = (u) => '<div class="upg-card">' + UI.upgIcon(u) + '<div><h4>' + esc(u.name) + '</h4><p>' + esc(u.desc) + '</p><div class="row"><span class="price">' + coinImg() + fmt(u.cost) + '</span><span style="font-size:12px;color:var(--muted)">' + KIND_NAME[u.kind] + '</span><button class="btn small" data-buy="' + u.id + '">Kaufen</button></div></div></div>';
  UI.renderUpgDetail = function () {
    const box = $('#upgDetail');
    const list = E.availableUpgrades();
    const u = PZ.UPG[UI.selUpg] || list.find((x) => x.cost <= E.S.coins) || list[0];
    if (!u) { box.innerHTML = ''; box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = upgCard(u);
    UI.updateUpgrades();
  };
  // Karte so hoch wie die längste verfügbare Beschreibung – sonst springt das Raster darunter beim Überfahren
  UI.fitUpgDetail = function () {
    const box = $('#upgDetail');
    if (!box || box.hidden || !box.offsetWidth) return;
    box.style.removeProperty('--upg-h');
    let h = 0;
    for (const u of E.availableUpgrades()) { box.innerHTML = upgCard(u); h = Math.max(h, box.firstChild.offsetHeight); }
    box.style.setProperty('--upg-h', h + 'px');
    UI.renderUpgDetail();
  };

  // ───────────────────────── Epoche ─────────────────────────
  UI.renderEra = function () {
    const S = E.S;
    const p = $('#page-era');
    const e = PZ.ERAS[S.era];
    const nextE = PZ.ERAS[S.era + 1];
    let html = '<div class="era-hero"><div class="years">' + e.years[0] + ' – ' + (S.era === 9 ? '∞' : e.years[1]) + '</div><h3>' + esc(e.name) + '</h3><p>' + esc((H.eras[S.era] || {}).intro || '') + '</p></div>';
    const war = E.pendingWar();
    if (war) {
      html += '<div class="section-title">Entscheidung</div><div class="war-box"><h4>' + esc(war.title) + '</h4><p class="hint">' + esc(war.text) + '</p><button class="btn" id="warOpen">Seite wählen</button></div>';
    }
    if (nextE) {
      html += '<div class="section-title">Zeitsprung</div><div class="hint">Nächste Epoche: <b>' + esc(nextE.name) + '</b> (' + nextE.years[0] + ')</div>' +
        '<div class="req" id="eraReq"></div><button class="btn wide" id="eraGo">Zeitsprung ins Jahr ' + nextE.years[0] + '</button>';
    } else {
      html += '<div class="section-title">Zeitsprung</div><p class="hint">Du bist in der Zukunft angekommen. Weiter geht es nur durch Crashs, Sammeln und Bosse.</p>';
    }
    // Konsolenkriege
    const chosen = PZ.WARS.filter((w) => S.wars[w.id]);
    if (chosen.length) {
      html += '<div class="section-title">Deine Lager</div><div class="war-choice">' + chosen.map((w) => S.wars[w.id].map((oid) => {
        const o = w.options.find((x) => x.id === oid);
        return '<span class="war-pill" style="background:' + o.color + '" data-tip="' + esc(o.desc) + '">' + esc(o.name) + '</span>';
      }).join('')).join('') + '</div>';
    }
    // Crash
    if (S.era >= 2 || S.crashes > 0) {
      html += '<div class="section-title">Der große Crash</div><div class="crash-box"><h4>VIDEO GAME CRASH</h4>' +
        '<p>1983 brach der Markt zusammen – und die Branche erfand sich neu. Löse einen Crash aus: Münzen, Geräte, Upgrades und Epoche werden zurückgesetzt. Du erhältst <b>Nostalgie</b> (+2 % Produktion je Punkt, dauerhaft) für die Hall of Fame.</p>' +
        '<p>Bleibt erhalten: Kult-Spiele, Trophäen, Perks, Boss-Siege, Statistiken.</p>' +
        '<div class="crash-gain">' + SPR.img('tape', '', 3) + '<span id="crashGain">+0</span></div>' +
        '<div class="hint" id="crashNote"></div><button class="btn danger wide" id="crashGo">Crash auslösen</button></div>';
    }
    // Zeitstrahl
    html += '<div class="section-title">Zeitstrahl</div><div class="timeline">' + PZ.ERAS.map((x) => {
      const st = x.id < S.era ? 'done' : x.id === S.era ? 'cur' : x.id <= S.maxEra ? 'done' : 'lock';
      const best = S.stats.bestRunTime[x.id];
      return '<div class="tl ' + st + '" style="--eracol:' + x.accent + '"><span class="y">' + x.years[0] + '</span><span class="dotc"></span><span class="n">' + (x.id <= S.maxEra ? esc(x.name) : '???') + (best ? '<small>Bestzeit ' + U.time(best) + '</small>' : '') + '</span></div>';
    }).join('') + '</div>';
    p.innerHTML = html;
    const wo = $('#warOpen'); if (wo) wo.addEventListener('click', () => UI.warModal(war));
    const eg = $('#eraGo'); if (eg) eg.addEventListener('click', UI.onEraBtn);
    const cg = $('#crashGo'); if (cg) cg.addEventListener('click', UI.crashConfirm);
    UI.updateEra();
  };
  UI.updateEra = function () {
    const S = E.S;
    const req = $('#eraReq');
    if (req) {
      const need = E.eraReqCount(), have = E.eraCount(S.era), cost = E.eraCost();
      const okG = have >= need, okC = S.coins >= cost;
      req.innerHTML =
        '<div class="req-row"><span class="' + (okG ? 'ok">✔' : 'no">○') + '</span><span>Geräte dieser Epoche</span><span class="v">' + Math.min(have, need) + ' / ' + need + '</span><div class="bar"><span style="width:' + Math.min(100, have / need * 100) + '%"></span></div></div>' +
        '<div class="req-row"><span class="' + (okC ? 'ok">✔' : 'no">○') + '</span><span>Forschungskosten</span><span class="v">' + fmt(Math.min(S.coins, cost)) + ' / ' + fmt(cost) + '</span><div class="bar"><span style="width:' + Math.min(100, S.coins / cost * 100) + '%"></span></div></div>' +
        (E.pendingWar() ? '<div class="req-row"><span class="no">!</span><span>Konsolenkrieg-Entscheidung offen</span><span></span></div>' : '');
      const b = $('#eraGo'); if (b) b.disabled = !E.canAdvance();
    }
    const cg = $('#crashGain');
    if (cg) {
      const g = E.crashGain();
      cg.textContent = '+' + fmt(g) + ' Nostalgie';
      const note = $('#crashNote');
      if (S.era < 2) note.textContent = 'Verfügbar ab der 8-Bit-Ära.';
      else if (g < 1) note.textContent = 'Verdiene in diesem Durchlauf mindestens ' + fmt(1e9) + ' Münzen.';
      else note.textContent = 'Jetzt: +' + U.pct(g * (0.02 + E.M.npPower), 0) + ' Produktion für immer.';
      $('#crashGo').disabled = !E.canCrash();
    }
  };

  UI.onEraBtn = function () {
    const war = E.pendingWar();
    if (war) { UI.warModal(war); return; }
    if (E.canAdvance()) { E.advanceEra(); return; }
    A.play('deny');
    UI.showTab('era');
    if (UI.layout === 1) { $('#app').classList.add('sheet-open'); UI.syncNav(); }
  };

  UI.updateEraBtn = function () {
    const S = E.S;
    const b = $('#eraBtn');
    const war = E.pendingWar();
    if (war) {
      b.classList.add('ready'); b.classList.remove('max');
      $('#eraBtnTop').textContent = 'ENTSCHEIDUNG!';
      $('#eraBtnMain').textContent = war.title;
      $('#eraProg').style.width = '100%';
      return;
    }
    if (S.era >= 9) {
      b.classList.remove('ready'); b.classList.add('max');
      $('#eraBtnTop').textContent = 'ENDE DER ZEITLEISTE';
      $('#eraBtnMain').textContent = 'Crashe für mehr Nostalgie';
      $('#eraProg').style.width = '100%';
      return;
    }
    const need = E.eraReqCount(), have = E.eraCount(S.era), cost = E.eraCost();
    const p = Math.min(1, have / need) * 0.5 + Math.min(1, S.coins / cost) * 0.5;
    const ready = E.canAdvance();
    b.classList.toggle('ready', ready); b.classList.remove('max');
    $('#eraBtnTop').textContent = ready ? 'ZEITSPRUNG BEREIT!' : 'NÄCHSTE EPOCHE · ' + PZ.ERAS[S.era + 1].years[0];
    $('#eraBtnMain').textContent = ready ? PZ.ERAS[S.era + 1].name : (have < need ? 'Geräte ' + have + '/' + need : fmt(S.coins) + ' / ' + fmt(cost));
    $('#eraProg').style.width = (p * 100).toFixed(1) + '%';
  };

  UI.warModal = function (war) {
    if (!war) return;
    const doppel = E.M.unlock.doppel;
    let sel = [];
    const m = UI.modal('<h2>' + esc(war.title) + '</h2><p>' + esc(war.text) + (doppel ? ' <b>Doppelagent:</b> Du darfst beide Seiten wählen.' : '') + '</p><div class="war-cards">' +
      war.options.map((o) => '<button class="war-card" data-o="' + o.id + '" style="--wc:' + o.color + '"><b>' + esc(o.name) + '</b><i>„' + esc(o.motto) + '“</i><span>' + esc(o.desc) + '</span></button>').join('') +
      '</div><div class="modal-actions"><button class="btn" id="warOk" disabled>Entscheidung treffen</button></div>', { wide: true, noClose: true });
    m.addEventListener('click', (e) => {
      const c = e.target.closest('.war-card');
      if (c) {
        const id = c.dataset.o;
        if (doppel) { sel = sel.includes(id) ? sel.filter((x) => x !== id) : sel.concat(id).slice(-2); }
        else sel = [id];
        $$('.war-card', m).forEach((x) => x.classList.toggle('sel', sel.includes(x.dataset.o)));
        $('#warOk', m).disabled = !sel.length;
        A.play('toggle');
      }
      if (e.target.closest('#warOk') && sel.length) {
        E.chooseWar(war.id, sel);
        UI.closeModal(m);
        UI.toast({ icon: 'star', small: 'KONSOLENKRIEG', title: sel.map((id) => war.options.find((o) => o.id === id).name).join(' + ') });
        UI.renderEra(); UI.updateEraBtn();
      }
    });
  };

  UI.crashConfirm = function () {
    if (!E.canCrash()) { A.play('deny'); return; }
    const g = E.crashGain();
    const m = UI.modal('<h2>Crash auslösen?</h2><p>Du verlierst Münzen, Geräte, Upgrades und kehrst zurück in die Epoche „' + esc(PZ.ERAS[E.M.startEra].name) + '“.</p><div class="big-num" style="color:var(--np)">' + SPR.img('tape', '', 3) + '+' + fmt(g) + ' Nostalgie</div><p class="hint">Danach: +' + U.pct((E.S.npTotal + g) * (0.02 + E.M.npPower), 0) + ' Produktion dauerhaft (bisher +' + U.pct(E.npBonus(), 0) + ').</p><div class="modal-actions"><button class="btn ghost" data-close>Abbrechen</button><button class="btn danger" id="doCrash">CRASH!</button></div>');
    $('#doCrash', m).addEventListener('click', () => { UI.closeModal(m); UI.crashSequence(); });
  };
  UI.crashSequence = function () {
    const S = E.S;
    const g = E.crashGain();
    document.body.classList.add('glitching');
    A.pauseMusic();
    setTimeout(() => {
      document.body.classList.remove('glitching');
      const ok = E.crash();
      if (!ok) return;
      const ov = document.createElement('div');
      ov.className = 'crash-screen';
      ov.innerHTML = '<div class="photo" style="background-image:url(assets/img/misc/et-landfill.webp)"></div><div class="go">GAME OVER</div>' +
        '<p>Alamogordo, New Mexico: 1983 landeten Atari-Module auf einer Deponie – 2014 wurden sie wieder ausgegraben. Auch du beginnst von vorn, aber die Erinnerung bleibt.</p>' +
        '<div class="big-num" style="color:var(--np);justify-content:center">' + SPR.img('tape', '', 3) + '+' + fmt(g) + ' Nostalgie</div>' +
        '<div class="cont">CONTINUE?</div><button class="btn" id="crashCont">NEUES SPIEL</button>';
      document.body.appendChild(ov);
      $('#crashCont', ov).addEventListener('click', () => {
        ov.remove();
        setTimeout(UI.flushToasts, 600);
        UI.fullRefresh();
        UI.applyTheme(S.era, true);
        A.play('era');
        const w = E.pendingWar(); if (w) setTimeout(() => UI.warModal(w), 300);
      });
    }, 1300);
  };

  // ───────────────────────── Sammlung ─────────────────────────
  function hashHue(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360; return h; }
  const coverOf = (g) => IMG['cover-' + g.id];
  UI.medium = function (g, owned, big) {
    const hue = hashHue(g.id);
    const lbl = 'hsl(' + hue + ',70%,' + (g.fmt === 'disk' ? 45 : 42) + '%)';
    const cv = owned && coverOf(g);
    return '<div class="med ' + g.fmt + ' r-' + g.rarity + (owned ? '' : ' unknown') + (cv ? ' has-cover' : '') + '" style="--lbl:' + lbl + '"><div class="lbl">' +
      (cv ? '<img src="' + cv.path + '" alt="" loading="lazy" draggable="false">' : owned ? esc(g.name) : '?') + '</div></div>';
  };
  // Großansicht: ganzes Cover, der Datenträger liegt davor
  UI.coverArt = function (g, owned) {
    const cv = owned && coverOf(g);
    if (!cv) return UI.medium(g, owned);
    return '<div class="cover-art r-' + g.rarity + '"><img src="' + cv.path + '" alt="Cover: ' + esc(g.name) + '" width="' + cv.w + '" height="' + cv.h + '" draggable="false">' + UI.medium(g, true) + '</div>';
  };
  UI.renderLoot = function () {
    const S = E.S;
    const p = $('#page-loot');
    const have = Object.keys(S.loot).length;
    const sums = E.lootSums || {};
    const chips = [];
    const L = PZ.LOOT_FX;
    for (const k in sums) if (sums[k] > 0) chips.push('<span class="fx-chip">' + L[k].label(sums[k], {}) + '</span>');
    (E.lootEraSums || []).forEach((v, k) => { if (v > 0) chips.push('<span class="fx-chip">' + L.era.label(v, { era: k }) + '</span>'); });
    let html = '<div class="loot-head"><div class="loot-count">' + have + ' / ' + PZ.LOOT.length + '<small>Kult-Spiele gesammelt · bleiben nach jedem Crash erhalten</small></div></div>' +
      '<div class="fx-list">' + (chips.join('') || '<span class="hint">Noch keine Boni – besiege Bosse, sammle Power-Ups oder wühl im Grabbeltisch.</span>') + '</div>' +
      '<div class="bin">' + SPR.img('cart', '', 3) + '<div><b>Grabbeltisch</b><span>Ein zufälliges Kult-Spiel aus den bisherigen Epochen. Doppelte steigern die Stufe (max. ' + PZ.LOOT_MAX_LEVEL + ').</span></div><button class="btn gold small" id="binBuy"><span id="binCost"></span></button></div>';
    for (let k = 0; k <= 9; k++) {
      const games = PZ.LOOT.filter((g) => g.era === k);
      const got = games.filter((g) => S.loot[g.id]).length;
      html += '<div class="section-title">' + esc(PZ.ERAS[k].short) + ' · ' + got + '/' + games.length + '</div><div class="loot-grid">' +
        games.map((g) => {
          const lv = S.loot[g.id] || 0;
          return '<button class="li' + (lv ? '' : ' none') + '" data-g="' + g.id + '">' + (lv ? '<span class="lv">' + (lv >= PZ.LOOT_MAX_LEVEL ? 'MAX' : 'Lv' + lv) + '</span>' : '') + UI.medium(g, lv > 0) + '<span class="t">' + (lv ? esc(g.name) : (k <= S.maxEra ? g.year : '????')) + '</span></button>';
        }).join('') + '</div>';
    }
    p.innerHTML = html;
    $('#binBuy').addEventListener('click', () => {
      if (E.S.era < 1) { A.play('deny'); UI.toast({ icon: 'cart', small: 'GRABBELTISCH', title: 'Öffnet im Arcade-Zeitalter' }); return; }
      const r = E.buyBin();
      if (!r) { A.play('deny'); return; }
      UI.renderLoot();
    });
    p.onclick = (e) => { const b = e.target.closest('.li'); if (b) UI.lootDetail(b.dataset.g); };
    UI.updateLoot();
  };
  UI.updateLoot = function () {
    const c = $('#binCost'); if (!c) return;
    const cost = E.binCost();
    c.innerHTML = coinImg() + ' ' + fmt(cost);
    $('#binBuy').disabled = E.S.coins < cost || E.S.era < 1;
  };
  UI.lootDetail = function (id) {
    const g = PZ.LOOT_BY[id];
    const lv = E.S.loot[id] || 0;
    const R = PZ.RARITY[g.rarity];
    const lp = E.M.lootPower;
    const cur = lv ? PZ.LOOT_FX[g.fx].label(PZ.lootValue(g, lv, lp), g) : '—';
    const nxt = lv < PZ.LOOT_MAX_LEVEL ? PZ.LOOT_FX[g.fx].label(PZ.lootValue(g, lv + 1, lp), g) : 'Maximal';
    const cv = lv && coverOf(g);
    UI.modal('<div class="loot-reveal">' + UI.coverArt(g, lv > 0) + '<div class="rar" style="color:' + R.color + '">' + R.name.toUpperCase() + '</div><h3>' + (lv ? esc(g.name) : '???') + '</h3><div class="hint">' + g.year + ' · ' + esc(PZ.ERAS[g.era].name) + '</div>' +
      (lv ? '<p>' + esc(g.blurb) + '</p><p class="fx">Stufe ' + lv + ': ' + cur + '</p><p class="hint">Nächste Stufe: ' + nxt + '</p>' : '<p class="hint">Noch nicht gefunden. Effekt: ' + PZ.LOOT_FX[g.fx].label(PZ.lootValue(g, 1, lp), g) + '</p>') +
      (cv ? '<div class="cred">Cover: ' + esc(cv.author || '') + ' · <a href="' + esc(cv.source || '#') + '" target="_blank" rel="noopener">Quelle</a></div>' : '') +
      '</div><div class="modal-actions"><button class="btn" data-close>OK</button></div>');
  };
  UI.lootReveal = function (res) {
    const g = res.game, R = PZ.RARITY[g.rarity];
    A.play(g.rarity === 'l' ? 'loot_legendary' : 'loot');
    UI.modal('<div class="loot-reveal">' + UI.coverArt(g, true) + '<div class="rar" style="color:' + R.color + '">' + R.name.toUpperCase() + (res.isNew ? ' · NEU!' : ' · STUFE ' + res.level) + '</div><h3>' + esc(g.name) + '</h3><div class="hint">' + g.year + '</div><p>' + esc(g.blurb) + '</p><p class="fx">' + PZ.LOOT_FX[g.fx].label(PZ.lootValue(g, res.level, E.M.lootPower), g) + '</p></div><div class="modal-actions"><button class="btn" data-close>Ins Regal!</button></div>');
  };

  // ───────────────────────── Trophäen ─────────────────────────
  UI.renderAch = function () {
    const S = E.S;
    const p = $('#page-ach');
    const all = PZ.ACH;
    const got = all.filter((a) => S.ach[a.id]).length;
    const f = UI.achFilter;
    const list = all.filter((a) => f === 'all' || (f === 'got' ? S.ach[a.id] : !S.ach[a.id]));
    const tierIcon = { b: 'trophy', s: 'trophy', g: 'trophy', p: 'gem' };
    p.innerHTML = '<div class="ach-sum"><div class="ach-big">' + got + ' / ' + all.length + '<small>Trophäen · +' + U.pct(E.trophyBonus(), 0) + ' Produktion</small></div></div>' +
      '<div class="filters">' + [['all', 'Alle'], ['got', 'Freigeschaltet'], ['open', 'Offen']].map((x) => '<button class="chip' + (f === x[0] ? ' on' : '') + '" data-f="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>' +
      '<div class="ach-grid">' + list.map((a) => {
        const has = !!S.ach[a.id];
        const hidden = a.secret && !has;
        return '<div class="ach t-' + a.tier + (has ? '' : ' locked') + '"><span class="tico">' + SPR.img(hidden ? 'skull' : tierIcon[a.tier], '', 2) + '</span><div><b>' + (hidden ? '???' : esc(a.name)) + '</b><span>' + esc(hidden ? a.hint || 'Geheim' : a.desc) + '</span></div></div>';
      }).join('') + '</div>';
    $$('.chip', p).forEach((c) => c.addEventListener('click', () => { UI.achFilter = c.dataset.f; A.play('toggle'); UI.renderAch(); }));
  };

  // ───────────────────────── Hall of Fame ─────────────────────────
  UI.renderPerks = function () {
    const S = E.S;
    const p = $('#page-perks');
    p.innerHTML = '<div class="np-hero">' + SPR.img('tape', '', 3) + '<div><b>' + fmt(S.np) + ' Nostalgie</b><span>Insgesamt ' + fmt(S.npTotal) + ' gesammelt · +' + U.pct(E.npBonus(), 0) + ' Produktion · ' + S.crashes + ' Crash' + (S.crashes === 1 ? '' : 's') + '</span></div></div>' +
      (S.npTotal === 0 ? '<p class="hint">Nostalgie erhältst du durch einen Crash (ab der 8-Bit-Ära, Tab „Epoche“). Perks bleiben für immer.</p>' : '') +
      '<div class="section-title">Perks</div><div class="perk-grid">' + PZ.PERKS.filter((x) => !x.secret || S.secrets.konami).map((x) => {
        const owned = !!S.perks[x.id];
        const avail = E.perkAvailable(x);
        const locked = !owned && x.req && !S.perks[x.req];
        return '<div class="perk' + (owned ? ' owned' : '') + (locked ? ' locked' : '') + (x.secret ? ' secret' : '') + '"><div class="ph">' + SPR.img(x.icon, '', 2) + '<b>' + esc(x.name) + '</b></div><p>' + esc(x.desc) + (locked ? ' <i>(benötigt „' + esc(PZ.PERK[x.req].name) + '“)</i>' : '') + '</p><div class="pc">' +
          (owned ? '<span class="cost">✔ AKTIV</span>' : '<span class="cost">' + fmt(x.cost) + ' NP</span><button class="btn np small" data-perk="' + x.id + '"' + (avail && S.np >= x.cost ? '' : ' disabled') + '>Kaufen</button>') + '</div></div>';
      }).join('') + '</div>';
    if (E.M.unlock.autoUpg || E.M.unlock.autoGen || E.M.unlock.autoEra) {
      p.insertAdjacentHTML('beforeend', '<div class="section-title">Automatisierung</div>' +
        [['upg', 'autoUpg', 'Upgrades automatisch kaufen'], ['gen', 'autoGen', 'Geräte automatisch kaufen'], ['era', 'autoEra', 'Epochen automatisch wechseln']].filter((x) => E.M.unlock[x[1]]).map((x) =>
          '<div class="opt"><label>' + x[2] + '</label><button class="switch' + (S.auto[x[0]] ? ' on' : '') + '" data-auto="' + x[0] + '" aria-label="' + x[2] + '"></button></div>').join(''));
    }
    p.onclick = (e) => {
      const b = e.target.closest('[data-perk]');
      if (b) { if (E.buyPerk(b.dataset.perk)) { UI.renderPerks(); UI.updateTop(); } else A.play('deny'); }
      const s = e.target.closest('[data-auto]');
      if (s) { const k = s.dataset.auto; S.auto[k] = !S.auto[k]; s.classList.toggle('on', S.auto[k]); A.play('toggle'); }
    };
  };

  // ───────────────────────── Museum ─────────────────────────
  UI.renderMuseum = function () {
    const S = E.S;
    const p = $('#page-museum');
    const seen = PZ.GENS.filter((g) => S.genMax[g.id]).length;
    p.innerHTML = '<div class="section-title">Museum · ' + seen + '/' + PZ.GENS.length + ' Exponate</div><p class="hint">Jedes Gerät, das du einmal besessen hast, landet hier – mit Geschichte und Anekdoten.</p>' +
      '<div class="museum-grid">' + PZ.GENS.slice().sort((a, b) => a.year - b.year).map((g) => {
        const has = S.genMax[g.id] > 0;
        return '<button class="mu' + (has ? '' : ' locked') + (S.stats.museum[g.id] ? ' seen' : '') + '" data-g="' + g.id + '"><span class="im' + (isPhoto(g.id) ? ' photo' : '') + '"><img src="' + g.img + '" alt="" loading="lazy"></span><b>' + (has ? esc(g.name) : '???') + '</b><span>' + g.year + '</span></button>';
      }).join('') + '</div>';
    p.onclick = (e) => { const b = e.target.closest('.mu'); if (b && !b.classList.contains('locked')) UI.openMuseum(b.dataset.g); };
  };
  UI.openMuseum = function (id) {
    const g = PZ.GEN[id];
    const S = E.S;
    if (!S.genMax[id] && !(S.gens[id] > 0)) return;
    const h = H.gens[id] || {};
    S.stats.museum[id] = 1;
    const c = IMG[id];
    const m = UI.modal('<div class="mu-detail"><h2>' + esc(g.name) + ' · ' + g.year + '</h2><div class="mimg' + (isPhoto(id) ? ' photo' : '') + '"><img src="' + g.img + '" alt="' + esc(g.name) + '"></div>' +
      '<div class="tag">' + esc(h.tagline || '') + '</div><p>' + esc(h.desc || '') + '</p><ul>' + (h.facts || []).map((f) => '<li>' + esc(f) + '</li>').join('') + '</ul>' +
      '<p class="hint">Im Besitz: ' + (S.gens[id] || 0) + ' · Produktion: ' + fmt(E.genProd[id] || 0) + '/s</p>' +
      (c ? '<div class="cred">Foto: ' + esc(c.author || '') + ' · ' + esc(c.license || '') + ' · <a href="' + esc(c.source || '#') + '" target="_blank" rel="noopener">Wikimedia Commons</a></div>' : '') +
      '</div><div class="modal-actions"><button class="btn" data-close>Zurück</button></div>', { wide: true });
    let n = 0;
    $('.mimg', m).addEventListener('click', () => {
      n++;
      if (id === 'nes' && n === 5 && !S.secrets.blow) { S.secrets.blow = 1; UI.toast({ icon: 'star', small: 'PFFFFT!', title: 'Modul gereinigt. Funktioniert wieder!' }); }
      if (id === 'atari2600' && n === 7 && !S.secrets.easter) { S.secrets.easter = 1; UI.toast({ icon: 'star', small: 'EASTER EGG', title: 'Created by Warren Robinett' }); A.play('achievement'); }
      if (n % 3 === 0) A.play('coin');
    });
  };

  // ───────────────────────── Statistik ─────────────────────────
  UI.renderStats = function () {
    const S = E.S, st = S.stats;
    const rows = [
      ['Münzen (dieser Durchlauf)', fmt(S.runEarned)], ['Münzen (insgesamt)', fmt(S.totalEarned)], ['Münzen durch Klicks', fmt(S.clickEarned)],
      ['Münzen pro Sekunde', U.fmt(E.cps, 1)], ['Höchste Münzen/s', fmt(st.maxCps)], ['Klickwert', U.fmt(E.clickBase() * E.comboMult(), 1)],
      ['Klicks (gesamt)', fmt(S.clicks)], ['Auto-Klicks', fmt(st.autoClicks)], ['Beste Klickrate', st.maxClickRate + ' /s'],
      ['Krit-Chance', U.pct(E.critChance(), 1)], ['Krit-Multiplikator', '×' + E.critMultiplier()], ['Fever ausgelöst', fmt(st.fevers)],
      ['Geräte gekauft', fmt(st.genBought)], ['Upgrades gekauft', fmt(st.upgBought)], ['Power-Ups gesammelt', fmt(st.powerups)],
      ['Bosse besiegt / verloren', st.bossWins + ' / ' + st.bossLosses], ['Boss-Bonus', '+' + U.pct(E.bossBonus(), 0)], ['Trophäen-Bonus', '+' + U.pct(E.trophyBonus(), 0)],
      ['Kult-Spiele', Object.keys(S.loot).length + ' / ' + PZ.LOOT.length], ['Grabbeltisch-Käufe', fmt(st.binBuys)], ['Crashs', fmt(S.crashes)],
      ['Nostalgie gesamt', fmt(S.npTotal)], ['Offline-Ertrag', U.pct(E.offlineEff(), 0) + ' bis ' + E.offlineCapH() + ' h'], ['Spielzeit (gesamt)', U.time(st.playTime)],
      ['Spielzeit (Durchlauf)', U.time(st.runTime)], ['Weiteste Epoche', PZ.ERAS[S.maxEra].name], ['Spielbeginn', new Date(S.created).toLocaleDateString('de-DE')],
    ];
    $('#page-stats').innerHTML = '<div class="section-title">Statistik</div><div class="stats">' + rows.map((r) => '<div>' + r[0] + '</div><div>' + r[1] + '</div>').join('') + '</div>';
  };

  // ───────────────────────── Optionen ─────────────────────────
  UI.buildOptions = function () {
    const p = $('#page-options');
    p.innerHTML = '<div class="section-title">Ton</div>' +
      '<div class="opt"><label for="optSfx">Soundeffekte</label><input type="range" id="optSfx" min="0" max="1" step="0.05"></div>' +
      '<div class="opt"><label for="optMusic">Musik</label><input type="range" id="optMusic" min="0" max="1" step="0.05"></div>' +
      '<div class="opt"><label for="optClick">Klick-Sound<small>Lautstärke des Controller-Klicks</small></label><input type="range" id="optClick" min="0" max="1" step="0.05"></div>' +
      '<div class="section-title">Darstellung</div>' +
      '<div class="opt"><label for="optFmt">Zahlenformat<small>Kurz: 1,5 Mio. · Lang: 1,5 Millionen</small></label><select id="optFmt"><option value="short">Kurz</option><option value="long">Lang</option><option value="sci">Wissenschaftlich</option></select></div>' +
      '<div class="opt"><label>Röhrenfernseher-Effekt<small>Scanlines & Vignette im Hintergrund</small></label><button class="switch" data-opt="crt" aria-label="CRT-Effekt"></button></div>' +
      '<div class="opt"><label>Animierter Hintergrund</label><button class="switch" data-opt="motion" aria-label="Animierter Hintergrund"></button></div>' +
      '<div class="opt"><label>Partikel & Zahlen</label><button class="switch" data-opt="particles" aria-label="Partikel"></button></div>' +
      '<div class="opt"><label>Bildschirmwackeln & Vibration</label><button class="switch" data-opt="shake" aria-label="Bildschirmwackeln"></button></div>' +
      '<div class="section-title">Spielstand</div><p class="cloud-state" id="cloudState">Lokal gespeichert.</p>' +
      '<div class="opt-btns"><button class="btn small" id="optSave">Jetzt speichern</button><button class="btn small ghost" id="optExport">Exportieren</button><button class="btn small ghost" id="optImport">Importieren</button><button class="btn small danger" id="optReset">Alles löschen</button></div>' +
      '<div id="saveBox"></div>' +
      '<div class="section-title">Cheat-Codes</div><p class="hint">Kennst du die Klassiker?</p><form id="cheatForm" class="opt" style="border:0"><input class="txt" id="cheatIn" autocomplete="off" placeholder="CODE EINGEBEN"><button class="btn small">OK</button></form>' +
      '<div class="section-title">Credits</div><div class="credits" id="credits"></div>' +
      '<p class="hint" style="margin-top:14px">PIXELZEIT ist ein privates Fan-Projekt. Alle Marken gehören ihren Inhabern. Tastatur: Leertaste = Klick, 1–4 = Kaufmenge, B = Boss, P = Pause.</p>';
    $('#optSfx').addEventListener('input', (e) => { E.S.settings.sfx = +e.target.value; UI.applySettings(); });
    $('#optMusic').addEventListener('input', (e) => { E.S.settings.music = +e.target.value; UI.applySettings(); });
    $('#optSfx').addEventListener('change', () => A.play('coin'));
    $('#optClick').addEventListener('input', (e) => { E.S.settings.clickVol = +e.target.value; });
    $('#optClick').addEventListener('change', () => A.play('click', { vol: E.S.settings.clickVol, throttle: 0 }));
    $('#optFmt').addEventListener('change', (e) => { E.S.settings.fmt = e.target.value; UI.applySettings(); UI.fullRefresh(); });
    $$('.switch[data-opt]', p).forEach((s) => s.addEventListener('click', () => {
      const k = s.dataset.opt;
      E.S.settings[k] = k === 'particles' ? (E.S.settings[k] ? 0 : 2) : !E.S.settings[k];
      A.play('toggle'); UI.applySettings(); UI.syncOptions();
    }));
    $('#optSave').addEventListener('click', () => { PZ.Main.save(true); UI.toast({ icon: 'disk', small: 'SPEICHERN', title: 'Spielstand gesichert' }); });
    $('#optExport').addEventListener('click', () => {
      const str = E.serialize();
      $('#saveBox').innerHTML = '<textarea class="save" id="saveTxt" readonly></textarea><div class="opt-btns"><button class="btn small" id="copySave">Kopieren</button></div>';
      $('#saveTxt').value = str;
      $('#copySave').addEventListener('click', () => {
        const ta = $('#saveTxt');
        const done = () => UI.toast({ icon: 'disk', small: 'EXPORT', title: 'In die Zwischenablage kopiert' });
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(str).then(done, () => { ta.select(); });
        else { ta.select(); }
      });
    });
    $('#optImport').addEventListener('click', () => {
      $('#saveBox').innerHTML = '<textarea class="save" id="loadTxt" placeholder="PZ1:…"></textarea><div class="opt-btns"><button class="btn small" id="doImport">Laden</button></div>';
      $('#doImport').addEventListener('click', () => {
        try { const S = E.deserialize($('#loadTxt').value); PZ.Main.loadState(S); UI.toast({ icon: 'disk', small: 'IMPORT', title: 'Spielstand geladen' }); $('#saveBox').innerHTML = ''; }
        catch (err) { UI.toast({ icon: 'skull', small: 'FEHLER', title: 'Ungültiger Spielstand', text: 'Der Text muss mit „PZ1:“ beginnen.' }); }
      });
    });
    $('#optReset').addEventListener('click', () => {
      const m = UI.modal('<h2>Wirklich alles löschen?</h2><p>Dein gesamter Fortschritt inklusive Sammlung, Trophäen und Perks geht verloren. Tippe zur Bestätigung <b>LÖSCHEN</b> ein.</p><input class="txt" id="resetIn" autocomplete="off"><div class="modal-actions"><button class="btn ghost" data-close>Abbrechen</button><button class="btn danger" id="doReset">Löschen</button></div>');
      $('#doReset', m).addEventListener('click', () => {
        if ($('#resetIn', m).value.trim().toUpperCase() !== 'LÖSCHEN') { A.play('deny'); return; }
        UI.closeModal(m); PZ.Main.hardReset();
      });
    });
    $('#cheatForm').addEventListener('submit', (e) => { e.preventDefault(); PZ.Main.cheat($('#cheatIn').value); $('#cheatIn').value = ''; });
    UI.renderCredits();
  };
  UI.renderCredits = function () {
    const c = PZ.CREDITS || {};
    const img = (c.images || []).map((x) => '<li>' + esc(x.title.replace(/^File:/, '')) + ' – ' + esc(x.author || '?') + ' (' + esc(x.license || '?') + ') <a href="' + esc(x.source) + '" target="_blank" rel="noopener">Quelle</a></li>').join('');
    const aud = (c.audio || []).map((x) => '<li>' + esc(x.id) + ': „' + esc(x.title) + '“ – ' + esc(x.author || '?') + ' (' + esc(x.license || '?') + ') <a href="' + esc(x.source) + '" target="_blank" rel="noopener">Quelle</a></li>').join('');
    $('#credits').innerHTML = '<p>Fotos: Wikimedia Commons (u. a. Evan-Amos / Vanamo Online Game Museum). Musik & Sounds: OpenGameArt.org (CC0). Schriften: Press Start 2P, Pixelify Sans, VT323 (SIL OFL). Spiele-Cover: englischsprachige Wikipedia bzw. Wikimedia Commons – © der jeweiligen Rechteinhaber.</p>' +
      (img ? '<details><summary>Bildnachweise (' + (c.images || []).length + ')</summary><ul>' + img + '</ul></details>' : '') +
      (aud ? '<details><summary>Audionachweise (' + (c.audio || []).length + ')</summary><ul>' + aud + '</ul></details>' : '');
  };
  UI.syncOptions = function () {
    const s = E.S.settings;
    $('#optSfx').value = s.sfx; $('#optMusic').value = s.music; $('#optClick').value = s.clickVol; $('#optFmt').value = s.fmt;
    $$('.switch[data-opt]').forEach((b) => b.classList.toggle('on', !!s[b.dataset.opt]));
    const cs = $('#cloudState');
    if (cs) cs.innerHTML = PZ.Main && PZ.Main.cloudStatus ? PZ.Main.cloudStatus() : 'Lokal gespeichert.';
  };
  UI.applySettings = function () {
    const s = E.S.settings;
    U.numFormat = s.fmt;
    A.setVolumes(s.sfx, s.music);
    document.body.classList.toggle('no-crt', !s.crt);
    document.body.classList.toggle('reduce-motion', !s.motion);
    document.body.classList.toggle('muted', s.sfx <= 0 && s.music <= 0);
    PZ.BG.enabled = s.motion;
    document.body.classList.toggle('crt-flicker', E.S.era === 0 && s.crt && s.motion);
  };
  UI.toggleMute = function () {
    const s = E.S.settings;
    if (s.sfx > 0 || s.music > 0) { s._sfx = s.sfx; s._music = s.music; s.sfx = 0; s.music = 0; }
    else { s.sfx = s._sfx || 0.7; s.music = s._music || 0.45; }
    UI.applySettings(); UI.syncOptions();
  };

  // ───────────────────────── Modals & Toasts ─────────────────────────
  UI.modal = function (html, opts) {
    opts = opts || {};
    const wrap = document.createElement('div');
    wrap.className = 'modal-wrap';
    wrap.innerHTML = '<div class="modal' + (opts.wide ? ' wide' : '') + '" role="dialog" aria-modal="true">' + (opts.noClose ? '' : '<button class="x" data-close aria-label="Schließen">×</button>') + html + '</div>';
    $('#modalRoot').appendChild(wrap);
    wrap.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]') || (e.target === wrap && !opts.noClose)) { UI.closeModal(wrap); if (opts.onClose) opts.onClose(); }
    });
    const first = wrap.querySelector('.btn:not([disabled])');
    if (first && UI.fine) setTimeout(() => first.focus({ preventScroll: true }), 50);
    return wrap;
  };
  UI.closeModal = function (w) { if (w && w.parentNode) w.remove(); };
  UI.modalOpen = function () { return !!$('#modalRoot .modal-wrap') || !!$('.era-card') || !!$('.crash-screen') || !!$('.pause-screen') || !!$('.splash'); };

  const toastQ = [], toastHold = [];
  UI.flushToasts = function () {
    if (document.querySelector('.era-card,.crash-screen,.splash')) { setTimeout(UI.flushToasts, 1000); return; }
    toastHold.splice(0).forEach((o) => UI.toast(o));
  };
  UI.toast = function (o) {
    if (document.querySelector('.era-card,.crash-screen,.splash')) { toastHold.push(o); return; }
    const box = $('#toasts');
    const el = document.createElement('div');
    el.className = 'toast ' + (o.cls || '');
    el.innerHTML = '<span class="ti">' + SPR.img(o.icon || 'star', '', 3) + '</span><div><small>' + esc(o.small || '') + '</small><b>' + esc(o.title || '') + '</b>' + (o.text ? '<span>' + esc(o.text) + '</span>' : '') + '</div>';
    box.appendChild(el);
    toastQ.push(el);
    while (toastQ.length > 4) { const old = toastQ.shift(); old.remove(); }
    el.addEventListener('click', () => { el.remove(); });
    setTimeout(() => { el.classList.add('out'); setTimeout(() => { el.remove(); const i = toastQ.indexOf(el); if (i >= 0) toastQ.splice(i, 1); }, 320); }, o.ms || 4200);
  };

  // ───────────────────────── Tooltip (Desktop) ─────────────────────────
  UI.initTooltips = function () {
    if (!UI.fine) return;
    const tip = $('#tooltip');
    let cur = null;
    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest('[data-tip],[data-tip-gen],.powerup');
      if (t === cur) return;
      cur = t;
      if (!t) { tip.hidden = true; return; }
      let html = '';
      if (t.dataset.tipGen) {
        const g = PZ.GEN[t.dataset.tipGen], h = H.gens[g.id] || {};
        const owned = E.S.gens[g.id] || 0;
        const each = g.baseProd * E.genMultOf(g) * E.globalMult(false);
        const nextT = PZ.TIERS.find((x) => x[0] > owned);
        html = '<h5>' + esc(g.name) + ' (' + g.year + ')</h5><p>' + esc(h.desc || '') + '</p><div class="row"><span class="k">JE GERÄT</span><span>' + U.fmt(each, 1) + '/s</span></div>' +
          (owned ? '<div class="row"><span class="k">GESAMT</span><span>' + fmt(E.genProd[g.id]) + '/s</span></div>' : '') +
          (nextT ? '<div class="row"><span class="k">NÄCHSTES UPGRADE</span><span>bei ' + nextT[0] + ' Stück</span></div>' : '') + '<p style="margin:6px 0 0;font-size:12px">Rechtsklick: Museum</p>';
      } else if (t.classList.contains('powerup')) {
        const pu = PZ.POWERUPS.find((x) => x.id === t.dataset.type);
        html = '<h5>' + esc(pu.name) + '</h5><p>' + esc(pu.desc) + '</p>';
      } else html = '<p style="margin:0">' + esc(t.dataset.tip) + '</p>';
      tip.innerHTML = html;
      tip.hidden = false;
    });
    document.addEventListener('mousemove', (e) => {
      if (tip.hidden) return;
      const w = tip.offsetWidth, h = tip.offsetHeight;
      let x = e.clientX + 16, y = e.clientY + 16;
      if (x + w > window.innerWidth - 8) x = e.clientX - w - 16;
      if (y + h > window.innerHeight - 8) y = e.clientY - h - 12;
      tip.style.left = Math.max(8, x) + 'px'; tip.style.top = Math.max(8, y) + 'px';
    });
  };

  // ───────────────────────── Newsticker ─────────────────────────
  UI.initTicker = function () {
    const track = $('.ticker-track'), txt = $('#tickerText');
    let x = 0, w = 0, tw = 0, last = 0, queue = [];
    function nextMsg() {
      if (!queue.length) queue = buildQueue();
      const m = queue.shift();
      txt.textContent = m;
      w = track.clientWidth; tw = txt.scrollWidth; x = w;
    }
    function buildQueue() {
      const S = E.S;
      const year = E.yearNow();
      const hist = H.news.filter((n) => n.era < S.era || (n.era === S.era && parseInt(n.text, 10) <= year + 1));
      const cur = hist.filter((n) => n.era === S.era);
      const q = [];
      U.shuffle(cur.slice()).slice(0, 4).forEach((n) => q.push(n.text));
      U.shuffle(hist.slice()).slice(0, 3).forEach((n) => q.push(n.text));
      U.shuffle(H.jokes.slice()).slice(0, 2).forEach((j) => q.push(j));
      q.push(dynamicMsg());
      return U.shuffle(q);
    }
    function dynamicMsg() {
      const S = E.S;
      const owned = PZ.GENS.filter((g) => S.gens[g.id] > 0);
      const opts = [
        'Eilmeldung: Unbekannter Spieler verdient ' + U.fmt(E.cps, 1) + ' Münzen pro Sekunde – Branche staunt.',
        'Analysten: „' + S.clicks + ' Klicks? Das ist erst der Anfang.“',
        S.stats.bossWins ? S.stats.bossWins + ' Bosse besiegt – Endgegner-Gewerkschaft fordert mehr HP.' : 'Gerüchte über gefährliche Endgegner verunsichern die Szene.',
        Object.keys(S.loot).length ? 'Sammler-Magazin zeigt dein Regal: ' + Object.keys(S.loot).length + ' Kult-Spiele!' : 'Grabbeltische im ganzen Land warten auf Wühler.',
      ];
      if (owned.length) { const g = U.pick(owned); opts.push('Umfrage: ' + S.gens[g.id] + ' ' + g.name + ' laufen gleichzeitig – Stromzähler dreht durch.'); }
      return U.pick(opts);
    }
    $('#ticker').addEventListener('click', () => { E.S.stats.tickerClicks++; A.play('tab'); nextMsg(); });
    UI.tickerRefresh = () => { queue = []; };
    nextMsg();
    function frame(now) {
      requestAnimationFrame(frame);
      const dt = Math.min(0.1, (now - last) / 1000 || 0); last = now;
      if (document.hidden) return;
      x -= dt * (UI.layout === 1 ? 70 : 90);
      if (x < -tw - 20) nextMsg();
      txt.style.transform = 'translate(' + x.toFixed(1) + 'px,-50%)';
    }
    requestAnimationFrame(frame);
  };

  // ───────────────────────── Effekte (Partikel, Zahlen) ─────────────────────────
  UI.initFx = function () {
    const cv = $('#fx'), ctx = cv.getContext('2d');
    const parts = [];
    let running = false, dpr = 1;
    const FX = (PZ.FX = {});
    FX.resize = function () {
      const r = $('#stage').getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.max(1, r.width * dpr); cv.height = Math.max(1, r.height * dpr);
    };
    FX.resize();
    window.addEventListener('resize', FX.resize);
    FX.burst = function (x, y, n, colors, speed) {
      if (!E.S.settings.particles) return;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, v = (speed || 180) * (0.4 + Math.random() * 0.8);
        parts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 120, life: 0.6 + Math.random() * 0.5, t: 0, s: 3 + Math.random() * 4, c: colors[Math.floor(Math.random() * colors.length)] });
      }
      while (parts.length > 260) parts.shift();
      if (!running) { running = true; last = performance.now(); requestAnimationFrame(step); }
    };
    let last = 0;
    function step(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.t += dt; if (p.t >= p.life) { parts.splice(i, 1); continue; }
        p.vy += 520 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        ctx.globalAlpha = 1 - p.t / p.life;
        ctx.fillStyle = p.c;
        const s = p.s * dpr;
        ctx.fillRect(Math.round(p.x * dpr - s / 2), Math.round(p.y * dpr - s / 2), s, s);
      }
      ctx.globalAlpha = 1;
      if (parts.length) requestAnimationFrame(step); else running = false;
    }
  };
  let floaterCount = 0;
  UI.floater = function (x, y, text, cls) {
    if (!E.S.settings.particles && cls !== 'big') return;
    const box = $('#floaters');
    if (floaterCount > 36) { const f = box.firstChild; if (f) { f.remove(); floaterCount--; } }
    const el = document.createElement('div');
    el.className = 'floater ' + (cls || '');
    el.textContent = text;
    el.style.left = x + 'px'; el.style.top = y + 'px';
    box.appendChild(el);
    floaterCount++;
    setTimeout(() => { el.remove(); floaterCount--; }, 1000);
  };
  UI.buzz = function (ms) { if (E.S.settings.shake && navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) { /* nicht unterstützt */ } } };
  UI.shake = function (big) {
    if (big) UI.buzz(35);
    if (!E.S.settings.shake || !E.S.settings.motion) return;
    const st = $('#stage');
    st.classList.remove('shake', 'shake-big'); void st.offsetWidth;
    st.classList.add(big ? 'shake-big' : 'shake');
  };

  // ───────────────────────── Power-Ups ─────────────────────────
  UI.spawnPowerup = function (type) {
    const stage = $('#stage').getBoundingClientRect();
    const size = 64;
    const el = document.createElement('button');
    el.className = 'powerup' + (type === 'glitch' ? ' glitch' : '');
    el.dataset.type = type;
    el.setAttribute('aria-label', 'Power-Up einsammeln');
    const pu = PZ.POWERUPS.find((p) => p.id === type);
    el.innerHTML = '<img class="spr" src="' + SPR.url(pu.sprite, 4) + '" alt="">';
    let visH = stage.height;
    if (UI.layout === 1 && $('#app').classList.contains('sheet-open')) visH = Math.max(160, $('#panel').getBoundingClientRect().top - stage.top);
    const x = U.rand(stage.width * 0.08, stage.width * 0.92 - size);
    const y = U.rand(Math.min(visH * 0.18, 60), Math.max(80, visH * 0.72 - size));
    el.style.left = x + 'px'; el.style.top = y + 'px';
    $('#powerups').appendChild(el);
    let done = false;
    const collect = (ev) => {
      if (done) return; done = true;
      if (ev) { ev.preventDefault(); ev.stopPropagation(); }
      const r = E.collectPowerup(type);
      const cx = x + size / 2, cy = y + size / 2;
      UI.floater(cx, cy, r.text, 'big');
      if (PZ.FX) PZ.FX.burst(cx, cy, 26, ['#ffd23f', '#ffffff', PZ.ERAS[E.S.era].accent], 260);
      el.classList.add('leaving');
      setTimeout(() => el.remove(), 450);
    };
    el.addEventListener('pointerdown', collect);
    const life = E.puLifetime() * 1000;
    if (E.M.unlock.magnet) setTimeout(() => collect(), 3000);
    setTimeout(() => { if (!done) { done = true; el.classList.add('leaving'); setTimeout(() => el.remove(), 450); } }, life);
  };

  // ───────────────────────── Bühne aktualisieren ─────────────────────────
  let lastCoinsTxt = '', lastYear = 0;
  UI.updateStage = function () {
    const S = E.S;
    const ct = U.fmt(S.coins, 0, true);
    if (ct !== lastCoinsTxt) { $('#coins').textContent = ct; lastCoinsTxt = ct; }
    $('#cps').textContent = U.fmt(E.cps, 1);
    $('.cps').classList.toggle('boosted', E.cps > E.cpsBase * 1.01);
    // Combo
    const heat = S.heat;
    $('#comboFill').style.width = heat.toFixed(1) + '%';
    const cm = E.comboMult();
    const ctext = S.fever > 0 ? 'FEVER ×' + U.fmt(cm, 1) : 'COMBO ×' + U.fmt(cm, 1);
    const ce = $('#comboText');
    if (ce.textContent !== ctext) ce.textContent = ctext;
    ce.classList.toggle('hot', heat > 50);
    $('#clickVal').textContent = '+' + U.fmt(E.clickBase() * cm, 1) + '/Klick';
    document.body.classList.toggle('fever', S.fever > 0);
    PZ.BG.setIntensity(S.fever > 0 ? 1 : heat / 250);
    // Buffs
    UI.updateBuffs();
    // Boss
    const bb = $('#bossBtn');
    if (S.boss) {
      $('#bossBtnLabel').textContent = 'KAMPF LÄUFT!';
      bb.disabled = true; bb.classList.remove('ready');
      const B = S.boss;
      $('#bossHp').style.width = Math.max(0, B.hp / B.max * 100) + '%';
      $('#bossHpText').textContent = fmt(Math.max(0, B.hp)) + ' / ' + fmt(B.max);
      const tt = $('#bossTimer');
      tt.textContent = U.clock(B.t);
      tt.classList.toggle('low', B.t < 8);
    } else {
      const ready = E.bossReady();
      bb.disabled = !ready;
      bb.classList.toggle('ready', ready);
      const pct = S.bossCharge / PZ.BOSS_CHARGE;
      $('#bossBtnLabel').textContent = ready ? 'BOSS ERSCHEINT! KÄMPFEN' : 'BOSS LÄDT ' + Math.floor(pct * 100) + ' %';
      $('#bossCharge').style.width = (pct * 100).toFixed(1) + '%';
    }
    UI.updateEraBtn();
    // Jahr
    const y = E.yearNow();
    if (y !== lastYear) {
      const ye = $('#yearNow');
      ye.textContent = y;
      if (lastYear) { ye.classList.remove('tick'); void ye.offsetWidth; ye.classList.add('tick'); UI.tickerRefresh && UI.tickerRefresh(); }
      lastYear = y;
    }
    // Hinweis
    $('#clickHint').hidden = S.clicks > 25;
  };
  UI.updateBuffs = function () {
    const S = E.S;
    const box = $('#buffs');
    const items = S.buffs.map((b) => ({ id: b.id, name: b.name, t: b.t, max: b.max, cls: 'b-' + b.type, icon: b.type === 'prod' ? 'bolt' : 'star', label: (b.type === 'prod' ? 'Prod. ×' : 'Klick ×') + b.mult }));
    if (S.fever > 0) items.unshift({ id: 'fever', name: 'Fever', t: S.fever, max: E.feverDuration(), cls: 'b-fever', icon: 'flame', label: 'FEVER' });
    const sig = items.map((i) => i.id).join(',');
    if (box.dataset.sig !== sig) {
      box.dataset.sig = sig;
      box.innerHTML = items.map((i) => '<span class="buff ' + i.cls + '" data-b="' + i.id + '"><img class="spr" src="' + SPR.url(i.icon, 2) + '" alt=""><span>' + esc(i.label) + ' · <i></i></span><span class="bt"></span></span>').join('');
    }
    items.forEach((i) => {
      const el = box.querySelector('[data-b="' + i.id + '"]');
      if (!el) return;
      el.querySelector('i').textContent = Math.ceil(i.t) + 's';
      el.querySelector('.bt').style.width = (i.t / i.max * 100) + '%';
    });
  };
  UI.updateTop = function () {
    const S = E.S;
    const chip = $('#npChip');
    chip.hidden = S.npTotal <= 0;
    $('#npTop').textContent = fmt(S.np);
  };
  UI.updateDots = function () {
    const S = E.S;
    const upgAff = E.availableUpgrades().some((u) => u.cost <= S.coins);
    const eraDot = E.canAdvance() || !!E.pendingWar() || E.bossReady();
    const perkDot = PZ.PERKS.some((p) => E.perkAvailable(p) && S.np >= p.cost);
    const set = (sel, on) => { $$(sel).forEach((b) => { let d = b.querySelector('.dot'); if (on && !d) { d = document.createElement('span'); d.className = 'dot'; b.appendChild(d); } else if (!on && d) d.remove(); }); };
    set('.tab[data-tab=upgrades],.nav-btn[data-nav=upgrades]', upgAff);
    set('.tab[data-tab=era],.nav-btn[data-nav=era]', eraDot);
    set('.tab[data-tab=perks]', perkDot);
    set('.nav-btn[data-nav=more]', perkDot);
  };

  // Periodisch (≈ 5×/s)
  UI.refresh = function () {
    UI.updateStage();
    if (UI.visible('gens')) UI.updateGens();
    if (UI.visible('upgrades')) UI.renderUpgrades(false);
    if (UI.visible('era')) UI.updateEra();
    if (UI.visible('loot')) UI.updateLoot();
  };
  // Langsam (1×/s)
  UI.slowRefresh = function () {
    UI.checkTips();
    UI.updateTop();
    UI.updateDots();
    if (UI.visible('stats')) UI.renderStats();
  };
  UI.fullRefresh = function () {
    $('#genList').dataset.sig = '';
    UI.renderGens();
    UI.renderShelf();
    UI.renderUpgrades(true);
    UI.renderTab(UI.tab);
    UI.updateStage();
    UI.updateTop();
    UI.updateDots();
  };

  // ───────────────────────── Engine-Events ─────────────────────────
  UI.bindEvents = function () {
    PZ.on('spawnPowerup', (type) => { if (!UI.paused) UI.spawnPowerup(type); });
    PZ.on('buyGen', (id) => UI.shelfBought(id));
    setInterval(UI.shelfTick, 1400);
    PZ.on('achievement', (a) => {
      A.play('achievement');
      UI.toast({ icon: a.tier === 'p' ? 'gem' : 'trophy', small: 'TROPHÄE FREIGESCHALTET', title: a.name, text: a.desc, cls: 't-' + a.tier });
      if (UI.visible('ach')) UI.renderAch();
    });
    PZ.on('loot', (res) => {
      if (res.source === 'era') return; // wird auf der Titelkarte gezeigt
      const g = res.game;
      if ((res.isNew && (g.rarity === 'e' || g.rarity === 'l')) || (res.source === 'bin' && res.isNew && g.rarity !== 'c')) {
        setTimeout(() => UI.lootReveal(res), res.source === 'boss' ? 900 : 50);
      } else {
        UI.toast({ icon: 'chest', small: (res.isNew ? 'NEUES KULT-SPIEL · ' : 'STUFE ' + res.level + ' · ') + PZ.RARITY[g.rarity].name.toUpperCase(), title: g.name, text: res.maxed ? 'Bereits maximal – +' + fmt(res.refund) + ' Münzen' : PZ.LOOT_FX[g.fx].label(PZ.lootValue(g, res.level, E.M.lootPower), g), cls: g.rarity === 'l' ? 'loot-l' : '' });
      }
      if (UI.visible('loot')) UI.renderLoot();
    });
    PZ.on('fever', (on) => { if (on) { A.play('fever'); UI.shake(true); const r = $('#controller').getBoundingClientRect(), s = $('#stage').getBoundingClientRect(); if (PZ.FX) PZ.FX.burst(r.left - s.left + r.width / 2, r.top - s.top + r.height / 2, 60, ['#ff3b3b', '#ffe23b', '#4bff6b', '#3bb4ff', '#b45cff'], 380); } });
    PZ.on('bossStart', (B) => {
      const b = PZ.BOSS[B.id];
      A.play('boss_appear');
      document.body.classList.add('boss');
      $('#bossLayer').hidden = false;
      $('#bossName').textContent = b.name + ' · Lv ' + B.level;
      $('#bossQuote').textContent = '„' + b.quote + '“';
      $('#bossImg').src = SPR.url(b.sprite, 8);
      PZ.BG.setMood(1);
      UI.shake(true);
    });
    PZ.on('bossEnd', (res) => {
      document.body.classList.remove('boss');
      $('#bossLayer').hidden = true;
      PZ.BG.setMood(0);
      const b = PZ.BOSS[res.boss.id];
      if (res.win) {
        A.play('boss_win');
        UI.toast({ icon: 'sword', small: 'BOSS BESIEGT', title: b.name, text: '+' + fmt(res.coins) + ' Münzen · +1 % Produktion für immer' });
        const s = $('#stage').getBoundingClientRect();
        if (PZ.FX) PZ.FX.burst(s.width / 2, s.height / 2, 80, ['#ffd23f', '#fff', '#ff5470'], 420);
        UI.shake(true);
      } else {
        A.play('boss_lose');
        UI.toast({ icon: 'skull', small: 'GAME OVER', title: b.name + ' ist entkommen', text: 'Mehr Boss-Schaden gibt es in der Waffenkammer (Upgrades).' });
      }
    });
    PZ.on('era', (era, first, loot) => { UI.eraCard(era, first, loot); });
    PZ.on('buyUpg', () => { if (UI.visible('era')) UI.renderEra(); });
    PZ.on('perk', () => UI.updateTop());
  };

  // ───────────────────────── Epochen-Titelkarte ─────────────────────────
  UI.eraCard = function (era, first, loot) {
    const e = PZ.ERAS[era];
    const prevYear = PZ.ERAS[era - 1] ? PZ.ERAS[era - 1].years[0] : e.years[0];
    UI.applyTheme(era);
    A.play('era');
    const ov = document.createElement('div');
    ov.className = 'era-card';
    ov.innerHTML = '<div class="ey">' + prevYear + '</div><div class="en slide" style="animation-delay:.9s">' + esc(e.name) + '</div>' +
      '<p class="slide" style="animation-delay:1.2s">' + esc((H.eras[era] || {}).intro || '') + '</p>' +
      '<div class="gens slide" style="animation-delay:1.5s">' + e.gens.map((g, i) => '<figure style="animation-delay:' + (1.6 + i * 0.15) + 's"><img src="' + g.img + '" alt=""><figcaption>' + esc(g.name) + '</figcaption></figure>').join('') + '</div>' +
      (loot ? '<div class="slide hint" style="animation-delay:2s">Fund im Umzugskarton: <b style="color:' + PZ.RARITY[loot.game.rarity].color + '">' + esc(loot.game.name) + '</b></div>' : '') +
      '<button class="btn slide" style="animation-delay:2.2s">Weiter</button>';
    document.body.appendChild(ov);
    const ey = $('.ey', ov);
    const t0 = performance.now();
    const roll = () => {
      const p = Math.min(1, (performance.now() - t0) / 900);
      ey.textContent = Math.round(prevYear + (e.years[0] - prevYear) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(roll);
    };
    requestAnimationFrame(roll);
    const close = () => {
      ov.remove();
      UI.fullRefresh();
      setTimeout(UI.flushToasts, 400);
      const w = E.pendingWar(); if (w) setTimeout(() => UI.warModal(w), 250);
    };
    $('.btn', ov).addEventListener('click', close);
  };

  // ───────────────────────── Pause ─────────────────────────
  UI.pause = function (on) {
    if (on && UI.paused) return;
    UI.paused = on;
    if (on) {
      const ov = document.createElement('div');
      ov.className = 'pause-screen';
      ov.innerHTML = '<div><div class="pt">PAUSE</div><p class="hint" style="margin-top:14px">Klicken oder P zum Fortsetzen</p></div>';
      document.body.appendChild(ov);
      const t0 = Date.now();
      A.pauseMusic();
      const off = () => { if (Date.now() - t0 > 60000) E.S.secrets.pause = 1; ov.remove(); UI.paused = false; PZ.Main.resumeFromPause(); A.playMusic(A.trackForEra(E.S.era), true); };
      ov.addEventListener('click', off);
      UI._unpause = off;
    } else if (UI._unpause) UI._unpause();
  };

  // ───────────────────────── Titelbildschirm ─────────────────────────
  UI.splash = function (onStart) {
    const S = E.S;
    const returning = S.clicks > 0 || S.totalEarned > 0;
    const ov = document.createElement('div');
    ov.className = 'splash';
    const e = PZ.ERAS[S.era];
    ov.innerHTML = '<div class="splash-inner"><div class="splash-logo">PIXEL<b>ZEIT</b></div>' +
      '<div class="splash-sub">Eine Idle-Reise durch 50 Jahre Gaming-Geschichte</div>' +
      '<div class="splash-strip">' + ['pong', 'atari2600', 'nes', 'snes', 'playstation', 'ps2', 'wii', 'switch', 'ps5'].map((id, i) => '<img src="' + PZ.GEN[id].img + '" alt="" style="animation-delay:' + (i * 0.08) + 's">').join('') + '</div>' +
      (returning ? '<div class="splash-save">Spielstand: ' + e.years[0] + ' · ' + U.esc(e.name) + ' · ' + fmt(S.totalEarned) + ' Münzen verdient</div>' : '') +
      '<button class="splash-start">' + (returning ? 'WEITER SPIELEN' : 'PRESS START') + '</button><div class="splash-hint">Ton an! · Klicken, sammeln, Geschichte erleben</div></div>';
    document.body.appendChild(ov);
    const go = (ev) => {
      if (ev) ev.preventDefault();
      A.unlock();
      A.play('coin');
      ov.classList.add('out');
      setTimeout(() => { ov.remove(); onStart && onStart(); setTimeout(UI.flushToasts, 800); }, 420);
    };
    ov.addEventListener('pointerdown', go, { once: true });
    const key = (ev) => { if (ev.key === 'Enter' || ev.code === 'Space') { document.removeEventListener('keydown', key); go(ev); } };
    document.addEventListener('keydown', key);
  };

  // ───────────────────────── Tipps für Einsteiger ─────────────────────────
  const TIPS = [
    ['buy', () => E.S.coins >= 15 && !E.S.gens.pong, 'chip', 'Dein erstes Gerät', 'Kaufe im Shop „Geräte“ einen Pong-Automaten – er verdient automatisch Münzen.'],
    ['upg', () => E.availableUpgrades().some((u) => u.cost <= E.S.coins), 'bolt', 'Upgrade verfügbar', 'Upgrades verdoppeln die Produktion. Schau in den Tab „Upgrades“.'],
    ['combo', () => E.S.stats.maxHeat > 40, 'flame', 'Combo!', 'Schnelles Klicken füllt die Combo-Leiste. Bei 100 % startet FEVER.'],
    ['boss', () => E.bossReady(), 'skull', 'Ein Boss naht', 'Die Boss-Leiste ist voll. Besiege ihn in 30 Sekunden für Münzen und ein Kult-Spiel.'],
    ['era', () => E.canAdvance(), 'clock', 'Zeitsprung bereit', 'Die nächste Epoche ist erforscht – neue Geräte, neue Musik, neues Jahrzehnt.'],
    ['crash', () => E.canCrash(), 'tape', 'Der große Crash', 'Du kannst jetzt einen Crash auslösen und Nostalgie für dauerhafte Boni sammeln (Tab „Epoche“).'],
    ['bin', () => E.S.era >= 1 && E.S.coins > E.binCost() * 3 && !E.S.stats.binBuys, 'cart', 'Grabbeltisch', 'In der „Sammlung“ kannst du nach Kult-Spielen wühlen. Jedes gibt einen dauerhaften Bonus.'],
  ];
  UI.checkTips = function () {
    const S = E.S;
    S.secrets.tips = S.secrets.tips || {};
    if (UI.modalOpen()) return;
    for (const t of TIPS) {
      if (S.secrets.tips[t[0]]) continue;
      let ok = false; try { ok = t[1](); } catch (e) { ok = false; }
      if (ok) { S.secrets.tips[t[0]] = 1; UI.toast({ icon: t[2], small: 'TIPP', title: t[3], text: t[4], ms: 7000 }); break; }
    }
  };

  // ───────────────────────── Offline-Bericht ─────────────────────────
  UI.offlineModal = function (r) {
    UI.modal('<h2>Willkommen zurück!</h2><p>Du warst ' + U.time(r.sec) + ' weg. Deine Geräte haben fleißig weitergespielt' + (r.capped ? ' (angerechnet: ' + U.time(r.used) + ')' : '') + '.</p><div class="big-num">' + coinImg().replace('class="spr"', 'class="spr" style="width:28px;height:28px"') + '+' + fmt(r.gain) + '</div><p class="hint">Offline-Ertrag: ' + U.pct(r.eff, 0) + ' · Maximal ' + E.offlineCapH() + ' Stunden. Mehr über „Save-State“ in der Hall of Fame.</p><div class="modal-actions"><button class="btn" data-close>Einsammeln</button></div>');
    A.play('coin');
  };
})();
