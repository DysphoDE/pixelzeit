/* PIXELZEIT – Spiel-Engine (ohne DOM, auch in Node lauffähig) */
(function () {
  'use strict';
  const PZ = (window.PZ = window.PZ || {});
  const U = PZ.U;
  const E = (PZ.E = {});

  E.VERSION = 1;
  E.SAVE_KEY = 'pixelzeit_save_v1';
  const COST_GROWTH = 1.15;
  const FEVER_BASE = 8;

  // ───────────────────────── Zustand ─────────────────────────
  E.newState = function () {
    return {
      v: E.VERSION,
      coins: 0, runEarned: 0, totalEarned: 0, clickEarned: 0,
      clicks: 0, runClicks: 0,
      gens: {}, genMax: {},
      upg: {},
      era: 0, maxEra: 0,
      ach: {},
      loot: {},
      perks: {},
      np: 0, npTotal: 0, npBase: 0,
      crashes: 0,
      wars: {}, warsEver: {},
      buffs: [],
      heat: 0, fever: 0,
      bossCharge: 0, bossEraWins: {}, boss: null,
      puTimer: 45,
      binBuys: 0,
      auto: { upg: false, gen: false, era: false },
      stats: {
        fevers: 0, crits: 0, powerups: 0, puTypes: {}, glitches: 0,
        bossWins: 0, bossLosses: 0, bossTypes: {}, speedkills: 0,
        lootPulls: 0, binBuys: 0, playTime: 0, runTime: 0, maxCps: 0, maxClickRate: 0,
        genBought: 0, upgBought: 0, museum: {}, tickerClicks: 0, autoClicks: 0,
        runUpgBought: 0, runManualClicks: 0, offlineBest: 0, noClickTime: 0,
        bestRunTime: {},
      },
      secrets: {},
      settings: { sfx: 0.7, music: 0.45, fmt: 'short', crt: true, particles: 2, motion: true, shake: true },
      created: Date.now(), lastSave: Date.now(), runStart: Date.now(),
    };
  };

  E.S = E.newState();

  // ───────────────────────── Modifikatoren ─────────────────────────
  const M = (E.M = {});
  function resetMods() {
    M.prod = 1; M.clickMult = 1; M.clickCps = 0; M.luck = 0; M.buffDur = 0; M.offline = 0;
    M.crit = 0; M.critMult = 0; M.comboGain = 0; M.comboDecay = 0; M.feverDur = 0; M.feverPct = 0;
    M.comboMax = 0; M.puLife = 0; M.bossTime = 0; M.bossDmg = 1; M.bossReward = 0; M.trophy = 0;
    M.trophyMult = 1; M.costRed = 0; M.eraCost = 0; M.eraReq = 0; M.loot = 0; M.binCost = 0; M.auto = 0;
    M.offlineCap = 0; M.startEra = 0; M.npGain = 0; M.lootPower = 0; M.costGrowth = 0; M.npPower = 0;
    M.genMult = {}; M.eraMult = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; M.backcompat = {}; M.unlock = {};
  }
  function applyFx(fx) {
    for (const k in fx) {
      const v = fx[k];
      switch (k) {
        case 'prod': case 'clickMult': case 'bossDmg': case 'trophyMult': M[k] *= v; break;
        case 'genMult': M.genMult[v[0]] = (M.genMult[v[0]] || 1) * v[1]; break;
        case 'backcompat': M.backcompat[v] = true; break;
        case 'unlock': M.unlock[v] = true; break;
        case 'auto': M.auto = Math.max(M.auto, v); break;
        case 'startEra': M.startEra = Math.max(M.startEra, v); break;
        case 'start': break;
        default: M[k] = (M[k] || 0) + v;
      }
    }
  }

  E.recalc = function () {
    const S = E.S;
    resetMods();
    for (const id in S.upg) { const u = PZ.UPG[id]; if (u) applyFx(u.fx); }
    for (const id in S.perks) { const p = PZ.PERK[id]; if (p) applyFx(p.fx); }
    for (const w in S.wars) {
      const war = PZ.WAR[w];
      if (!war) continue;
      for (const oid of S.wars[w]) { const o = war.options.find((x) => x.id === oid); if (o) applyFx(o.fx); }
    }
    // Kult-Spiele
    const lp = M.lootPower;
    const sums = { all: 0, click: 0, crit: 0, boss: 0, luck: 0, combo: 0, offline: 0, np: 0, loot: 0 };
    const eraSums = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (const id in S.loot) {
      const g = PZ.LOOT_BY[id];
      if (!g) continue;
      const v = PZ.lootValue(g, S.loot[id], lp);
      if (g.fx === 'era') eraSums[g.era] += v; else sums[g.fx] += v;
    }
    E.lootSums = sums; E.lootEraSums = eraSums;
    M.prod *= 1 + sums.all;
    M.clickMult *= 1 + sums.click;
    M.crit += sums.crit;
    M.bossDmg *= 1 + sums.boss;
    M.luck += sums.luck;
    M.comboGain += sums.combo;
    M.offline += sums.offline;
    M.npGain += sums.np;
    M.loot += sums.loot;
    for (let k = 0; k < 10; k++) M.eraMult[k] = 1 + eraSums[k];
    if (S.secrets.iddqd) M.bossDmg *= 1.5;
    // Grenzen
    M.costRed = Math.min(M.costRed, 0.5);
    M.comboDecay = Math.min(M.comboDecay, 0.85);
    M.eraCost = Math.min(M.eraCost, 0.8);
    M.eraReq = Math.min(M.eraReq, 0.6);
    E.recalcCps();
  };

  E.achCount = function () { return Object.keys(E.S.ach).length; };
  E.trophyBonus = function () { return E.achCount() * 0.01 * (1 + M.trophy) * M.trophyMult; };
  E.npBonus = function () { return E.S.npTotal * ((PZ.TUNE && PZ.TUNE.npP || 0.02) + M.npPower); };
  E.bossBonus = function () { return E.S.stats.bossWins * 0.01; };

  E.globalMult = function (withBuffs) {
    let g = M.prod * (1 + E.trophyBonus()) * (1 + E.npBonus()) * (1 + E.bossBonus());
    if (withBuffs) {
      for (const b of E.S.buffs) if (b.type === 'prod') g *= b.mult;
      if (E.S.fever > 0) g *= 1.5;
    }
    return g;
  };

  E.eraCount = function (k) {
    let n = 0;
    for (const g of PZ.ERAS[k].gens) n += E.S.gens[g.id] || 0;
    return n;
  };

  E.genMultOf = function (g) {
    let m = M.genMult[g.id] || 1;
    m *= M.eraMult[g.era];
    if (M.backcompat[g.era] && g.era > 0) m *= 1 + 0.01 * E.eraCount(g.era - 1);
    return m;
  };

  E.genProd = {}; // pro Gerät (ohne Buffs, mit globalen Multiplikatoren)
  E.recalcCps = function () {
    const S = E.S;
    let base = 0;
    const gm = E.globalMult(false);
    for (const g of PZ.GENS) {
      const n = S.gens[g.id] || 0;
      const p = n ? g.baseProd * n * E.genMultOf(g) * gm : 0;
      E.genProd[g.id] = p;
      base += p;
    }
    E.cpsBase = base;
    let buff = 1;
    for (const b of S.buffs) if (b.type === 'prod') buff *= b.mult;
    if (S.fever > 0) buff *= 1.5;
    E.cps = base * buff;
    if (E.cps > S.stats.maxCps) S.stats.maxCps = E.cps;
  };

  // ───────────────────────── Geräte kaufen ─────────────────────────
  E.growth = function () { return COST_GROWTH - M.costGrowth; };
  E.genUnlocked = function (g) { return g.era <= E.S.era; };
  E.genCost = function (id, amount) {
    const g = PZ.GEN[id];
    const n = E.S.gens[id] || 0;
    const r = E.growth();
    amount = amount || 1;
    const first = g.baseCost * Math.pow(r, n) * (1 - M.costRed);
    return amount === 1 ? first : first * (Math.pow(r, amount) - 1) / (r - 1);
  };
  E.maxAffordable = function (id, budget) {
    const g = PZ.GEN[id];
    const n = E.S.gens[id] || 0;
    const r = E.growth();
    const first = g.baseCost * Math.pow(r, n) * (1 - M.costRed);
    budget = budget === undefined ? E.S.coins : budget;
    if (budget < first) return 0;
    return Math.floor(Math.log(budget * (r - 1) / first + 1) / Math.log(r));
  };
  E.buyGen = function (id, amount) {
    const S = E.S;
    const g = PZ.GEN[id];
    if (!g || !E.genUnlocked(g)) return 0;
    if (amount === 'max') amount = E.maxAffordable(id);
    if (!amount) return 0;
    const cost = E.genCost(id, amount);
    if (cost > S.coins) return 0;
    S.coins -= cost;
    S.gens[id] = (S.gens[id] || 0) + amount;
    S.genMax[id] = Math.max(S.genMax[id] || 0, S.gens[id]);
    S.stats.genBought += amount;
    E.recalcCps();
    PZ.emit('buyGen', id, amount);
    return amount;
  };

  // ───────────────────────── Upgrades ─────────────────────────
  function reqMet(r) {
    const S = E.S;
    if (!r) return true;
    if (r.era !== undefined && S.era < r.era) return false;
    if (r.gen && (S.gens[r.gen] || 0) < r.count) return false;
    if (r.clicks && S.clicks < r.clicks) return false;
    if (r.eraGens && E.eraCount(r.era) < r.eraGens) return false;
    if (r.maxHeat && (S.stats.maxHeat || 0) < r.maxHeat) return false;
    if (r.crits && S.stats.crits < r.crits) return false;
    if (r.powerups && S.stats.powerups < r.powerups) return false;
    if (r.fevers && S.stats.fevers < r.fevers) return false;
    if (r.bossWins && S.stats.bossWins < r.bossWins) return false;
    if (r.achievements && E.achCount() < r.achievements) return false;
    return true;
  }
  E.reqMet = reqMet;
  E.upgCost = function (u) { return u.cost; };
  E.upgAvailable = function (u) { return !E.S.upg[u.id] && reqMet(u.req); };
  E.availableUpgrades = function () {
    const list = [];
    for (const u of PZ.UPGRADES) if (!E.S.upg[u.id] && reqMet(u.req)) list.push(u);
    list.sort((a, b) => a.cost - b.cost);
    return list;
  };
  E.buyUpgrade = function (id) {
    const S = E.S;
    const u = PZ.UPG[id];
    if (!u || S.upg[id] || !reqMet(u.req)) return false;
    const c = E.upgCost(u);
    if (S.coins < c) return false;
    S.coins -= c;
    S.upg[id] = 1;
    S.stats.upgBought++;
    S.stats.runUpgBought++;
    E.recalc();
    PZ.emit('buyUpg', id);
    return true;
  };

  // ───────────────────────── Klicken & Combo ─────────────────────────
  E.comboMaxMult = function () { return 3 + M.comboMax; };
  E.comboMult = function () {
    const S = E.S;
    if (S.fever > 0) return E.comboMaxMult() * 2;
    return 1 + (E.comboMaxMult() - 1) * (S.heat / 100);
  };
  E.critChance = function () { return Math.min(0.35, 0.02 + M.crit); };
  E.critMultiplier = function () { return 5 + M.critMult; };
  E.clickBase = function () {
    let v = (1 * M.clickMult + E.cps * M.clickCps);
    for (const b of E.S.buffs) if (b.type === 'click') v *= b.mult;
    return v;
  };
  E.feverDuration = function () { return (FEVER_BASE + M.feverDur) * (1 + M.feverPct); };

  let clickTimes = [];
  E.click = function (auto) {
    const S = E.S;
    const crit = Math.random() < E.critChance();
    let v = E.clickBase() * E.comboMult();
    if (crit) v *= E.critMultiplier();
    if (auto) v *= 0.5;
    S.coins += v; S.runEarned += v; S.totalEarned += v; S.clickEarned += v;
    if (crit) S.stats.crits++;
    if (!auto) {
      S.clicks++; S.runClicks++; S.stats.runManualClicks++;
      S.stats.noClickTime = 0;
      if (S.fever <= 0) {
        S.heat = Math.min(100, S.heat + 2.4 * (1 + M.comboGain));
        S.stats.maxHeat = Math.max(S.stats.maxHeat || 0, S.heat);
        if (S.heat >= 100) E.startFever();
      }
      if (!S.boss) S.bossCharge = Math.min(PZ.BOSS_CHARGE, S.bossCharge + 1);
      const now = E.now();
      clickTimes.push(now);
      while (clickTimes.length && now - clickTimes[0] > 1000) clickTimes.shift();
      if (clickTimes.length > S.stats.maxClickRate) S.stats.maxClickRate = clickTimes.length;
    } else S.stats.autoClicks++;
    let dmg = 0;
    if (S.boss && S.boss.state === 'fight') dmg = E.bossHit(crit, auto);
    return { value: v, crit: crit, dmg: dmg };
  };
  E.clickRate = function () { return clickTimes.length; };

  E.startFever = function () {
    const S = E.S;
    S.fever = E.feverDuration();
    S.heat = 100;
    S.stats.fevers++;
    E.recalcCps();
    PZ.emit('fever', true);
  };

  // ───────────────────────── Buffs & Power-Ups ─────────────────────────
  E.addBuff = function (id, type, mult, dur, name) {
    const S = E.S;
    const ex = S.buffs.find((b) => b.id === id);
    if (ex) { ex.t = Math.max(ex.t, dur); ex.max = Math.max(ex.max, dur); }
    else S.buffs.push({ id: id, type: type, mult: mult, t: dur, max: dur, name: name });
    E.recalcCps();
    PZ.emit('buff', id);
  };
  E.puInterval = function () { return U.rand(90, 200) / (1 + M.luck); };
  E.puLifetime = function () { return 12 * (1 + M.puLife); };

  E.collectPowerup = function (typeId) {
    const S = E.S;
    const d = 1 + M.buffDur;
    S.stats.powerups++;
    S.stats.puTypes[typeId] = (S.stats.puTypes[typeId] || 0) + 1;
    let res = { type: typeId, text: '' };
    switch (typeId) {
      case 'coinrain': {
        const g = Math.max(Math.min(S.coins * 0.15, E.cps * 900), E.cps * 60) + 13;
        E.gain(g);
        res.text = '+' + U.fmt(g) + ' Münzen!'; res.amount = g;
        break;
      }
      case 'turbo': E.addBuff('turbo', 'prod', 7, 77 * d, 'Turbo'); res.text = 'Produktion ×7!'; break;
      case 'clickfrenzy': E.addBuff('clickfrenzy', 'click', 77, 13 * d, 'Klickrausch'); res.text = 'Klicks ×77!'; break;
      case 'loot': { const l = E.lootRoll('powerup'); res.text = l ? l.game.name : 'Leere Kiste?!'; res.loot = l; break; }
      case 'fever': E.startFever(); res.text = 'FEVER!'; break;
      case 'oneup': {
        let best = null;
        for (const g of PZ.GENS) if ((S.gens[g.id] || 0) > 0) best = g;
        if (!best) { E.gain(E.cps * 60 + 50); res.text = 'Extra-Münzen!'; break; }
        const n = Math.max(1, Math.floor((S.gens[best.id] || 0) * 0.05));
        S.gens[best.id] += n;
        S.genMax[best.id] = Math.max(S.genMax[best.id] || 0, S.gens[best.id]);
        E.recalcCps();
        res.text = '+' + n + '× ' + best.name;
        break;
      }
      case 'glitch': {
        S.stats.glitches++;
        const r = Math.random();
        if (r < 0.35) { E.addBuff('glitch', 'prod', 77, 20 * d, 'Glitch'); res.text = 'PR0DUKT10N ×77'; }
        else if (r < 0.65) { const g = E.cps * 3600 + 1000; E.gain(g); res.text = '+' + U.fmt(g) + ' M̶ü̶n̶z̶e̶n̶'; }
        else if (r < 0.85) { for (const b of S.buffs) b.t += 30; S.fever = Math.max(S.fever, 0) + (S.fever > 0 ? 10 : 0); E.addBuff('glitch2', 'click', 7, 30 * d, 'Glitch'); res.text = 'ZEIT.EXE HÄNGT'; }
        else { const l = E.lootRoll('glitch'); res.text = l ? 'MISSINGNO → ' + l.game.name : 'MISSINGNO'; res.loot = l; }
        break;
      }
    }
    PZ.emit('powerup', typeId, res);
    return res;
  };

  E.gain = function (v) {
    const S = E.S;
    S.coins += v; S.runEarned += v; S.totalEarned += v;
  };

  // ───────────────────────── Kult-Spiele / Beute ─────────────────────────
  E.lootPool = function () {
    const maxEra = Math.max(E.S.era, 0);
    return PZ.LOOT.filter((g) => g.era <= maxEra);
  };
  /** Zufälliges Kult-Spiel. source: 'boss' | 'powerup' | 'bin' | 'era' | 'glitch' */
  E.lootRoll = function (source, opts) {
    const S = E.S;
    opts = opts || {};
    let pool = E.lootPool();
    if (opts.era !== undefined) { const p2 = pool.filter((g) => g.era === opts.era); if (p2.length) pool = p2; }
    if (!pool.length) return null;
    const luck = { boss: 1.6, glitch: 3, era: 1.4, powerup: 1, bin: 1 }[source] || 1;
    const rw = { c: PZ.RARITY.c.weight / luck, r: PZ.RARITY.r.weight, e: PZ.RARITY.e.weight * luck, l: PZ.RARITY.l.weight * luck * (1 + M.loot) };
    if (opts.minRarity === 'r') rw.c = 0;
    // Maximal ausgebaute Spiele nicht mehr ziehen, wenn Alternativen existieren
    let open = pool.filter((g) => (S.loot[g.id] || 0) < PZ.LOOT_MAX_LEVEL);
    if (open.length) pool = open;
    const rarity = U.weighted(Object.keys(rw).filter((k) => pool.some((g) => g.rarity === k)), (k) => rw[k]);
    const cand = pool.filter((g) => g.rarity === rarity);
    // Neue Spiele leicht bevorzugen
    const game = U.weighted(cand, (g) => (S.loot[g.id] ? 1 : 2.2 * (1 + M.loot)));
    const prev = S.loot[game.id] || 0;
    const lvl = Math.min(PZ.LOOT_MAX_LEVEL, prev + 1);
    S.loot[game.id] = lvl;
    S.stats.lootPulls++;
    E.recalc();
    const res = { game: game, level: lvl, isNew: prev === 0, maxed: prev >= PZ.LOOT_MAX_LEVEL, source: source };
    if (res.maxed) { const g = E.cps * 300 + 100; E.gain(g); res.refund = g; }
    PZ.emit('loot', res);
    return res;
  };
  E.binCost = function () {
    return Math.max(250, E.cpsBase * 180) * Math.pow(1.12, E.S.binBuys) * (1 - Math.min(0.75, M.binCost));
  };
  E.buyBin = function () {
    const S = E.S;
    const c = E.binCost();
    if (S.coins < c || S.era < 1) return null;
    S.coins -= c;
    S.binBuys++;
    S.stats.binBuys++;
    return E.lootRoll('bin');
  };

  // ───────────────────────── Bosse ─────────────────────────
  E.bossReady = function () { return !E.S.boss && E.S.bossCharge >= PZ.BOSS_CHARGE; };
  E.bossHP = function (era, wins) {
    return 60 * Math.pow(5.2, era) * Math.pow(1.6, wins);
  };
  E.bossDamage = function (crit) {
    const S = E.S;
    let d = (1 + S.era * 0.5) * M.bossDmg * E.comboMult();
    if (crit) d *= Math.max(2, E.critMultiplier() / 2.5);
    return d;
  };
  E.bossTime = function () { return 30 + M.bossTime; };
  E.bossStart = function () {
    const S = E.S;
    if (!E.bossReady()) return null;
    const wins = S.bossEraWins[S.era] || 0;
    const pool = PZ.BOSSES.filter((b) => b.era === S.era);
    let b = pool[0];
    if (Math.random() < 0.25 || !b) b = U.pick(PZ.BOSSES.filter((x) => x.era === -1));
    const hp = E.bossHP(S.era, wins);
    S.boss = { id: b.id, hp: hp, max: hp, t: E.bossTime(), total: E.bossTime(), state: 'fight', level: wins + 1, era: S.era };
    S.bossCharge = 0;
    PZ.emit('bossStart', S.boss);
    return S.boss;
  };
  E.bossHit = function (crit, auto) {
    const S = E.S;
    const B = S.boss;
    if (!B || B.state !== 'fight') return 0;
    let d = E.bossDamage(crit);
    if (auto) d *= 0.5;
    B.hp -= d;
    if (B.hp <= 0) E.bossEnd(true);
    return d;
  };
  E.bossReward = function (B) {
    return Math.max(E.cps * Math.min(3600, 120 * B.level), 500) * (1 + M.bossReward);
  };
  E.bossEnd = function (win) {
    const S = E.S;
    const B = S.boss;
    if (!B) return;
    B.state = win ? 'won' : 'lost';
    const res = { win: win, boss: B };
    if (win) {
      S.bossEraWins[B.era] = (S.bossEraWins[B.era] || 0) + 1;
      S.stats.bossWins++;
      S.stats.bossTypes[B.id] = (S.stats.bossTypes[B.id] || 0) + 1;
      if (B.t > B.total * 0.5) S.stats.speedkills++;
      const g = E.bossReward(B);
      E.gain(g);
      res.coins = g;
      res.loot = E.lootRoll('boss');
      E.recalc();
    } else {
      S.stats.bossLosses++;
      S.bossCharge = PZ.BOSS_CHARGE * 0.5;
    }
    S.boss = null;
    PZ.emit('bossEnd', res);
    return res;
  };

  // ───────────────────────── Epochen ─────────────────────────
  E.eraReqCount = function () {
    const k = E.S.era;
    if (k >= 9) return Infinity;
    return Math.ceil(PZ.ERA_REQ[k] * (1 - M.eraReq));
  };
  E.eraCost = function () {
    const k = E.S.era;
    if (k >= 9) return Infinity;
    return PZ.eraAdvanceCost(k) * (1 - M.eraCost);
  };
  E.canAdvance = function () {
    const S = E.S;
    return S.era < 9 && E.eraCount(S.era) >= E.eraReqCount() && S.coins >= E.eraCost() && !E.pendingWar();
  };
  E.advanceEra = function () {
    const S = E.S;
    if (!E.canAdvance()) return false;
    S.coins -= E.eraCost();
    S.era++;
    const first = S.era > S.maxEra;
    S.maxEra = Math.max(S.maxEra, S.era);
    const rt = (Date.now() - S.runStart) / 1000;
    if (!S.stats.bestRunTime[S.era] || rt < S.stats.bestRunTime[S.era]) S.stats.bestRunTime[S.era] = rt;
    S.heat = Math.min(S.heat, 60);
    E.recalc();
    const loot = E.lootRoll('era', { era: S.era });
    PZ.emit('era', S.era, first, loot);
    return true;
  };
  E.yearNow = function () {
    const S = E.S;
    const e = PZ.ERAS[S.era];
    const span = e.years[1] - e.years[0] + 1;
    const req = S.era >= 9 ? 400 : E.eraReqCount();
    const p = Math.min(1, E.eraCount(S.era) / Math.max(1, req));
    return Math.min(e.years[1], e.years[0] + Math.floor(span * p));
  };

  // Konsolenkriege
  E.pendingWar = function () {
    const S = E.S;
    for (const w of PZ.WARS) if (w.era <= S.era && !S.wars[w.id]) return w;
    return null;
  };
  E.chooseWar = function (warId, optIds) {
    const S = E.S;
    const w = PZ.WAR[warId];
    if (!w || S.wars[warId]) return false;
    if (!Array.isArray(optIds)) optIds = [optIds];
    if (optIds.length > 1 && !M.unlock.doppel) optIds = optIds.slice(0, 1);
    S.wars[warId] = optIds;
    for (const o of optIds) S.warsEver[o] = 1;
    E.recalc();
    PZ.emit('war', warId, optIds);
    return true;
  };

  // ───────────────────────── Crash (Prestige) ─────────────────────────
  const TU = PZ.TUNE || {};
  E.npBaseFor = function (total) { return (TU.npK || 10) * Math.pow(total / (TU.npD || 1e9), TU.npA || 0.2); };
  E.crashGain = function () {
    const S = E.S;
    if (S.runEarned < (TU.npD || 1e9)) return 0;
    return Math.floor(E.npBaseFor(S.runEarned) * (1 + M.npGain));
  };
  E.canCrash = function () { return E.S.era >= 2 && E.crashGain() >= 1; };
  E.crash = function () {
    const S = E.S;
    if (!E.canCrash()) return false;
    const gain = E.crashGain();
    S.np += gain; S.npTotal += gain;
    S.crashes++;
    // Zurücksetzen
    S.coins = 0; S.runEarned = 0; S.runClicks = 0;
    S.gens = {}; S.upg = {}; S.wars = {};
    S.buffs = []; S.heat = 0; S.fever = 0; S.boss = null; S.bossCharge = 0; S.bossEraWins = {};
    S.binBuys = 0; S.puTimer = 30;
    S.stats.runTime = 0; S.stats.runUpgBought = 0; S.stats.runManualClicks = 0;
    S.runStart = Date.now();
    E.recalc();
    S.era = M.startEra;
    E.applyStartPerks();
    E.recalc();
    PZ.emit('crash', gain);
    return gain;
  };
  E.applyStartPerks = function () {
    const S = E.S;
    for (const id in S.perks) {
      const p = PZ.PERK[id];
      if (p && p.fx.start) for (const g in p.fx.start) {
        S.gens[g] = Math.max(S.gens[g] || 0, p.fx.start[g]);
        S.genMax[g] = Math.max(S.genMax[g] || 0, S.gens[g]);
      }
    }
  };
  E.perkAvailable = function (p) {
    const S = E.S;
    if (S.perks[p.id]) return false;
    if (p.secret && !S.secrets.konami) return false;
    if (p.req && !S.perks[p.req]) return false;
    return true;
  };
  E.buyPerk = function (id) {
    const S = E.S;
    const p = PZ.PERK[id];
    if (!p || !E.perkAvailable(p) || S.np < p.cost) return false;
    S.np -= p.cost;
    S.perks[id] = 1;
    E.recalc();
    if (p.fx.start) { E.applyStartPerks(); E.recalc(); }
    PZ.emit('perk', id);
    return true;
  };

  // ───────────────────────── Tick ─────────────────────────
  E.now = function () { return Date.now(); };
  let autoAcc = 0, autoBuyAcc = 0, slowAcc = 0;
  E.tick = function (dt) {
    const S = E.S;
    // Produktion
    const g = E.cps * dt;
    S.coins += g; S.runEarned += g; S.totalEarned += g;
    S.stats.playTime += dt; S.stats.runTime += dt; S.stats.noClickTime += dt;

    // Combo
    if (S.fever > 0) {
      S.fever -= dt;
      S.heat = 100 * Math.max(0, S.fever / E.feverDuration());
      if (S.fever <= 0) { S.fever = 0; S.heat = 25; E.recalcCps(); PZ.emit('fever', false); }
    } else if (S.heat > 0) {
      S.heat *= Math.exp(-0.12 * (1 - M.comboDecay) * dt);
      if (S.heat < 0.5) S.heat = 0;
    }

    // Buffs
    let changed = false;
    for (let i = S.buffs.length - 1; i >= 0; i--) {
      S.buffs[i].t -= dt;
      if (S.buffs[i].t <= 0) { PZ.emit('buffEnd', S.buffs[i].id); S.buffs.splice(i, 1); changed = true; }
    }
    if (changed) E.recalcCps();

    // Boss
    if (S.boss && S.boss.state === 'fight') {
      S.boss.t -= dt;
      if (S.boss.t <= 0) E.bossEnd(false);
    } else if (!S.boss && S.bossCharge < PZ.BOSS_CHARGE) {
      S.bossCharge = Math.min(PZ.BOSS_CHARGE, S.bossCharge + dt * 0.4);
    }

    // Power-Up-Timer
    S.puTimer -= dt;
    if (S.puTimer <= 0) {
      S.puTimer = E.puInterval();
      PZ.emit('spawnPowerup', E.pickPowerup());
    }

    // Auto-Klicks
    const rate = PZ.AUTO_RATES[M.auto] || 0;
    if (rate > 0) {
      autoAcc += dt * rate;
      while (autoAcc >= 1) { autoAcc -= 1; const r = E.click(true); PZ.emit('autoClick', r); }
    }

    // Automatisierung
    autoBuyAcc += dt;
    if (autoBuyAcc >= 1) { autoBuyAcc = 0; E.automation(); }

    slowAcc += dt;
    if (slowAcc >= 1) { slowAcc = 0; E.recalcCps(); PZ.emit('slowTick'); }
  };

  E.pickPowerup = function () {
    const S = E.S;
    let list = PZ.POWERUPS;
    if (S.era < 1) list = list.filter((p) => p.id !== 'loot');
    return U.weighted(list, (p) => p.weight * (p.id === 'glitch' && S.secrets.glitchy ? 3 : 1)).id;
  };

  E.automation = function () {
    const S = E.S;
    if (M.unlock.autoUpg && S.auto.upg) {
      const list = E.availableUpgrades();
      for (const u of list) { if (u.cost <= S.coins) E.buyUpgrade(u.id); else break; }
    }
    if (M.unlock.autoGen && S.auto.gen) {
      for (let i = 0; i < 25; i++) {
        const best = E.bestGen();
        if (!best || E.genCost(best.id) > S.coins) break;
        E.buyGen(best.id, 1);
      }
    }
    if (M.unlock.autoEra && S.auto.era && E.canAdvance()) E.advanceEra();
  };
  /** Gerät mit bestem Preis-Leistungs-Verhältnis */
  E.bestGen = function () {
    let best = null, bestScore = Infinity;
    for (const g of PZ.GENS) {
      if (!E.genUnlocked(g)) continue;
      const n = E.S.gens[g.id] || 0;
      const per = g.baseProd * E.genMultOf(g) * E.globalMult(false);
      const score = E.genCost(g.id) / Math.max(per, 1e-300) * (n === 0 ? 0.5 : 1);
      if (score < bestScore) { bestScore = score; best = g; }
    }
    return best;
  };

  // ───────────────────────── Offline ─────────────────────────
  E.offlineEff = function () { return Math.min(1.5, 0.5 + M.offline); };
  E.offlineCapH = function () { return 8 + M.offlineCap; };
  E.applyOffline = function (sec) {
    const S = E.S;
    const cap = E.offlineCapH() * 3600;
    const t = Math.min(sec, cap);
    if (t < 30) return null;
    const g = E.cpsBase * t * E.offlineEff();
    E.gain(g);
    S.bossCharge = Math.min(PZ.BOSS_CHARGE, S.bossCharge + t * 0.4);
    S.stats.offlineBest = Math.max(S.stats.offlineBest, sec);
    return { sec: sec, used: t, gain: g, eff: E.offlineEff(), capped: sec > cap };
  };

  // ───────────────────────── Speichern ─────────────────────────
  E.serialize = function () {
    const S = E.S;
    S.lastSave = Date.now();
    return 'PZ1:' + U.b64enc(JSON.stringify(S));
  };
  E.deserialize = function (str) {
    str = String(str || '').trim();
    if (!str.startsWith('PZ1:')) throw new Error('Kein PIXELZEIT-Spielstand');
    const obj = JSON.parse(U.b64dec(str.slice(4)));
    return E.migrate(obj);
  };
  E.migrate = function (obj) {
    const base = E.newState();
    const S = Object.assign(base, obj);
    S.stats = Object.assign(E.newState().stats, obj.stats || {});
    S.settings = Object.assign(E.newState().settings, obj.settings || {});
    S.auto = Object.assign({ upg: false, gen: false, era: false }, obj.auto || {});
    if (S.boss) S.boss = null; // laufende Kämpfe verfallen
    return S;
  };
  E.load = function (S) {
    E.S = S;
    E.recalc();
  };
})();
