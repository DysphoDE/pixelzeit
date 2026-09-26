/* PIXELZEIT – Trophäen */
(function () {
  'use strict';
  const PZ = (window.PZ = window.PZ || {});
  const A = [];
  PZ.ACH = A;
  const E = () => PZ.E;
  const S = () => PZ.E.S;
  const f = (n) => PZ.U.fmt(n);

  // tier: b = Bronze, s = Silber, g = Gold, p = Platin
  function add(id, name, desc, tier, check, opts) {
    A.push(Object.assign({ id: id, name: name, desc: desc, tier: tier, check: check }, opts || {}));
  }

  // Münzen gesamt
  [[1e2, 'Insert Coin', 'b'], [1e3, 'Taschengeld-Tycoon', 'b'], [1e4, 'Sparschwein geschlachtet', 'b'], [1e5, 'Münzkasten voll', 'b'],
    [1e6, 'Das Millionenspiel', 'b'], [1e7, 'Goldene Kartusche', 's'], [1e8, 'Automatenkönig', 's'], [1e9, 'Milliarden-Moment', 's'],
    [1e11, 'Konsolen-Tycoon', 's'], [1e13, 'Publisher-Imperium', 'g'], [1e15, 'Too big to fail', 'g'], [1e18, 'Marktkapitalisierung: Ja', 'g'],
    [1e21, 'Dagobert-Modus', 'g'], [1e24, 'Planetarer Umsatz', 'p'], [1e28, 'Galaktischer Highscore', 'p'], [1e33, 'Kosmischer Konzern', 'p'],
    [1e38, 'Multiversum-Mogul', 'p'], [1e45, 'Integer Overflow', 'p']].forEach((t, i) =>
    add('earn' + i, t[1], 'Verdiene insgesamt ' + f(t[0]) + ' Münzen.', t[2], () => S().totalEarned >= t[0]));

  // Münzen pro Sekunde
  [[1, 'Es läuft!', 'b'], [10, 'Passives Einkommen', 'b'], [100, 'Nebenbei reich', 'b'], [1e3, 'Münzmaschine', 's'], [1e5, 'Druckerpresse', 's'],
    [1e7, 'Geldfluss', 's'], [1e9, 'Geldregen', 'g'], [1e12, 'Geld-Tsunami', 'g'], [1e15, 'Wirtschaftswunder', 'g'], [1e18, 'Hyperinflation', 'p'],
    [1e22, 'Singularität', 'p'], [1e27, 'Urknall-Rendite', 'p']].forEach((t, i) =>
    add('cps' + i, t[1], 'Erreiche ' + f(t[0]) + ' Münzen pro Sekunde.', t[2], () => E().cps >= t[0]));

  // Klicks
  [[1, 'Hallo Welt', 'b'], [100, 'Fingerübung', 'b'], [1000, 'Klick-Kadett', 'b'], [1e4, 'Button-Masher', 's'], [5e4, 'Sehnenscheiden-Syndrom', 's'],
    [1e5, 'Der Finger Gottes', 'g'], [2.5e5, 'Klick-Legende', 'p']].forEach((t, i) =>
    add('click' + i, t[1], f(t[0]) + '× von Hand geklickt.', t[2], () => S().clicks >= t[0]));
  [[1e3, 'Handarbeit', 'b'], [1e6, 'Mit eigenen Händen', 's'], [1e10, 'Goldene Finger', 's'], [1e15, 'Midas-Touch', 'g'], [1e21, 'Klickonomie', 'p']].forEach((t, i) =>
    add('clickearn' + i, t[1], 'Verdiene ' + f(t[0]) + ' Münzen durch Klicks.', t[2], () => S().clickEarned >= t[0]));

  // Epochen
  const ERA_ACH = ['', 'Willkommen in der Spielhalle', 'Den Crash überlebt', 'Konsolenkrieger', 'Eine neue Dimension', 'Online!', 'High Definition', 'Chat, ist das echt?', 'Next-Gen-ready', 'Zurück in die Zukunft'];
  for (let k = 1; k <= 9; k++) {
    add('era' + k, ERA_ACH[k], 'Erreiche die Epoche „' + PZ.ERAS[k].name + '“.', k < 3 ? 'b' : k < 6 ? 's' : k < 9 ? 'g' : 'p', () => S().maxEra >= k);
  }

  // Geräte je Typ
  PZ.GENS.forEach((g) => {
    add('gen_' + g.id + '_50', g.name + '-Fan', 'Besitze 50× ' + g.name + '.', g.era < 4 ? 'b' : 's', () => (S().gens[g.id] || 0) >= 50);
    add('gen_' + g.id + '_150', g.name + '-Sammler', 'Besitze 150× ' + g.name + '.', g.era < 4 ? 's' : 'g', () => (S().gens[g.id] || 0) >= 150);
  });
  [[100, 'Kleiner Keller', 'b'], [500, 'Voller Dachboden', 's'], [1000, 'Lagerhalle', 's'], [2500, 'Retro-Museum', 'g'], [5000, 'Hardware-Horde', 'p']].forEach((t, i) =>
    add('owned' + i, t[1], 'Besitze gleichzeitig ' + f(t[0]) + ' Geräte.', t[2], () => {
      let n = 0; for (const k in S().gens) n += S().gens[k]; return n >= t[0];
    }));
  [[10, 'Aufgerüstet', 'b'], [50, 'Tuning-Freak', 's'], [100, 'Hardware-Hunger', 's'], [200, 'Alles auf Max', 'g'], [350, 'Maxed Out', 'p']].forEach((t, i) =>
    add('upg' + i, t[1], 'Kaufe ' + t[0] + ' Upgrades (in einem Durchlauf).', t[2], () => Object.keys(S().upg).length >= t[0]));

  // Combo, Krits, Fever
  add('fever1', 'Im Fieber', 'Löse zum ersten Mal den Fever-Modus aus.', 'b', () => S().stats.fevers >= 1);
  add('fever25', 'Fieberwahn', 'Löse 25× Fever aus.', 's', () => S().stats.fevers >= 25);
  add('fever100', 'Dauerfieber', 'Löse 100× Fever aus.', 'g', () => S().stats.fevers >= 100);
  add('fever500', 'Thermometer explodiert', 'Löse 500× Fever aus.', 'p', () => S().stats.fevers >= 500);
  add('rate8', 'Hummelflug', 'Klicke 8× in einer Sekunde.', 'b', () => S().stats.maxClickRate >= 8);
  add('rate12', 'Maschinengewehr-Finger', 'Klicke 12× in einer Sekunde.', 's', () => S().stats.maxClickRate >= 12);
  add('rate16', 'Turbo-Daumen', 'Klicke 16× in einer Sekunde.', 'g', () => S().stats.maxClickRate >= 16);
  [[1, 'Kritischer Treffer!', 'b'], [100, 'Schwachstelle gefunden', 'b'], [1000, 'Präzisionsschütze', 's'], [1e4, 'Headshot-Maschine', 'g'], [5e4, 'Immer ins Schwarze', 'p']].forEach((t, i) =>
    add('crit' + i, t[1], 'Lande ' + f(t[0]) + ' kritische Klicks.', t[2], () => S().stats.crits >= t[0]));

  // Power-Ups
  [[1, 'Power-Up!', 'b'], [10, 'Sammelfieber', 'b'], [50, 'Power-Junkie', 's'], [150, 'Item-Magnet', 'g'], [500, 'Alles meins', 'p']].forEach((t, i) =>
    add('pu' + i, t[1], 'Sammle ' + t[0] + ' Power-Ups ein.', t[2], () => S().stats.powerups >= t[0]));
  add('glitch1', 'MissingNo.', 'Erwische einen Glitch.', 's', () => S().stats.glitches >= 1);
  add('glitch10', 'Speedrunner-Glitch', 'Erwische 10 Glitches.', 'g', () => S().stats.glitches >= 10);
  add('putypes', 'Volles Sortiment', 'Sammle jede Art von Power-Up mindestens einmal.', 'g', () => PZ.POWERUPS.every((p) => S().stats.puTypes[p.id]));

  // Bosse
  [[1, 'Endgegner besiegt', 'b'], [5, 'Boss-Jäger', 'b'], [15, 'Boss-Schlächter', 's'], [30, 'Boss-Rush', 's'], [60, 'Unaufhaltsam', 'g'], [120, 'Final Boss? Pff.', 'p']].forEach((t, i) =>
    add('boss' + i, t[1], 'Besiege ' + t[0] + ' Bosse.', t[2], () => S().stats.bossWins >= t[0]));
  add('bosslose', 'Game Over', 'Verliere einen Bosskampf. Passiert den Besten.', 'b', () => S().stats.bossLosses >= 1);
  add('speedkill', 'Speedkill', 'Besiege einen Boss in weniger als der Hälfte der Zeit.', 's', () => S().stats.speedkills >= 1);
  add('speedkill10', 'Blitzkrieg der Bits', 'Schaffe 10 Speedkills.', 'g', () => S().stats.speedkills >= 10);
  add('bossall', 'Bestiarium', 'Besiege jede Boss-Art mindestens einmal.', 'p', () => PZ.BOSSES.every((b) => S().stats.bossTypes[b.id]));
  add('bugqueen', 'It’s a feature', 'Besiege die Bug-Königin.', 's', () => S().stats.bossTypes.bugqueen >= 1);
  add('rrod', 'Garantiefall erledigt', 'Besiege den Roten Ring des Todes.', 's', () => S().stats.bossTypes.rrod >= 1);

  // Sammlung
  const lootCount = () => Object.keys(S().loot).length;
  [[1, 'Erstes Kult-Spiel', 'b'], [10, 'Kleines Regal', 'b'], [25, 'Sammler', 's'], [50, 'Archivar', 'g'], [75, 'Kurator', 'g']].forEach((t, i) =>
    add('loot' + i, t[1], 'Sammle ' + t[0] + ' verschiedene Kult-Spiele.', t[2], () => lootCount() >= t[0]));
  add('lootall', 'Komplettist', 'Sammle alle Kult-Spiele.', 'p', () => lootCount() >= PZ.LOOT.length);
  add('legend1', 'Legendär!', 'Finde ein legendäres Kult-Spiel.', 's', () => PZ.LOOT.some((g) => g.rarity === 'l' && S().loot[g.id]));
  add('legend5', 'Hall of Legends', 'Besitze 5 legendäre Kult-Spiele.', 'g', () => PZ.LOOT.filter((g) => g.rarity === 'l' && S().loot[g.id]).length >= 5);
  add('lootmax', 'Remaster-Meister', 'Bringe ein Kult-Spiel auf Stufe 10.', 'g', () => Object.values(S().loot).some((l) => l >= PZ.LOOT_MAX_LEVEL));
  add('bin10', 'Grabbeltisch-Wühler', 'Durchwühle 10× den Grabbeltisch.', 'b', () => S().stats.binBuys >= 10);
  add('bin100', 'Schnäppchenjäger', 'Durchwühle 100× den Grabbeltisch.', 's', () => S().stats.binBuys >= 100);
  add('bin500', 'Flohmarkt-Legende', 'Durchwühle 500× den Grabbeltisch.', 'g', () => S().stats.binBuys >= 500);
  add('etfound', 'Wüstenfund', 'Finde „E.T.“ – das wohl berüchtigtste Spiel der Geschichte.', 's', () => !!S().loot.et);

  // Crash / Prestige
  [[1, 'Der große Crash', 's'], [3, 'Wiederauferstehung', 's'], [10, 'Zyklus der Branche', 'g'], [25, 'Ewige Wiederkehr', 'g'], [50, 'Crash-Test-Dummy', 'p']].forEach((t, i) =>
    add('crash' + i, t[1], 'Löse ' + t[0] + '× einen Crash aus.', t[2], () => S().crashes >= t[0]));
  [[10, 'Gute alte Zeit', 's'], [1000, 'Früher war alles besser', 'g'], [1e6, 'Retro-Guru', 'p']].forEach((t, i) =>
    add('np' + i, t[1], 'Sammle insgesamt ' + f(t[0]) + ' Nostalgie.', t[2], () => S().npTotal >= t[0]));
  add('perk5', 'Hall of Fame', 'Schalte 5 Perks frei.', 's', () => Object.keys(S().perks).length >= 5);
  add('perk15', 'Legende der Branche', 'Schalte 15 Perks frei.', 'g', () => Object.keys(S().perks).length >= 15);
  add('perkall', 'Ruhmeshalle komplett', 'Schalte alle regulären Perks frei.', 'p', () => PZ.PERKS.every((p) => p.secret || S().perks[p.id]));

  // Konsolenkriege
  PZ.WARS.forEach((w) => w.options.forEach((o) =>
    add('war_' + o.id, o.name, 'Wähle „' + o.name + '“ in „' + w.title + '“.', 'b', () => !!S().warsEver[o.id])));
  add('doppel', 'Doppelagent', 'Wähle in einem Konsolenkrieg beide Seiten.', 'g', () => Object.values(S().wars).some((a) => a.length > 1));

  // Zeit
  [[600, 'Nur noch eine Runde', 'b'], [3600, 'Eine Stunde später …', 'b'], [18000, 'Der Abend ist gelaufen', 's'], [86400, 'Suchtgefahr', 'g'], [360000, 'Veteran', 'p']].forEach((t, i) =>
    add('time' + i, t[1], 'Spiele insgesamt ' + PZ.U.time(t[0]) + '.', t[2], () => S().stats.playTime >= t[0]));
  add('offline', 'Willkommen zurück', 'Kehre nach über einer Stunde Pause zurück.', 'b', () => S().stats.offlineBest >= 3600);
  add('offline12', 'Winterschlaf', 'Kehre nach über 12 Stunden Pause zurück.', 's', () => S().stats.offlineBest >= 43200);

  // Herausforderungen
  add('speedrun3', 'Any%', 'Erreiche den 16-Bit-Konsolenkrieg in unter 20 Minuten eines Durchlaufs.', 'g', () => S().stats.bestRunTime[3] && S().stats.bestRunTime[3] < 1200);
  add('speedrun6', 'Tool-Assisted', 'Erreiche „HD & Bewegung“ in unter 30 Minuten eines Durchlaufs.', 'p', () => S().stats.bestRunTime[6] && S().stats.bestRunTime[6] < 1800);
  add('pacifist', 'Pazifist', 'Erreiche das Arcade-Zeitalter, ohne im Durchlauf selbst zu klicken.', 'g', () => S().era >= 1 && S().stats.runManualClicks === 0 && S().stats.runTime > 5);
  add('hardcore', 'Hardcore-Modus', 'Erreiche die 8-Bit-Ära, ohne im Durchlauf ein Upgrade zu kaufen.', 'g', () => S().era >= 2 && S().stats.runUpgBought === 0);
  add('afk', 'AFK', 'Lass das Spiel 10 Minuten laufen, ohne zu klicken.', 'b', () => S().stats.noClickTime >= 600);
  add('banker', 'Dagoberts Geldspeicher', 'Horte das 1000-Fache deiner Münzen pro Sekunde.', 's', () => E().cps > 10 && S().coins >= E().cps * 1000);

  // Geheim
  add('konami', 'Konami-Code', '↑↑↓↓←→←→BA', 'g', () => !!S().secrets.konami, { secret: true, hint: 'Ein Code aus dem Jahr 1985 …' });
  add('iddqd', 'Gott-Modus', 'Gib IDDQD ein.', 's', () => !!S().secrets.iddqd, { secret: true, hint: 'Doom-Spieler kennen fünf Buchstaben.' });
  add('idkfa', 'Alle Schlüssel', 'Gib IDKFA ein.', 's', () => !!S().secrets.idkfa, { secret: true, hint: 'Und dann noch fünf.' });
  add('xyzzy', 'Nichts passiert.', 'Gib XYZZY ein.', 's', () => !!S().secrets.xyzzy, { secret: true, hint: 'Ein Zauberwort aus einer Höhle.' });
  add('ticker', 'Eilmeldung!', 'Klicke 10× auf den Newsticker.', 'b', () => S().stats.tickerClicks >= 10, { secret: true, hint: 'Die Nachrichten sind anklickbar …' });
  add('nightowl', 'Nachteule', 'Spiele zwischen 2 und 4 Uhr nachts.', 's', () => !!S().secrets.nightowl, { secret: true, hint: 'Manche Stunden sind besonders ruhig.' });
  add('eastereggs', 'Easter-Egg-Jäger', 'Finde das versteckte Easter Egg im Museum.', 'g', () => !!S().secrets.easter, { secret: true, hint: 'Warren Robinett wäre stolz. (Museum)' });
  add('blow', 'Ins Modul gepustet', 'Klicke im Museum 5× auf das NES.', 'b', () => !!S().secrets.blow, { secret: true, hint: 'Hilft immer. (Museum)' });
  add('pause', 'Pausentaste', 'Lass das Pause-Menü 60 Sekunden offen.', 'b', () => !!S().secrets.pause, { secret: true, hint: 'Manchmal braucht man eine Pause.' });
  add('museum10', 'Hobby-Historiker', 'Sieh dir 10 Exponate im Museum an.', 'b', () => Object.keys(S().stats.museum).length >= 10);
  add('museumall', 'Chronist', 'Sieh dir alle Exponate im Museum an.', 'g', () => Object.keys(S().stats.museum).length >= PZ.GENS.length);

  PZ.ACH_BY = {};
  A.forEach((a) => (PZ.ACH_BY[a.id] = a));

  /** Prüft alle Trophäen, gibt neu freigeschaltete zurück */
  PZ.checkAchievements = function () {
    const st = S();
    const fresh = [];
    for (const a of A) {
      if (st.ach[a.id]) continue;
      let ok = false;
      try { ok = a.check(); } catch (e) { ok = false; }
      if (ok) { st.ach[a.id] = Date.now(); fresh.push(a); }
    }
    if (fresh.length) { PZ.E.recalcCps(); fresh.forEach((a) => PZ.emit('achievement', a)); }
    return fresh;
  };
})();
