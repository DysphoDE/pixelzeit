/* PIXELZEIT – Kult-Spiele (Sammelobjekte) */
(function () {
  'use strict';
  const PZ = (window.PZ = window.PZ || {});

  PZ.RARITY = {
    c: { id: 'c', name: 'Gewöhnlich', color: '#b8c0cc', weight: 60, mult: 1 },
    r: { id: 'r', name: 'Selten', color: '#3fa7ff', weight: 28, mult: 2.5 },
    e: { id: 'e', name: 'Episch', color: '#b45cff', weight: 10, mult: 6 },
    l: { id: 'l', name: 'Legendär', color: '#ffb31a', weight: 2, mult: 15 },
  };

  // Effekt-Grundwerte (gewöhnlich, Stufe 1)
  PZ.LOOT_FX = {
    all: { base: 0.02, label: (v) => 'Alle Geräte +' + PZ.U.pct(v, 1) },
    click: { base: 0.06, label: (v) => 'Klickwert +' + PZ.U.pct(v, 1) },
    crit: { base: 0.002, label: (v) => 'Krit-Chance +' + PZ.U.pct(v, 1).replace(' %', ' %-Pkt.') },
    boss: { base: 0.08, label: (v) => 'Boss-Schaden +' + PZ.U.pct(v, 1) },
    luck: { base: 0.02, label: (v) => 'Power-Ups +' + PZ.U.pct(v, 1) + ' häufiger' },
    combo: { base: 0.03, label: (v) => 'Combo-Aufbau +' + PZ.U.pct(v, 1) },
    offline: { base: 0.01, label: (v) => 'Offline-Ertrag +' + PZ.U.pct(v, 1).replace(' %', ' %-Pkt.') },
    era: { base: 0.10, label: (v, g) => 'Geräte „' + PZ.ERAS[g.era].short + '“ +' + PZ.U.pct(v, 1) },
    np: { base: 0.01, label: (v) => 'Nostalgie aus Crashs +' + PZ.U.pct(v, 1) },
    loot: { base: 0.03, label: (v) => 'Beute-Chance +' + PZ.U.pct(v, 1) },
  };
  PZ.LOOT_MAX_LEVEL = 10;

  // [id, Titel, Jahr, Epoche, Seltenheit, Effekt, Kurztext, Format?]
  const G = [
    ['pong_g', 'Pong', 1972, 0, 'c', 'all', 'Vermeide es, den Ball zu verpassen, um Highscore zu erzielen.'],
    ['compspace', 'Computer Space', 1971, 0, 'c', 'click', 'Der erste kommerzielle Arcade-Automat – zu kompliziert für Kneipen.'],
    ['tank', 'Tank', 1974, 0, 'c', 'boss', 'Kettenfahrzeuge im Labyrinth. Frühes Duell-Fieber.'],
    ['gunfight', 'Gun Fight', 1975, 0, 'r', 'crit', 'Einer der ersten Automaten mit Mikroprozessor.'],
    ['breakout', 'Breakout', 1976, 0, 'r', 'combo', 'Mauer abtragen, Stein für Stein. Die Legende nennt Wozniak und Jobs.'],
    ['colossal', 'Colossal Cave Adventure', 1976, 0, 'e', 'np', 'Du stehst am Ende einer Straße vor einem kleinen Backsteinhaus.', 'disk'],
    ['invaders_g', 'Space Invaders', 1978, 1, 'r', 'boss', 'Reihe um Reihe kommen sie – und immer schneller.'],
    ['asteroids', 'Asteroids', 1979, 1, 'c', 'crit', 'Vektorgrafik, Trägheit und viel zu viele Felsen.'],
    ['adventure', 'Adventure', 1980, 1, 'e', 'luck', 'Versteckt den wohl berühmtesten Namen der Spielegeschichte.'],
    ['pacman', 'Pac-Man', 1980, 1, 'l', 'luck', 'Inspiriert von einer Pizza mit fehlendem Stück. Waka waka.'],
    ['galaga', 'Galaga', 1981, 1, 'c', 'combo', 'Lass dein Schiff entführen – und hol es doppelt zurück.'],
    ['dk', 'Donkey Kong', 1981, 1, 'e', 'click', 'Ein Zimmermann, ein Affe, viele Fässer.'],
    ['pitfall', 'Pitfall!', 1982, 1, 'c', 'era', 'Lianen, Krokodile, Treibsand – Dschungel auf 4 KB.'],
    ['et', 'E.T. the Extra-Terrestrial', 1982, 1, 'r', 'np', 'In fünf Wochen entwickelt, in der Wüste vergraben, 2014 ausgegraben.'],
    ['tetris', 'Tetris', 1984, 2, 'l', 'combo', 'Ein Moskauer Forscher erfindet das perfekte Spiel.', 'disk'],
    ['duckhunt', 'Duck Hunt', 1984, 2, 'c', 'click', 'Und der Hund lacht dich aus.'],
    ['elite', 'Elite', 1984, 2, 'r', 'np', 'Eine ganze Galaxie in 22 Kilobyte.', 'disk'],
    ['smb', 'Super Mario Bros.', 1985, 2, 'l', 'all', 'Das Jump’n’Run, das eine Industrie rettete.'],
    ['zelda', 'The Legend of Zelda', 1986, 2, 'e', 'boss', 'Goldenes Modul, Batteriespeicher, grenzenlose Neugier.'],
    ['metroid', 'Metroid', 1986, 2, 'r', 'crit', 'Die Überraschung am Ende schrieb Geschichte.'],
    ['castlevania', 'Castlevania', 1986, 2, 'c', 'boss', 'Peitsche schwingen, Treppen steigen, Fledermäuse hassen.'],
    ['giana', 'The Great Giana Sisters', 1987, 2, 'e', 'era', 'Deutsches C64-Kultspiel – mit sehr bekannten Vorbildern.', 'disk'],
    ['maniac', 'Maniac Mansion', 1987, 2, 'r', 'loot', 'Hamster, Mikrowelle – du weißt Bescheid.', 'disk'],
    ['ff1', 'Final Fantasy', 1987, 2, 'c', 'offline', 'Die „letzte Fantasie“, die zur Endlos-Serie wurde.'],
    ['megaman2', 'Mega Man 2', 1988, 2, 'r', 'boss', 'Acht Robot-Master und ein unsterblicher Soundtrack.'],
    ['turrican', 'Turrican', 1990, 3, 'e', 'click', 'Manfred Trenz’ Actionfeuerwerk vom C64 bis Amiga.', 'disk'],
    ['monkey', 'The Secret of Monkey Island', 1990, 3, 'r', 'np', 'Du kämpfst wie ein dummer Bauer!', 'disk'],
    ['lemmings', 'Lemmings', 1991, 3, 'c', 'all', 'Rette sie vor sich selbst. Oh no!', 'disk'],
    ['sonic', 'Sonic the Hedgehog', 1991, 3, 'l', 'click', 'Zu schnell für die Konkurrenz.'],
    ['sf2', 'Street Fighter II', 1991, 3, 'e', 'crit', 'Der Automat, der Spielhallen neu belebte.'],
    ['mk', 'Mortal Kombat', 1992, 3, 'c', 'crit', 'Digitalisierte Kämpfer – und viel Aufregung.'],
    ['mariokart', 'Super Mario Kart', 1992, 3, 'r', 'luck', 'Der blaue Panzer kommt. Immer.'],
    ['siedler', 'Die Siedler', 1993, 3, 'e', 'offline', 'Blue Bytes Wuselspiel aus Mülheim an der Ruhr.', 'disk'],
    ['doom', 'Doom', 1993, 3, 'l', 'boss', 'Shareware, die Büronetzwerke lahmlegte.', 'disk'],
    ['mana', 'Secret of Mana', 1993, 3, 'r', 'era', 'Ringmenü, Koop-Action, Ohrwurm-Musik.'],
    ['warcraft', 'Warcraft', 1994, 3, 'c', 'loot', 'Orcs und Menschen – der Anfang eines Imperiums.', 'disk'],
    ['dkc', 'Donkey Kong Country', 1994, 3, 'r', 'all', 'Vorgerenderte 3D-Grafik auf 16 Bit.'],
    ['crash', 'Crash Bandicoot', 1996, 4, 'c', 'click', 'Kisten zerschlagen mit Wumpa-Früchten.', 'cd'],
    ['tombraider', 'Tomb Raider', 1996, 4, 'r', 'era', 'Eine Archäologin wird zur Ikone.', 'cd'],
    ['sm64', 'Super Mario 64', 1996, 4, 'l', 'all', 'Wie man sich in 3D bewegt – hier wurde es erfunden.'],
    ['pokemon', 'Pokémon Rot & Blau', 1996, 4, 'e', 'loot', 'Schnapp sie dir alle – 151 Stück.'],
    ['ff7', 'Final Fantasy VII', 1997, 4, 'e', 'np', 'Drei CDs voller Tränen.', 'cd'],
    ['goldeneye', 'GoldenEye 007', 1997, 4, 'r', 'crit', 'Split-Screen-Freundschaftstest.'],
    ['gt', 'Gran Turismo', 1997, 4, 'c', 'combo', 'Der echte Fahrsimulator.', 'cd'],
    ['mgs', 'Metal Gear Solid', 1998, 4, 'c', 'luck', 'Ein Pappkarton ist die beste Tarnung.', 'cd'],
    ['oot', 'Ocarina of Time', 1998, 4, 'l', 'crit', 'Z-Targeting veränderte Kämpfe in 3D für immer.'],
    ['halflife', 'Half-Life', 1998, 4, 'e', 'boss', 'Ein Physiker mit Brechstange.', 'cd'],
    ['starcraft', 'StarCraft', 1998, 4, 'r', 'all', 'In Südkorea fast ein Nationalsport.', 'cd'],
    ['anno', 'Anno 1602', 1998, 4, 'r', 'offline', 'Aufbau-Klassiker aus dem deutschsprachigen Raum.', 'cd'],
    ['cs', 'Counter-Strike', 2000, 5, 'e', 'crit', 'Eine Mod, die zur LAN-Party-Religion wurde.', 'cd'],
    ['sims', 'Die Sims', 2000, 5, 'r', 'offline', 'Wer hat die Leiter aus dem Pool entfernt?', 'cd'],
    ['gothic', 'Gothic', 2001, 5, 'e', 'era', 'Piranha Bytes’ Kolonie: „Ich bin hier der Boss.“', 'cd'],
    ['halo', 'Halo', 2001, 5, 'r', 'boss', 'Der Master Chief und die Couch-LAN.', 'dvd'],
    ['gta3', 'Grand Theft Auto III', 2001, 5, 'r', 'all', 'Die offene Stadt in 3D.', 'dvd'],
    ['ikaruga', 'Ikaruga', 2001, 5, 'c', 'combo', 'Weiß oder Schwarz – Polarität entscheidet.'],
    ['animalx', 'Animal Crossing', 2001, 5, 'c', 'offline', 'Das Dorf lebt, auch wenn du schläfst.'],
    ['wc3', 'Warcraft III', 2002, 5, 'c', 'np', 'Die Mod-Szene erfand hier ein ganzes Genre.', 'cd'],
    ['farcry', 'Far Cry', 2004, 5, 'r', 'click', 'Crytek aus Coburg zeigt der Welt Tropenparadiese.', 'dvd'],
    ['hl2', 'Half-Life 2', 2004, 5, 'e', 'boss', 'Gravitationskanone und Physik-Spielplatz.', 'dvd'],
    ['wow', 'World of Warcraft', 2004, 5, 'l', 'loot', 'Nur noch ein Raid. Seit 2004.', 'dvd'],
    ['guitarhero', 'Guitar Hero', 2005, 6, 'c', 'combo', 'Plastikgitarre, echter Schweiß.', 'dvd'],
    ['wiisports', 'Wii Sports', 2006, 6, 'e', 'click', 'Bowling im Wohnzimmer mit der ganzen Familie.', 'dvd'],
    ['portal', 'Portal', 2007, 6, 'e', 'luck', 'Der Kuchen ist eine Lüge.', 'dvd'],
    ['crysis', 'Crysis', 2007, 6, 'r', 'era', '„But can it run Crysis?“', 'dvd'],
    ['bioshock', 'BioShock', 2007, 6, 'r', 'crit', 'Würdest du bitte weiterlesen?', 'dvd'],
    ['cod4', 'Call of Duty 4', 2007, 6, 'c', 'boss', 'Killstreaks und Prestige-Modus.', 'dvd'],
    ['braid', 'Braid', 2008, 6, 'c', 'combo', 'Zeit zurückspulen als Rätselmechanik.', 'digital'],
    ['minecraft', 'Minecraft', 2011, 6, 'l', 'all', 'Klötzchen bauen – das meistverkaufte Spiel aller Zeiten.', 'digital'],
    ['angrybirds', 'Angry Birds', 2009, 6, 'c', 'click', 'Schleudern auf Schweine – Milliarden Downloads.', 'digital'],
    ['lol', 'League of Legends', 2009, 6, 'c', 'boss', 'Das Moba, das Arenen füllt.', 'digital'],
    ['masseffect2', 'Mass Effect 2', 2010, 6, 'r', 'loot', 'Die Selbstmordmission – wer überlebt?', 'dvd'],
    ['skyrim', 'Skyrim', 2011, 6, 'e', 'np', 'Früher war ich auch ein Abenteurer …', 'dvd'],
    ['darksouls', 'Dark Souls', 2011, 6, 'e', 'boss', 'Du bist gestorben. Wieder.', 'dvd'],
    ['gta5', 'Grand Theft Auto V', 2013, 7, 'e', 'all', 'Drei Protagonisten, eine Milliarde am ersten Wochenende.', 'bd'],
    ['witcher3', 'The Witcher 3', 2015, 7, 'e', 'boss', 'Geralt und die Suche nach Ciri.', 'bd'],
    ['undertale', 'Undertale', 2015, 7, 'r', 'np', 'Das RPG, in dem niemand sterben muss.', 'digital'],
    ['rocketleague', 'Rocket League', 2015, 7, 'c', 'click', 'Fußball mit raketengetriebenen Autos.', 'digital'],
    ['stardew', 'Stardew Valley', 2016, 7, 'r', 'offline', 'Ein Entwickler, vier Jahre, ein Bauernhof.', 'digital'],
    ['pokemongo', 'Pokémon GO', 2016, 7, 'r', 'luck', 'Plötzlich gingen alle spazieren.', 'digital'],
    ['botw', 'Breath of the Wild', 2017, 7, 'l', 'all', 'Siehst du den Berg? Du kannst ihn besteigen.', 'card'],
    ['fortnite', 'Fortnite', 2017, 7, 'e', 'loot', '100 Spieler, ein Sieger, unendlich Tänze.', 'digital'],
    ['hollowknight', 'Hollow Knight', 2017, 7, 'c', 'crit', 'Ein Käferkönigreich voller Geheimnisse.', 'digital'],
    ['celeste', 'Celeste', 2018, 7, 'c', 'combo', 'Ein Berg, eine Erdbeere, tausend Tode.', 'digital'],
    ['amongus', 'Among Us', 2018, 7, 'c', 'luck', 'Das war doch Rot. Sus!', 'digital'],
    ['hades', 'Hades', 2020, 8, 'e', 'luck', 'Götter-Segen in jedem Fluchtversuch.', 'digital'],
    ['acnh', 'Animal Crossing: New Horizons', 2020, 8, 'r', 'offline', 'Die Insel, auf die sich die Welt 2020 rettete.', 'card'],
    ['cp2077', 'Cyberpunk 2077', 2020, 8, 'r', 'era', 'Holpriger Start, starkes Comeback.', 'digital'],
    ['eldenring', 'Elden Ring', 2022, 8, 'l', 'boss', 'Ein Zwischenland voller Bosse – und Tränen.', 'digital'],
    ['vampsurv', 'Vampire Survivors', 2022, 8, 'e', 'combo', 'Ein kleines Indie-Spiel frisst deine Abende.', 'digital'],
    ['bg3', "Baldur's Gate 3", 2023, 8, 'l', 'crit', 'Natürliche 20! Würfelglück als Spielprinzip.', 'digital'],
    ['totk', 'Tears of the Kingdom', 2023, 8, 'r', 'all', 'Baue ein Flugzeug aus Holzbrettern.', 'card'],
    ['balatro', 'Balatro', 2024, 8, 'e', 'np', 'Poker-Roguelike mit absurden Multiplikatoren.', 'digital'],
    ['astrobot', 'Astro Bot', 2024, 8, 'r', 'click', 'Eine Liebeserklärung an 30 Jahre PlayStation.', 'digital'],
    ['helldivers2', 'Helldivers 2', 2024, 8, 'c', 'boss', 'Für die Demokratie! Achtung, Friendly Fire.', 'digital'],
    ['silksong', 'Hollow Knight: Silksong', 2025, 8, 'r', 'combo', 'Endlich erschienen – die Fans hatten es fast aufgegeben.', 'digital'],
    ['holotetris', 'Holo-Tetris', 2028, 9, 'r', 'combo', 'Blöcke fallen jetzt in vier Dimensionen.', 'crystal'],
    ['endlessquest', 'Endlos-Quest', 2029, 9, 'c', 'np', 'Die KI erfindet täglich neue Nebenquests.', 'crystal'],
    ['neurokart', 'Neuro-Kart', 2031, 9, 'e', 'luck', 'Denk an den blauen Panzer – schon ist er da.', 'crystal'],
    ['dreamworld', 'Traumwelt Online', 2033, 9, 'e', 'offline', 'Du spielst im Schlaf. Wörtlich.', 'crystal'],
    ['qchess', 'Quanten-Schach', 2035, 9, 'l', 'all', 'Jeder Zug ist alle Züge zugleich.', 'crystal'],
    ['pixelzeit', 'PIXELZEIT', 2040, 9, 'l', 'np', 'Ein Idle-Spiel über die Geschichte der Spiele. Moment mal …', 'crystal'],
  ];

  const DEFAULT_FMT = ['cart', 'cart', 'cart', 'cart16', 'cart64', 'dvd', 'dvd', 'digital', 'digital', 'crystal'];
  PZ.LOOT = G.map((g) => ({
    id: g[0], name: g[1], year: g[2], era: g[3], rarity: g[4], fx: g[5], blurb: g[6],
    fmt: g[7] || DEFAULT_FMT[g[3]],
  }));
  PZ.LOOT_BY = {};
  PZ.LOOT.forEach((g) => (PZ.LOOT_BY[g.id] = g));

  /** Effektstärke eines Spiels auf Stufe lvl */
  PZ.lootValue = function (g, lvl, power) {
    if (!lvl) return 0;
    const base = PZ.LOOT_FX[g.fx].base * PZ.RARITY[g.rarity].mult;
    return base * (1 + 0.5 * (lvl - 1)) * (1 + (power || 0));
  };
})();
