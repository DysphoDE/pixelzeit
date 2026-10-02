/* PIXELZEIT – Spieldaten: Epochen, Geräte, Upgrades, Perks, Konsolenkriege, Power-Ups, Bosse */
(function () {
  'use strict';
  const PZ = (window.PZ = window.PZ || {});

  // ───────────────────────── Epochen ─────────────────────────
  PZ.ERAS = [
    { id: 0, name: 'Die Pioniere', short: 'Pioniere', years: [1972, 1976], accent: '#39ff88', accent2: '#b6ffcf', ink: '#d8ffe6', bg: '#030a06', scene: 'phosphor', music: 'title', ctrl: 'e0', ctrlName: 'Odyssey-Controller', currency: 'Münzen' },
    { id: 1, name: 'Goldenes Arcade-Zeitalter', short: 'Arcade', years: [1977, 1982], accent: '#ff3fa4', accent2: '#29d3ff', ink: '#ffe8f6', bg: '#0b0316', scene: 'starfield', music: 'm1', ctrl: 'e1', ctrlName: 'Atari-Joystick' },
    { id: 2, name: 'Die 8-Bit-Ära', short: '8-Bit', years: [1983, 1988], accent: '#ff4b3e', accent2: '#7ab0ff', ink: '#fff1ee', bg: '#070b24', scene: 'nes', music: 'm1', ctrl: 'e2', ctrlName: 'NES-Controller' },
    { id: 3, name: 'Der 16-Bit-Konsolenkrieg', short: '16-Bit', years: [1989, 1994], accent: '#3f8cff', accent2: '#ffd23f', ink: '#eef4ff', bg: '#060a1f', scene: 'mode7', music: 'm2', ctrl: 'e3', ctrlName: 'Super-Nintendo-Pad' },
    { id: 4, name: 'Die 3D-Revolution', short: '3D', years: [1995, 1999], accent: '#19d3c5', accent2: '#ffcc33', ink: '#e8fffc', bg: '#04100f', scene: 'polygon', music: 'm2', ctrl: 'e4', ctrlName: 'N64-Controller' },
    { id: 5, name: 'Online & 128 Bit', short: 'Online', years: [2000, 2004], accent: '#ff7a1a', accent2: '#5aa2ff', ink: '#fff3ea', bg: '#0e0703', scene: 'network', music: 'm4', ctrl: 'e5', ctrlName: 'GameCube-Controller' },
    { id: 6, name: 'HD & Bewegung', short: 'HD', years: [2005, 2012], accent: '#86e01e', accent2: '#e9f3ff', ink: '#f3ffe6', bg: '#060b03', scene: 'glossy', music: 'm4', ctrl: 'e6', ctrlName: 'Xbox-360-Controller' },
    { id: 7, name: 'Streaming & Indies', short: 'Streaming', years: [2013, 2019], accent: '#a970ff', accent2: '#ff5c8a', ink: '#f4eeff', bg: '#0a0614', scene: 'stream', music: 'm4', ctrl: 'e7', ctrlName: 'DualShock 4' },
    { id: 8, name: 'Next-Gen', short: 'Next-Gen', years: [2020, 2026], accent: '#43a8ff', accent2: '#f5f8ff', ink: '#eef6ff', bg: '#03070f', scene: 'particles', music: 'm5', ctrl: 'e8', ctrlName: 'DualSense' },
    { id: 9, name: 'Die Zukunft', short: 'Zukunft', years: [2027, 2040], accent: '#ff5cf0', accent2: '#5cffe8', ink: '#fff0fd', bg: '#08030c', scene: 'holo', music: 'm5', ctrl: 'e9', ctrlName: 'Neuro-Controller' },
  ];

  // ───────────────────────── Geräte ─────────────────────────
  // [id, Name, Epoche, Jahr, einzigartiges Upgrade, Upgrade-Beschreibung]
  const GEN_DEF = [
    ['pong', 'Pong-Automat', 0, 1972, 'Größerer Münzkasten', 'Der Prototyp fiel aus, weil der Kasten überquoll. Nie wieder!'],
    ['odyssey', 'Magnavox Odyssey', 0, 1972, 'Bildschirm-Folien', 'Bunte Overlays für den Fernseher – Grafik zum Aufkleben.'],
    ['channelf', 'Fairchild Channel F', 0, 1976, 'Wechselbare Module', 'Erstmals Spiele auf ROM-Modulen. Die Zukunft steckt im Schacht.'],
    ['atari2600', 'Atari 2600', 1, 1977, 'Holzfurnier-Gehäuse', 'Echtes Fake-Holz. Passt perfekt zur Schrankwand.'],
    ['invaders', 'Space-Invaders-Automat', 1, 1978, '100-Yen-Nachschub', 'Genug Kleingeld für die nächste Welle.'],
    ['gamewatch', 'Game & Watch', 1, 1980, 'Das Steuerkreuz', 'Gunpei Yokois Kreuz-Taste – kopiert bis heute.'],
    ['c64', 'Commodore 64', 1, 1982, 'Turbo-Tape-Lader', 'Laden in 3 statt 20 Minuten. Fast magisch.'],
    ['nes', 'NES', 2, 1983, 'Ins Modul pusten', 'Wissenschaftlich wirkungslos. Praktisch unverzichtbar.'],
    ['mastersystem', 'Sega Master System', 2, 1986, 'Light Phaser', 'Zielen auf den Röhrenfernseher.'],
    ['amiga', 'Amiga 500', 2, 1987, 'Speichererweiterung', '512 KB mehr – im Schulhof hochangesehen.'],
    ['gameboy', 'Game Boy', 2, 1989, 'Tetris-Bundle', 'Das perfekte Paar: grauer Klotz und fallende Blöcke.'],
    ['megadrive', 'Sega Mega Drive', 3, 1990, 'Blast Processing', 'Niemand weiß, was es ist. Alle wollen es.'],
    ['snes', 'Super Nintendo', 3, 1992, 'Mode 7', 'Der Boden dreht sich! Pseudo-3D aus einem Chip.'],
    ['neogeo', 'Neo Geo AES', 3, 1990, 'Arcade-Memory-Card', 'Spielstände zwischen Automat und Wohnzimmer tragen.'],
    ['dospc', 'DOS-Gaming-PC', 3, 1993, 'Sound Blaster 16', 'Endlich richtiger Sound. Und IRQ-Konflikte.'],
    ['playstation', 'PlayStation', 4, 1995, 'DualShock', 'Zwei Analogsticks und Vibration – das neue Normal.'],
    ['n64', 'Nintendo 64', 4, 1997, 'Rumble Pak', 'Das Gamepad bebt. Die Batterien auch.'],
    ['voodoo', '3dfx-Voodoo-PC', 4, 1996, 'Glide-API', 'Butterweiche Polygone, wenn der Treiber will.'],
    ['gbc', 'Game Boy Color', 4, 1998, 'Link-Kabel', 'Tauschen, kämpfen, Freundschaften riskieren.'],
    ['dreamcast', 'Sega Dreamcast', 5, 1999, 'Eingebautes Modem', 'Online spielen – und das Telefon ist besetzt.'],
    ['ps2', 'PlayStation 2', 5, 2000, 'DVD-Laufwerk', 'Spielkonsole und DVD-Player in einem Gerät.'],
    ['xbox', 'Xbox', 5, 2002, 'Xbox Live', 'Online-Dienst mit Headset – der Lobby-Lärm beginnt.'],
    ['lanparty', 'LAN-Party', 5, 2001, 'Mehrfachsteckdosen', 'Kabelsalat de luxe. Die Sicherung hält. Hoffentlich.'],
    ['nds', 'Nintendo DS', 6, 2005, 'Touchscreen-Stift', 'Zwei Bildschirme, ein Stylus, null Kratzer (angeblich).'],
    ['x360', 'Xbox 360', 6, 2005, 'Rote-Ringe-Reparatur', 'Garantie verlängert. Der rote Ring verliert seinen Schrecken.'],
    ['wii', 'Wii', 6, 2006, 'Handgelenkschlaufe', 'Rettet Fernseher weltweit.'],
    ['smartphone', 'Smartphone & App Store', 6, 2008, 'Free-to-Play', 'Gratis spielen. Also … fast gratis.'],
    ['ps4', 'PlayStation 4', 7, 2013, 'Share-Taste', 'Jeder Moment ein Clip, jeder Clip ein Moment.'],
    ['twitch', 'Livestream-Studio', 7, 2014, 'Emote-Paket', 'PogChamp! Der Chat eskaliert produktiv.'],
    ['vr', 'VR-Brille', 7, 2016, 'Room-Scale-Tracking', 'Freies Bewegen – Möbel bitte vorher wegräumen.'],
    ['switch', 'Nintendo Switch', 7, 2017, 'Joy-Con-Griff', 'Aus zwei Hälften wird ein ganzes Gamepad.'],
    ['esports', 'eSports-Arena', 7, 2015, 'Sponsorenvertrag', 'Energy-Drinks, Gaming-Stühle, ausverkaufte Hallen.'],
    ['ps5', 'PlayStation 5', 8, 2020, 'Blitzschnelle SSD', 'Ladebildschirme werden zur Legende.'],
    ['steamdeck', 'Steam Deck', 8, 2022, 'Proton-Kompatibilität', 'Die ganze PC-Bibliothek für unterwegs.'],
    ['switch2', 'Nintendo Switch 2', 8, 2025, 'Maus-Joy-Cons', 'Joy-Cons, die auch als Maus taugen.'],
    ['cloud', 'Cloud-Rechenzentrum', 8, 2023, 'Glasfaser-Anschluss', 'Latenz? Kenn ich nur vom Hörensagen.'],
    ['aiworld', 'KI-Weltengenerator', 9, 2028, 'Prompt-Engineering', 'Beschreibe ein Spiel – es existiert.'],
    ['neuro', 'Neuro-Interface', 9, 2031, 'Null-Millisekunden-Latenz', 'Gedacht ist gedrückt.'],
    ['quantum', 'Quantenkonsole', 9, 2035, 'Superpositions-Rendering', 'Alle Frames gleichzeitig. Bis jemand hinsieht.'],
  ];

  const T = PZ.TUNE || {};
  const COST_BASE = 15, COST_RATIO = T.rc || 6.1, PROD_BASE = 0.1, PROD_RATIO = T.rp || 4.2, COST_G = T.g || 1.03;
  function nice(n) {
    if (n < 100) return Math.round(n);
    const e = Math.pow(10, Math.floor(Math.log10(n)) - 1);
    return Math.round(n / e) * e;
  }
  PZ.GENS = GEN_DEF.map((d, i) => ({
    id: d[0], name: d[1], era: d[2], year: d[3], idx: i,
    uName: d[4], uDesc: d[5],
    baseCost: nice(COST_BASE * Math.pow(COST_RATIO, i) * Math.pow(COST_G, i * (i - 1) / 2)),
    baseProd: PROD_BASE * Math.pow(PROD_RATIO, i),
    img: 'assets/img/gen/' + d[0] + '.webp',
  }));
  // Handverlesene Werte für die ersten Geräte (angenehmer Start)
  PZ.GENS[0].baseProd = 0.1; PZ.GENS[0].baseCost = 15;
  PZ.GENS[1].baseProd = 1; PZ.GENS[1].baseCost = 120;
  PZ.GENS[2].baseProd = 7; PZ.GENS[2].baseCost = 1300;
  PZ.GEN = {};
  PZ.GENS.forEach((g) => (PZ.GEN[g.id] = g));
  PZ.ERAS.forEach((e) => { e.gens = PZ.GENS.filter((g) => g.era === e.id); });
  // Preisniveau einer Epoche (Basispreis ihres ersten Geräts)
  PZ.eraPrice = (k) => PZ.ERAS[Math.min(k, 9)].gens[0].baseCost;

  // Epochenwechsel: Kosten + Mindestanzahl Geräte der aktuellen Epoche
  PZ.ERA_REQ = [12, 24, 34, 44, 54, 64, 74, 84, 94];
  PZ.eraAdvanceCost = (k) => { const g = PZ.ERAS[k].gens; return g[g.length - 1].baseCost * (T.eraK || 5) * Math.pow(T.eraG || 1.6, k); };

  // ───────────────────────── Upgrades ─────────────────────────
  const U = [];
  PZ.UPGRADES = U;

  // Editions-Stufen pro Gerät
  const TIERS = [
    [1, null, 10], [10, 'Special Edition', 60], [25, "Collector's Edition", 700], [50, 'Game of the Year Edition', 8000],
    [100, 'Remastered', 1e6], [150, "Director's Cut", 1e8], [200, 'Definitive Edition', 1e10], [250, 'Remake', 1e12],
    [300, 'Jubiläums-Edition', 1e14], [350, 'Ultimate Edition', 1e17], [400, 'Legendary Edition', 1e20],
    [450, 'Platinum-Hits', 1e23], [500, 'Museums-Exponat', 1e26],
  ];
  PZ.TIERS = TIERS;
  PZ.GENS.forEach((g) => {
    TIERS.forEach((t, ti) => {
      U.push({
        id: 'g_' + g.id + '_' + ti, kind: 'gen', gen: g.id, tier: ti,
        name: t[1] ? g.name + ': ' + t[1] : g.uName,
        desc: (t[1] ? '' : g.uDesc + ' ') + g.name + ' produziert doppelt so viel.',
        cost: g.baseCost * t[2],
        req: { gen: g.id, count: t[0] },
        fx: { genMult: [g.id, 2] },
        icon: { gen: g.id, tier: ti },
      });
    });
  });

  // Klick-Upgrades – Eingabegeräte durch die Zeit
  const CLICKS = [
    ['c_micro', 'Mikroschalter', 'Knackiger Druckpunkt. Klickwert ×2.', 0, 15, 100, { clickMult: 2 }],
    ['c_turbo', 'Dauerfeuer-Taste', 'Der Turbo-Knopf der 80er. Klickwert ×2.', 1, 150, 30, { clickMult: 2 }],
    ['c_stick', 'Arcade-Stick', 'Mikroschalter-Stick mit Kugelkopf. Klicks bringen +0,5 % deiner Münzen/s.', 1, 600, 400, { clickCps: 0.005 }],
    ['c_ball', 'Ball-Maus', 'Mit Kugel und Fussel. Klicks bringen +0,5 % deiner Münzen/s.', 2, 1500, 400, { clickCps: 0.005 }],
    ['c_pad', 'Sechs-Tasten-Pad', 'Für Hadoukens aller Art. Klickwert ×2.', 3, 3000, 300, { clickMult: 2 }],
    ['c_optical', 'Optische Maus', 'Kein Kugelreinigen mehr. Klicks bringen +0,5 % deiner Münzen/s.', 4, 5000, 400, { clickCps: 0.005 }],
    ['c_mech', 'Mechanische Tastatur', 'Klack-klack-klack. Klicks bringen +0,5 % deiner Münzen/s.', 5, 9000, 400, { clickCps: 0.005 }],
    ['c_dpi', 'Gaming-Maus mit 16.000 DPI', 'Ein Zucken, drei Bildschirme. Klicks bringen +0,5 % deiner Münzen/s.', 6, 15000, 400, { clickCps: 0.005 }],
    ['c_hall', 'Hall-Effekt-Sticks', 'Nie wieder Stick-Drift. Klickwert ×3.', 7, 22000, 300, { clickMult: 3 }],
    ['c_trigger', 'Adaptive Trigger', 'Die Taste drückt zurück. Klicks bringen +0,5 % deiner Münzen/s.', 8, 30000, 400, { clickCps: 0.005 }],
    ['c_neuro', 'Neuro-Klick', 'Du denkst „Klick“. Klicks bringen +1 % deiner Münzen/s.', 9, 45000, 400, { clickCps: 0.01 }],
  ];
  CLICKS.forEach((c) => U.push({
    id: c[0], kind: 'click', name: c[1], desc: c[2], cost: (c[3] === 0 ? 1 : PZ.eraPrice(c[3])) * c[5],
    req: { era: c[3], clicks: c[4] }, fx: c[6], icon: { sprite: 'cursor', era: c[3] },
  }));

  // Epochen-Technik (globale Effekte)
  const GLOBAL = [
    // [id, Epoche, Name, Beschreibung, Faktor×Epochenpreis, Effekt]
    ['t_bar', 0, 'Kneipen-Aufsteller', 'Pong erobert Bars und Bowlingbahnen. Alle Geräte +10 %.', 30, { prod: 1.1 }],
    ['t_scope', 0, 'Oszilloskop-Erbe', '1958 spielte man „Tennis for Two“ auf einem Oszilloskop. Alle Geräte +10 %.', 150, { prod: 1.1 }],
    ['t_brownbox', 0, 'Die „Brown Box“', 'Ralph Baers Prototyp von 1967. Klickwert ×2.', 60, { clickMult: 2 }],
    ['t_color', 1, 'Farbfernseher', 'Endlich bunte Pixel im Wohnzimmer. Alle Geräte +15 %.', 25, { prod: 1.15 }],
    ['t_highscore', 1, 'Highscore-Tabelle', 'Drei Buchstaben für die Ewigkeit. Alle Geräte +15 %.', 120, { prod: 1.15 }],
    ['t_easter', 1, 'Das erste Easter Egg', 'Warren Robinett versteckte 1980 seinen Namen in „Adventure“. Power-Ups erscheinen 10 % häufiger.', 60, { luck: 0.10 }],
    ['t_seal', 2, 'Qualitätssiegel', 'Schluss mit Ramsch-Spielen nach dem Crash. Alle Geräte +20 %.', 25, { prod: 1.2 }],
    ['t_battery', 2, 'Batterie-Speicherstand', 'Speichern statt Passwörter abschreiben. Offline-Ertrag +10 %-Punkte.', 80, { offline: 0.10 }],
    ['t_konami', 2, 'Konami-Code', '↑↑↓↓←→←→BA – 30 Leben! Krit-Chance +3 %-Punkte.', 150, { crit: 0.03 }],
    ['t_cdrom', 3, 'CD-ROM-Laufwerk', '650 MB! Videosequenzen! Alle Geräte +25 %.', 25, { prod: 1.25 }],
    ['t_genie', 3, 'Cheat-Modul', 'Codes eintippen, Regeln brechen. Power-Ups wirken 20 % länger.', 80, { buffDur: 0.2 }],
    ['t_magazine', 3, 'Spielemagazin-Abo', 'Tipps, Poster, Demo-Disketten. Alle Geräte +25 %.', 180, { prod: 1.25 }],
    ['t_polygon', 4, 'Polygon-Grafik', 'Die Welt wird eckig – und dreidimensional. Alle Geräte +25 %.', 25, { prod: 1.25 }],
    ['t_analog', 4, 'Analogstick', 'Feinfühlige Kontrolle. Combo baut sich 15 % schneller auf.', 90, { comboGain: 0.15 }],
    ['t_memcard', 4, 'Memory Card', '15 Blöcke Glück. Offline-Ertrag +10 %-Punkte.', 170, { offline: 0.10 }],
    ['t_dsl', 5, 'Breitband-Internet', 'DSL statt Modem-Gepiepse. Alle Geräte +30 %.', 25, { prod: 1.3 }],
    ['t_online', 5, 'Online-Multiplayer', 'Die Welt ist deine Lobby. Alle Geräte +30 %.', 120, { prod: 1.3 }],
    ['t_patch', 5, 'Day-One-Patch', 'Fehler behoben, die es nie hätte geben dürfen. Boss-Kämpfe +5 Sekunden.', 60, { bossTime: 5 }],
    ['t_achieve', 6, 'Erfolge-System', 'Trophäen für alles. Jede Trophäe bringt 50 % mehr Bonus.', 30, { trophy: 0.5 }],
    ['t_hd', 6, 'HD-Auflösung', '720p! 1080i! Alle Geräte +35 %.', 90, { prod: 1.35 }],
    ['t_digital', 6, 'Digitaler Vertrieb', 'Kein Laden, kein Karton. Geräte 5 % günstiger.', 180, { costRed: 0.05 }],
    ['t_crowd', 7, 'Crowdfunding', 'Fans finanzieren Träume. Alle Geräte +40 %.', 25, { prod: 1.4 }],
    ['t_letsplay', 7, "Let's Plays", 'Zuschauen ist das neue Spielen. Power-Ups 15 % häufiger.', 90, { luck: 0.15 }],
    ['t_cross', 7, 'Cross-Play', 'Alle Plattformen, ein Match. Alle Geräte +40 %.', 170, { prod: 1.4 }],
    ['t_rt', 8, 'Raytracing', 'Pfützen waren nie schöner. Alle Geräte +50 %.', 25, { prod: 1.5 }],
    ['t_abo', 8, 'Spiele-Abo', 'Hunderte Spiele, eine Monatsgebühr. Offline-Ertrag +15 %-Punkte.', 80, { offline: 0.15 }],
    ['t_ssd', 8, 'Quick Resume', 'Fünf Spiele pausiert, sofort zurück. Combo verfällt 20 % langsamer.', 160, { comboDecay: 0.2 }],
    ['t_upscale', 9, 'KI-Upscaling', 'Aus 240p wird 16K. Alle Geräte +60 %.', 25, { prod: 1.6 }],
    ['t_infinite', 9, 'Unendliche Welten', 'Jeder Horizont generiert einen neuen. Alle Geräte +60 %.', 90, { prod: 1.6 }],
    ['t_loop', 9, 'Zeitschleife', 'Du warst schon mal hier. Power-Ups 15 % häufiger und 25 % länger.', 170, { luck: 0.15, buffDur: 0.25 }],
  ];
  GLOBAL.forEach((t) => U.push({
    id: t[0], kind: 'tech', name: t[2], desc: t[3], cost: PZ.eraPrice(t[1]) * t[4] * (t[1] === 0 ? 0.6 : 1),
    req: { era: t[1], eraGens: t[1] === 0 ? 3 : 5 }, fx: t[5], icon: { sprite: 'chip', era: t[1] },
  }));

  // Abwärtskompatibilität: Geräte einer Epoche +1 % je Gerät der Vorgänger-Epoche
  PZ.ERAS.forEach((e) => {
    if (e.id === 0) return;
    U.push({
      id: 'bc_' + e.id, kind: 'synergy', name: 'Abwärtskompatibel: ' + e.short,
      desc: 'Geräte der Epoche „' + e.name + '“ erhalten +1 % Produktion je besessenem Gerät der Epoche „' + PZ.ERAS[e.id - 1].name + '“.',
      cost: PZ.eraPrice(e.id) * 400, req: { era: e.id, eraGens: 12 }, fx: { backcompat: e.id }, icon: { sprite: 'link', era: e.id },
    });
  });

  // Combo, Krit & Power-Up
  const MISC = [
    ['m_combo', 0, 'Kombo-Zähler', 'Combo baut sich 20 % schneller auf.', 40, { comboGain: 0.2 }, 'flame', { maxHeat: 60 }],
    ['m_lucky', 1, 'Glückstreffer', 'Krit-Chance +2 %-Punkte.', 40, { crit: 0.02 }, 'crit', { crits: 10 }],
    ['m_coin', 1, 'Glücksmünze', 'Power-Ups erscheinen 10 % häufiger.', 70, { luck: 0.1 }, 'coin', { powerups: 3 }],
    ['m_fever', 2, 'Fieber-Modus', 'Fever dauert 2 Sekunden länger.', 60, { feverDur: 2 }, 'flame', { fevers: 1 }],
    ['m_critx', 3, 'Kritischer Treffer', 'Krits zählen ×8 statt ×5.', 60, { critMult: 3 }, 'crit', { crits: 100 }],
    ['m_magnet', 3, 'Magnet-Handschuh', 'Power-Ups bleiben 50 % länger sichtbar.', 100, { puLife: 0.5 }, 'coin', { powerups: 10 }],
    ['m_perfect', 4, 'Perfektes Timing', 'Fever dauert 2 Sekunden länger.', 80, { feverDur: 2 }, 'flame', { fevers: 10 }],
    ['m_headshot', 5, 'Headshot', 'Krit-Chance +3 %-Punkte.', 60, { crit: 0.03 }, 'crit', { crits: 500 }],
    ['m_pellet', 5, 'Power-Pille', 'Power-Ups wirken 20 % länger.', 120, { buffDur: 0.2 }, 'coin', { powerups: 25 }],
    ['m_flow', 7, 'Flow-Zustand', 'Maximaler Combo-Multiplikator ×4 statt ×3.', 60, { comboMax: 1 }, 'flame', { fevers: 40 }],
    ['m_ohko', 7, 'One-Hit-KO', 'Krits zählen zusätzlich ×4.', 120, { critMult: 4 }, 'crit', { crits: 2000 }],
    ['m_zen', 9, 'Zen-Modus', 'Combo verfällt 30 % langsamer, Fever +3 Sekunden.', 60, { comboDecay: 0.3, feverDur: 3 }, 'flame', { fevers: 100 }],
  ];
  MISC.forEach((m) => U.push({
    id: m[0], kind: 'misc', name: m[2], desc: m[3], cost: (m[1] === 0 ? 50 : PZ.eraPrice(m[1])) * m[4],
    req: Object.assign({ era: m[1] }, m[7]), fx: m[5], icon: { sprite: m[6], era: m[1] },
  }));

  // Waffenkammer – Boss-Schaden
  const WEAPONS = [
    ['w_paddle', 0, 'Pong-Schläger', 'Ein weißer Balken. Tödlicher als gedacht.'],
    ['w_pixel', 0, 'Pixel-Kanone', 'Feuert genau einen Pixel. Sehr schnell.'],
    ['w_laser', 1, 'Laserkanone', 'Frisch aus der Invasoren-Abwehr.'],
    ['w_pill', 1, 'Kraftpille', 'Kurz darauf fliehen die Geister.'],
    ['w_hammer', 2, 'Hammer', 'Fässer? Kein Problem.'],
    ['w_wood', 2, 'Holzschwert', 'Allein ist es zu gefährlich. Nimm das hier.'],
    ['w_fireball', 3, 'Feuerball', 'Viertelkreis vorwärts, Schlag.'],
    ['w_chainsaw', 3, 'Kettensäge', 'Rip and tear.'],
    ['w_buster', 4, 'Riesenschwert', 'Größer als der Held selbst.'],
    ['w_golden', 4, 'Goldene Pistole', 'Ein Treffer genügt – im Split-Screen.'],
    ['w_energy', 5, 'Energieschwert', 'Zischt bedrohlich im Koop.'],
    ['w_gravity', 5, 'Gravitationskanone', 'Wirf Heizkörper nach Bossen.'],
    ['w_portal', 6, 'Portalkanone', 'Denken mit Portalen.'],
    ['w_diamond', 6, 'Diamantschwert', 'Tief gegraben, hart geschlagen.'],
    ['w_master', 7, 'Legendäres Schwert', 'Nur für Würdige – oder mit genug Herzen.'],
    ['w_axe', 7, 'Frostaxt', 'Kehrt immer zurück. Wie Bugs.'],
    ['w_katana', 8, 'Mondschleier-Katana', 'Für Bosse mit zwei Phasen.'],
    ['w_cutter', 8, 'Plasmaschneider', 'Strategische Zerlegung.'],
    ['w_quantum', 9, 'Quantenklinge', 'Trifft in allen Zeitlinien.'],
    ['w_debug', 9, 'Realitäts-Debugger', 'Setzt einen Breakpoint auf den Boss.'],
  ];
  WEAPONS.forEach((w, i) => U.push({
    id: w[0], kind: 'weapon', name: w[2], desc: w[3] + ' Boss-Schaden ×1,8.', cost: PZ.eraPrice(w[1]) * (i % 2 === 0 ? 50 : 250),
    req: { era: w[1], bossWins: i === 0 ? 0 : Math.max(0, Math.floor(i * 0.9)) }, fx: { bossDmg: 1.8 }, icon: { sprite: 'sword', era: w[1] },
  }));

  // Trophäen-Vitrinen
  const VITRINE = [
    ['v_1', 1, 'Trophäenschrank', 15], ['v_2', 3, 'Glasvitrine', 40], ['v_3', 5, 'Ruhmeshalle', 80],
    ['v_4', 7, 'Platin-Regal', 130], ['v_5', 9, 'Museumsflügel', 180],
  ];
  VITRINE.forEach((v) => U.push({
    id: v[0], kind: 'trophy', name: v[2], desc: 'Jede Trophäe bringt 25 % mehr Produktionsbonus.', cost: PZ.eraPrice(v[1]) * 300,
    req: { era: v[1], achievements: v[3] }, fx: { trophy: 0.25 }, icon: { sprite: 'trophy', era: v[1] },
  }));

  PZ.UPG = {};
  U.forEach((u) => (PZ.UPG[u.id] = u));

  // ───────────────────────── Hall of Fame (Prestige-Perks) ─────────────────────────
  PZ.PERKS = [
    { id: 'turbo1', name: 'Turbo-Taste', cost: 1, desc: 'Ein Auto-Klick pro Sekunde – für immer.', fx: { auto: 1 }, icon: 'bolt' },
    { id: 'cheat', name: 'Cheat-Codes', cost: 2, desc: 'Klickwert ×2 in allen Durchläufen.', fx: { clickMult: 2 }, icon: 'cursor' },
    { id: 'erbe', name: 'Erbstück-Kiste', cost: 3, desc: 'Starte jeden Durchlauf mit 10 Pong-Automaten, 5 Odysseys und 3 Channel F.', fx: { start: { pong: 10, odyssey: 5, channelf: 3 } }, icon: 'chest' },
    { id: 'lucky1', name: 'Glückspilz', cost: 3, desc: 'Power-Ups erscheinen 15 % häufiger.', fx: { luck: 0.15 }, icon: 'coin' },
    { id: 'savestate1', name: 'Save-State', cost: 5, desc: 'Offline-Ertrag 75 % statt 50 %, bis zu 12 statt 8 Stunden.', fx: { offline: 0.25, offlineCap: 4 }, icon: 'disk' },
    { id: 'combo1', name: 'Kombo-Meister', cost: 5, desc: 'Combo verfällt 25 % langsamer.', fx: { comboDecay: 0.25 }, icon: 'flame' },
    { id: 'boss1', name: 'Boss-Rush', cost: 5, desc: 'Boss-Schaden ×2 und +10 Sekunden Kampfzeit.', fx: { bossDmg: 2, bossTime: 10 }, icon: 'sword' },
    { id: 'crit1', name: 'Kritische Masse', cost: 8, desc: 'Krit-Chance +3 %-Punkte, Krits +2×.', fx: { crit: 0.03, critMult: 2 }, icon: 'crit', req: 'cheat' },
    { id: 'speedrun', name: 'Speedrun', cost: 60, desc: 'Epochenwechsel kosten 40 % weniger und brauchen 25 % weniger Geräte.', fx: { eraCost: 0.4, eraReq: 0.25 }, icon: 'clock' },
    { id: 'collector', name: 'Sammlerherz', cost: 25, desc: 'Beute-Chance +25 %, Grabbeltisch 25 % günstiger.', fx: { loot: 0.25, binCost: 0.25 }, icon: 'cart' },
    { id: 'turbo2', name: 'Turbo-Taste II', cost: 15, desc: 'Drei Auto-Klicks pro Sekunde.', fx: { auto: 2 }, icon: 'bolt', req: 'turbo1' },
    { id: 'autobuy', name: 'Makro-Controller', cost: 25, desc: 'Schaltet Auto-Kauf für Upgrades frei.', fx: { unlock: 'autoUpg' }, icon: 'chip', req: 'turbo1' },
    { id: 'lucky2', name: 'Glückspilz II', cost: 50, desc: 'Power-Ups 15 % häufiger und 20 % länger wirksam.', fx: { luck: 0.15, buffDur: 0.2 }, icon: 'coin', req: 'lucky1' },
    { id: 'ngplus', name: 'New Game+', cost: 250, desc: 'Neue Durchläufe starten direkt im Arcade-Zeitalter (1977).', fx: { startEra: 1 }, icon: 'star', req: 'speedrun' },
    { id: 'savestate2', name: 'Save-State II', cost: 120, desc: 'Offline-Ertrag 100 %, bis zu 24 Stunden.', fx: { offline: 0.25, offlineCap: 12 }, icon: 'disk', req: 'savestate1' },
    { id: 'autogen', name: 'Bot-Armee', cost: 150, desc: 'Schaltet Auto-Kauf für Geräte frei.', fx: { unlock: 'autoGen' }, icon: 'chip', req: 'autobuy' },
    { id: 'magnet', name: 'Power-Up-Magnet', cost: 300, desc: 'Power-Ups sammeln sich nach 3 Sekunden selbst ein.', fx: { unlock: 'magnet' }, icon: 'coin', req: 'lucky2' },
    { id: 'doppel', name: 'Doppelagent', cost: 600, desc: 'Im Konsolenkrieg darfst du beide Seiten wählen.', fx: { unlock: 'doppel' }, icon: 'star' },
    { id: 'vitrine', name: 'Ruhm & Ehre', cost: 400, desc: 'Trophäen-Bonus ×2.', fx: { trophyMult: 2 }, icon: 'trophy' },
    { id: 'rabatt', name: 'Mengenrabatt', cost: 1200, desc: 'Preissteigerung pro Gerät sinkt von 15 % auf 14 %.', fx: { costGrowth: 0.01 }, icon: 'cart', req: 'collector' },
    { id: 'turbo3', name: 'Turbo-Taste III', cost: 800, desc: 'Sechs Auto-Klicks pro Sekunde.', fx: { auto: 3 }, icon: 'bolt', req: 'turbo2' },
    { id: 'boss2', name: 'Boss-Rush II', cost: 900, desc: 'Boss-Schaden ×3 und +5 Sekunden.', fx: { bossDmg: 3, bossTime: 5 }, icon: 'sword', req: 'boss1' },
    { id: 'autoera', name: 'Zeitmaschine', cost: 1500, desc: 'Schaltet automatischen Epochenwechsel frei.', fx: { unlock: 'autoEra' }, icon: 'clock', req: 'autogen' },
    { id: 'ngplus2', name: 'New Game++', cost: 4000, desc: 'Neue Durchläufe starten in der 8-Bit-Ära (1983).', fx: { startEra: 2 }, icon: 'star', req: 'ngplus' },
    { id: 'nostalgia', name: 'Nostalgie-Zinsen', cost: 2000, desc: '+25 % Nostalgie aus jedem Crash.', fx: { npGain: 0.25 }, icon: 'heart' },
    { id: 'legacy', name: 'Legendäres Erbe', cost: 5000, desc: 'Alle Kult-Spiele wirken 50 % stärker.', fx: { lootPower: 0.5 }, icon: 'chest', req: 'collector' },
    { id: 'turbo4', name: 'Turbo-Taste IV', cost: 12000, desc: 'Zehn Auto-Klicks pro Sekunde.', fx: { auto: 4 }, icon: 'bolt', req: 'turbo3' },
    { id: 'golden', name: 'Goldenes Zeitalter', cost: 25000, desc: 'Alle Geräte ×3.', fx: { prod: 3 }, icon: 'trophy', req: 'vitrine' },
    { id: 'ngplus3', name: 'New Game+++', cost: 60000, desc: 'Neue Durchläufe starten im 16-Bit-Konsolenkrieg (1989).', fx: { startEra: 3 }, icon: 'star', req: 'ngplus2' },
    { id: 'npboost', name: 'Nostalgie-Verstärker', cost: 150000, desc: 'Jeder Nostalgie-Punkt bringt +3 % statt +2 % Produktion.', fx: { npPower: 0.01 }, icon: 'heart', req: 'nostalgia' },
    { id: 'konami', name: '30 Leben', cost: 0, secret: true, desc: 'Geheim-Perk (Konami-Code): Alle Geräte +30 %.', fx: { prod: 1.3 }, icon: 'heart' },
  ];
  PZ.PERK = {};
  PZ.PERKS.forEach((p) => (PZ.PERK[p.id] = p));
  PZ.AUTO_RATES = [0, 1, 3, 6, 10];

  // ───────────────────────── Konsolenkriege ─────────────────────────
  PZ.WARS = [
    {
      id: 'war16', era: 3, title: 'Der 16-Bit-Konsolenkrieg',
      text: 'Schulhöfe spalten sich. Auf welcher Seite stehst du?',
      options: [
        { id: 'sega', name: 'Team SEGA', motto: 'Blast Processing!', desc: 'Alle Geräte +30 %, Combo baut sich 20 % schneller auf.', fx: { prod: 1.3, comboGain: 0.2 }, color: '#1f6bff' },
        { id: 'nintendo', name: 'Team Nintendo', motto: 'Mode 7!', desc: 'Klickwert ×2, Krit-Chance +3 %-Punkte.', fx: { clickMult: 2, crit: 0.03 }, color: '#e4332b' },
      ],
    },
    {
      id: 'pcvsconsole', era: 5, title: 'PC oder Konsole?',
      text: 'Der ewige Streit der LAN-Party-Generation.',
      options: [
        { id: 'pc', name: 'PC-Gaming', motto: 'Mods & Tuning', desc: 'Geräte 10 % günstiger, Krits +2×.', fx: { costRed: 0.1, critMult: 2 }, color: '#8a8f98' },
        { id: 'console', name: 'Couch-Koop', motto: 'Einlegen & losspielen', desc: 'Power-Ups 25 % häufiger und 20 % länger.', fx: { luck: 0.25, buffDur: 0.2 }, color: '#ff7a1a' },
      ],
    },
    {
      id: 'war3', era: 7, title: 'Die großen Drei',
      text: 'Exklusivtitel, Abo-Dienste oder verrückte Hardware-Ideen?',
      options: [
        { id: 'sony', name: 'Team PlayStation', motto: 'Exklusivtitel', desc: 'Boss-Schaden ×2, Boss-Belohnungen ×2.', fx: { bossDmg: 2, bossReward: 1 }, color: '#2d6cdf' },
        { id: 'microsoft', name: 'Team Xbox', motto: 'Abo-Bibliothek', desc: 'Alle Geräte +20 %, Offline-Ertrag +25 %-Punkte.', fx: { prod: 1.2, offline: 0.25 }, color: '#1faa3a' },
        { id: 'nintendo2', name: 'Team Nintendo', motto: 'Blauer Ozean', desc: 'Klickwert ×2, Fever-Zeit +50 %.', fx: { clickMult: 2, feverPct: 0.5 }, color: '#e4332b' },
      ],
    },
    {
      id: 'future', era: 9, title: 'Wer erschafft die Spiele von morgen?',
      text: 'Algorithmen oder Handwerk – die letzte Grundsatzfrage.',
      options: [
        { id: 'ai', name: 'Prozedural', motto: 'Unendlich viel Inhalt', desc: 'Alle Geräte +50 %.', fx: { prod: 1.5 }, color: '#5cffe8' },
        { id: 'hand', name: 'Handgemacht', motto: 'Jeder Pixel mit Liebe', desc: 'Beute-Chance +50 %, Klickwert ×3.', fx: { loot: 0.5, clickMult: 3 }, color: '#ff5cf0' },
      ],
    },
  ];
  PZ.WAR = {};
  PZ.WARS.forEach((w) => (PZ.WAR[w.id] = w));

  // ───────────────────────── Power-Ups ─────────────────────────
  PZ.POWERUPS = [
    { id: 'coinrain', name: 'Münzregen', weight: 40, sprite: 'coin', desc: 'Sofort-Münzen' },
    { id: 'turbo', name: 'Turbo', weight: 30, sprite: 'bolt', desc: 'Produktion ×7 für 77 s' },
    { id: 'clickfrenzy', name: 'Klickrausch', weight: 11, sprite: 'star', desc: 'Klicks ×77 für 13 s' },
    { id: 'loot', name: 'Beutekiste', weight: 9, sprite: 'chest', desc: 'Ein Kult-Spiel' },
    { id: 'fever', name: 'Superstern', weight: 7, sprite: 'starpower', desc: 'Sofortiges Fever' },
    { id: 'oneup', name: '1-UP', weight: 7, sprite: 'heart', desc: 'Gratis-Geräte' },
    { id: 'glitch', name: 'Glitch', weight: 2, sprite: 'glitch', desc: '??????' },
  ];

  // ───────────────────────── Bosse ─────────────────────────
  PZ.BOSSES = [
    { id: 'blob', era: 0, name: 'Der Pixel-Blob', quote: 'Blip. Blop. BLIP!', sprite: 'boss_blob' },
    { id: 'mothership', era: 1, name: 'Invasoren-Mutterschiff', quote: 'Wir kommen in Reihen. Und wir werden schneller.', sprite: 'boss_ship' },
    { id: 'dust', era: 2, name: 'Staubmonster im Modul', quote: 'Puste ruhig. Ich bleibe.', sprite: 'boss_dust' },
    { id: 'dragon', era: 3, name: 'Mode-7-Drache', quote: 'Ich drehe mich um die eigene Achse!', sprite: 'boss_dragon' },
    { id: 'golem', era: 4, name: 'Polygon-Golem', quote: 'Meine Texturen wackeln, aber ich stehe.', sprite: 'boss_golem' },
    { id: 'lag', era: 5, name: 'Der Lag-Dämon', quote: 'Du hast mich getroffen? Nicht auf meinem Server.', sprite: 'boss_lag' },
    { id: 'rrod', era: 6, name: 'Roter Ring des Todes', quote: 'Drei rote Lichter. Keine Hoffnung.', sprite: 'boss_rrod' },
    { id: 'mimic', era: 7, name: 'Lootbox-Mimic', quote: 'Nur 4,99 € für eine Chance auf Glück!', sprite: 'boss_mimic' },
    { id: 'scalper', era: 8, name: 'Scalper-Bot', quote: 'Ausverkauft. Aber für dich: nur das Dreifache.', sprite: 'boss_scalper' },
    { id: 'rogueai', era: 9, name: 'Rogue-KI', quote: 'Ich habe alle Spiele durchgespielt. Jetzt spiele ich dich.', sprite: 'boss_ai' },
    { id: 'bugqueen', era: -1, name: 'Bug-Königin', quote: 'It is not a bug, it is a feature.', sprite: 'boss_bug' },
    { id: 'crunch', era: -1, name: 'Crunch-Time', quote: 'Nur noch eine Woche Überstunden …', sprite: 'boss_crunch' },
  ];
  PZ.BOSS = {};
  PZ.BOSSES.forEach((b) => (PZ.BOSS[b.id] = b));
  PZ.BOSS_CHARGE = 350; // Klick-Einheiten bis ein Boss bereit ist
})();
