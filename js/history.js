/* PIXELZEIT – Historische Texte: Geräte-Infos, Epochen-Intros, News-Ticker, Scherz-Schlagzeilen */
window.PZ = window.PZ || {};
PZ.HISTORY = {
  // ───────────────────────── Geräte ─────────────────────────
  gens: {
    // ── Epoche 0: Die Pioniere ──
    pong: {
      tagline: "Zwei Striche, ein Punkt, eine Revolution.",
      desc: "Ataris Pong von 1972 war der erste kommerziell erfolgreiche Videospielautomat. Tischtennis auf dem Bildschirm machte aus Kneipen Spielhallen und aus Atari eine Legende.",
      facts: [
        "Der Prototyp stand in Andy Capp's Tavern in Sunnyvale – und fiel bald aus. Der Grund: Der Münzbehälter war so voll, dass nichts mehr hineinpasste.",
        "Allan Alcorn baute Pong eigentlich als Übungsaufgabe, die ihm Atari-Gründer Nolan Bushnell gestellt hatte. Das Ergebnis war zu gut, um es nicht zu verkaufen.",
        "Pong kam ganz ohne Mikroprozessor aus: Das Spiel bestand komplett aus fest verdrahteter Logik-Elektronik."
      ]
    },
    odyssey: {
      tagline: "Die erste Heimkonsole – Folie inklusive.",
      desc: "Die Magnavox Odyssey von 1972 war die erste kommerzielle Heimvideospielkonsole. Sie ging auf Ralph Baers „Brown Box“ zurück und brachte Videospiele erstmals ins Wohnzimmer.",
      facts: [
        "Erfinder Ralph Baer wurde 1922 im pfälzischen Pirmasens geboren und floh 1938 mit seiner Familie vor den Nazis in die USA.",
        "Die Odyssey konnte keine Farben darstellen. Mitgelieferte Plastikfolien, die man auf den Fernseher klebte, sorgten für Spielfeld und Atmosphäre.",
        "Einen Ton gab es nicht und Punkte zählten die Spieler selbst – dafür lagen Würfel, Spielgeld und Punktezettel bei."
      ]
    },
    channelf: {
      tagline: "Die Mutter aller Steckmodule.",
      desc: "Das Fairchild Channel F von 1976 war eine der ersten Konsolen mit Mikroprozessor und austauschbaren ROM-Modulen. Aus einem Gerät mit festen Spielen wurde eine Plattform.",
      facts: [
        "Die Entwicklung leitete Jerry Lawson, einer der wenigen afroamerikanischen Ingenieure der frühen Spielebranche. Er gilt als Vater des Spielmoduls.",
        "Der Controller war ein Knauf, den man drücken, ziehen, kippen und drehen konnte – ergonomisch gewöhnungsbedürftig.",
        "In Deutschland wurde das Gerät unter anderem als „Saba Videoplay“ verkauft."
      ]
    },

    // ── Epoche 1: Goldenes Arcade-Zeitalter ──
    atari2600: {
      tagline: "Holzfurnier und Pixelträume.",
      desc: "Das Atari VCS, später 2600 genannt, machte 1977 Konsolen mit Wechselmodulen massentauglich. Mit Hits wie Space Invaders und Pitfall! wurde es zur ersten großen Heimkonsole.",
      facts: [
        "Die Space-Invaders-Umsetzung von 1980 war die erste offizielle Lizenz eines Arcade-Hits für zu Hause und ließ die Verkaufszahlen der Konsole nach oben schnellen.",
        "In „Adventure“ versteckte Warren Robinett seinen Namen in einem geheimen Raum – eines der ersten bekannten Easter Eggs.",
        "2014 wurden in Alamogordo, New Mexico, tatsächlich vergrabene E.T.-Module ausgegraben. Die Legende von der Atari-Deponie stimmte."
      ]
    },
    invaders: {
      tagline: "Sie kommen! Und zwar immer schneller!",
      desc: "Tomohiro Nishikado entwickelte Space Invaders 1978 für Taito. Der Automat machte Highscores populär und löste einen weltweiten Arcade-Boom aus.",
      facts: [
        "Dass die Aliens immer schneller werden, war ursprünglich nicht geplant: Die Hardware lief einfach flotter, je weniger Gegner übrig waren.",
        "Hartnäckig hält sich die Legende, Space Invaders habe in Japan eine Knappheit an 100-Yen-Münzen ausgelöst. Belegt ist das allerdings nicht.",
        "Nishikado entwarf eigens neue Hardware, weil damalige Technik für seine Ideen nicht leistungsfähig genug war."
      ]
    },
    gamewatch: {
      tagline: "Ein Spiel, ein Display, ein Wecker.",
      desc: "Gunpei Yokois Game & Watch von 1980 vereinte LCD-Spiel und Uhr im Taschenformat. Die Serie legte den Grundstein für Nintendos Handheld-Imperium.",
      facts: [
        "Die Idee kam Yokoi angeblich, als er im Shinkansen einen gelangweilten Geschäftsmann sah, der mit seinem Taschenrechner herumspielte.",
        "Das Steuerkreuz feierte 1982 in der Game-&-Watch-Version von Donkey Kong Premiere. Jahre später bekam Nintendo dafür sogar einen Technik-Emmy.",
        "Einige Modelle hatten zwei Bildschirme zum Aufklappen – eine Idee, die mit dem Nintendo DS zurückkehrte."
      ]
    },
    c64: {
      tagline: "Brotkasten mit 64 KB Weltherrschaft.",
      desc: "Der Commodore 64 von 1982 gilt als meistverkaufter Heimcomputer aller Zeiten. Gerade in Deutschland prägte er eine ganze Generation von Spielern, Programmierern und Demo-Szenern.",
      facts: [
        "Die Schätzungen zu den Verkaufszahlen schwanken stark – meist genannt werden zwischen 12,5 und 17 Millionen Geräten.",
        "Der Soundchip SID ist bis heute Kult. Deutsche Komponisten wie Chris Hülsbeck wurden mit C64-Musik bekannt.",
        "The Great Giana Sisters (1987, Rainbow Arts) erinnerte stark an Super Mario Bros. und verschwand bald aus den Läden – angeblich auf Druck von Nintendo."
      ]
    },

    // ── Epoche 2: Die 8-Bit-Ära ──
    nes: {
      tagline: "Der Retter in der grauen Kiste.",
      desc: "Nintendos Famicom erschien 1983 in Japan, als NES 1985 in den USA und 1986 in Europa. Nach dem Crash brachte es Videospiele zurück – mit Mario, Zelda und strenger Qualitätskontrolle.",
      facts: [
        "In den USA wurde das NES samt Roboter R.O.B. als „Entertainment System“ vermarktet, damit Händler es nach dem Crash nicht als Spielkonsole abstempelten.",
        "Das berühmte Pusten ins Modul half vermutlich kaum – meist wirkte nur das erneute Einstecken. Nintendo riet sogar ausdrücklich davon ab.",
        "1990 gründete Nintendo im bayerischen Großostheim seine Europa-Zentrale. Vorher lief der NES-Vertrieb in Deutschland über externe Partner."
      ]
    },
    mastersystem: {
      tagline: "In Europa größer als in Japan.",
      desc: "Segas Master System trat 1986 gegen das NES an. In Japan und Nordamerika klar unterlegen, wurde es in Europa – und ganz besonders in Brasilien – zum echten Erfolg.",
      facts: [
        "In Brasilien produzierte Segas Partner Tectoy das Master System über Jahrzehnte weiter – eine der langlebigsten Konsolen überhaupt.",
        "Viele Modelle hatten ein Spiel fest eingebaut, etwa Alex Kidd in Miracle World oder später Sonic the Hedgehog.",
        "Das Originalgerät hatte neben dem Modulschacht einen Schlitz für „Sega Cards“ – günstige Spiele im Scheckkartenformat."
      ]
    },
    amiga: {
      tagline: "Workbench tagsüber, Turrican nachts.",
      desc: "Der Amiga 500 von 1987 war mit eigenen Grafik- und Soundchips seiner Zeit voraus. Besonders in Deutschland und Großbritannien wurde er zur Heimat einer riesigen Spiele- und Demoszene.",
      facts: [
        "Turrican (1990) von Manfred Trenz erschien beim deutschen Label Rainbow Arts – die Musik von Chris Hülsbeck ist bis heute legendär.",
        "Die Tracker-Musik mit der Endung .mod geht auf den Ultimate Soundtracker (1987) des Deutschen Karsten Obarski zurück.",
        "Der Absturz-Bildschirm „Guru Meditation“ verdankt seinen Namen einem Spiel der Entwickler, bei dem man auf einem Balance-Brett still sitzen musste."
      ]
    },
    gameboy: {
      tagline: "Grünstich, Tetris, unkaputtbar.",
      desc: "Nintendos Game Boy von 1989 setzte auf robuste Technik, lange Akkulaufzeit und Tetris im Paket. Zusammen mit dem Game Boy Color verkaufte er sich über 118 Millionen Mal.",
      facts: [
        "Ein im Golfkrieg bei einem Bombenangriff angekokelter Game Boy funktionierte weiter – und wurde jahrelang im Nintendo-Store in New York ausgestellt.",
        "Tetris als Beigabe war ein genialer Schachzug: Das Spiel des sowjetischen Programmierers Alexei Paschitnow lockte auch Erwachsene an.",
        "Erfinder Gunpei Yokoi setzte bewusst auf günstige, bewährte Technik statt auf Farbe und Hochglanz – mit Erfolg."
      ]
    },

    // ── Epoche 3: Der 16-Bit-Konsolenkrieg ──
    megadrive: {
      tagline: "Blast Processing mit blauem Igel.",
      desc: "Segas Mega Drive (1988 in Japan, 1990 in Europa) war Nintendos erster großer 16-Bit-Gegner. Mit Sonic und frecher Werbung wurde es vor allem in Europa und den USA zum Hit.",
      facts: [
        "In Nordamerika hieß die Konsole Genesis, weil Sega sich dort die Namensrechte an „Mega Drive“ nicht sichern konnte.",
        "Sonic the Hedgehog (1991) wurde gezielt als Gegenentwurf zu Mario erschaffen: schnell, frech, mit Attitüde.",
        "„Blast Processing“ war vor allem ein Werbeschlagwort – was technisch genau dahintersteckt, wird bis heute diskutiert."
      ]
    },
    snes: {
      tagline: "Mode 7, Schultertasten, Legenden.",
      desc: "Das Super Nintendo erschien 1990 in Japan und 1992 in Europa. Mit Super Mario World, Zelda: A Link to the Past und Donkey Kong Country gilt es als eine der besten Konsolen überhaupt.",
      facts: [
        "Der SNES-Controller machte die Schultertasten L und R populär – ein Standard bis heute.",
        "Ein Super-FX-Chip im Modul ermöglichte Star Fox (1993) echte 3D-Polygone. In Europa hieß das Spiel aus Markenrechtsgründen „Starwing“.",
        "Das Kölner Studio Factor 5 entwickelte fürs SNES unter anderem Super Turrican und zog später in die USA, wo es Star Wars: Rogue Squadron schuf."
      ]
    },
    neogeo: {
      tagline: "Spielhalle im Wohnzimmer. Preis: ja.",
      desc: "SNKs Neo Geo AES von 1990 brachte echte Arcade-Hardware nach Hause – die Spiele entsprachen denen der Spielhalle. Legendär waren die Prügelspiele und die Preise.",
      facts: [
        "Anfangs war die AES in Japan nur zum Verleih gedacht, etwa für Hotels. Erst die Nachfrage machte daraus ein Heimgerät.",
        "Neue Spiele kosteten oft um die 200 US-Dollar oder mehr – pro Modul.",
        "Das Neo Geo wurde erstaunlich lange versorgt: Das letzte offizielle AES-Modul erschien erst 2004."
      ]
    },
    dospc: {
      tagline: "Config.sys tunen, dann Doom spielen.",
      desc: "Anfang der 90er wurde der DOS-PC mit VGA-Grafik und Soundkarte zur Spielemaschine. Doom (1993) machte Ego-Shooter, Netzwerkspiel und Modding populär.",
      facts: [
        "Wer spielen wollte, bastelte an AUTOEXEC.BAT und CONFIG.SYS, um genug vom knappen konventionellen Speicher (640 KB) freizuschaufeln.",
        "Doom verbreitete sich als Shareware mit kostenloser erster Episode. In Deutschland wurde es 1994 indiziert und erst 2011 wieder von der Liste gestrichen.",
        "Die Siedler (1993) von Blue Byte aus Mülheim an der Ruhr startete auf dem Amiga und eroberte danach die PCs."
      ]
    },

    // ── Epoche 4: Die 3D-Revolution ──
    playstation: {
      tagline: "Aus Nintendos Absage wurde ein Imperium.",
      desc: "Sonys PlayStation (1994 in Japan, 1995 in Europa) setzte auf CD-ROM und 3D-Grafik. Sie holte Videospiele aus dem Kinderzimmer und verkaufte sich über 100 Millionen Mal.",
      facts: [
        "Die PlayStation begann als CD-Erweiterung fürs SNES in Kooperation mit Nintendo. Nachdem Nintendo 1991 absprang, machte Sony allein weiter.",
        "Ken Kutaragi, der „Vater der PlayStation“, hatte zuvor den Soundchip des Super Nintendo mitentwickelt.",
        "In Europa zielte Sony auf junge Erwachsene und die Clubszene – Wipeout (1995) mit Elektro-Soundtrack wurde zum Symbol."
      ]
    },
    n64: {
      tagline: "Ein Controller mit drei Griffen.",
      desc: "Das Nintendo 64 (1996, in Europa 1997) machte mit Super Mario 64 frei begehbare 3D-Welten und den Analogstick zum Standard. Mit vier Controllern war es der König der Couch-Abende.",
      facts: [
        "Super Mario 64 setzte Maßstäbe für Kamera und Analogsteuerung in 3D – viele Spiele orientierten sich jahrelang daran.",
        "GoldenEye 007 (1997) von Rare bewies, dass Ego-Shooter auf Konsolen funktionieren – Split-Screen-Streit inklusive.",
        "Nintendo blieb bei Modulen statt CDs: kurze Ladezeiten, aber teure Spiele. Partner wie Square wanderten zur PlayStation ab."
      ]
    },
    voodoo: {
      tagline: "Plötzlich sah alles so weich aus.",
      desc: "Die Voodoo Graphics von 3dfx (1996) war eine reine 3D-Zusatzkarte, die neben der normalen Grafikkarte lief. Mit Spielen wie GLQuake wurde sie zum Augenöffner der PC-Spieler.",
      facts: [
        "Die Karte konnte gar kein 2D: Ein externes VGA-Kabel verband sie mit der eigentlichen Grafikkarte und schaltete bei 3D-Spielen um.",
        "Mit der Voodoo2 ließen sich per SLI zwei Karten koppeln – ein Kürzel, das NVIDIA später wiederverwendete.",
        "Ende 2000 übernahm NVIDIA die wesentlichen Teile des einstigen Marktführers 3dfx."
      ]
    },
    gbc: {
      tagline: "Schnapp sie dir alle – jetzt in Farbe.",
      desc: "Der Game Boy Color (1998) brachte Farbe auf Nintendos Handheld und spielte fast alle alten Game-Boy-Module ab. Er fiel mitten ins Pokémon-Fieber, das Schulhöfe weltweit eroberte.",
      facts: [
        "Pokémon Rot und Blau erschienen in Deutschland erst 1999 – mehr als drei Jahre nach dem japanischen Original.",
        "Ohne Linkkabel und Tauschpartner ließ sich der Pokédex nicht füllen. Mew gab es offiziell sogar nur bei besonderen Events.",
        "Die Anime-Serie lief ab 1999 bei RTL II und machte Pikachu auch in Deutschland zum Superstar."
      ]
    },

    // ── Epoche 5: Online & 128 Bit ──
    dreamcast: {
      tagline: "Zu früh, zu gut, zu wenig Geld.",
      desc: "Segas Dreamcast (1998 in Japan, 1999 in Europa) hatte ab Werk ein Modem an Bord. Trotz Klassikern wie Shenmue, Crazy Taxi und Soulcalibur blieb es Segas letzte Konsole.",
      facts: [
        "Die Speicherkarte VMU hatte ein eigenes kleines Display und konnte unterwegs Minispiele abspielen.",
        "Phantasy Star Online (2000) brachte Online-Rollenspiel auf die Konsole – für viele der erste Kontakt mit Spielern aus aller Welt.",
        "2001 stellte Sega die Produktion ein und wurde zum reinen Spielehersteller – Sonic erschien danach sogar auf Nintendo-Konsolen."
      ]
    },
    ps2: {
      tagline: "160 Millionen können nicht irren.",
      desc: "Die PlayStation 2 (2000) ist mit über 160 Millionen Geräten die meistverkaufte Konsole aller Zeiten. Nebenbei war sie für viele der erste DVD-Player.",
      facts: [
        "Als günstiger DVD-Player verhalf die PS2 dem neuen Medium in vielen Wohnzimmern zum Durchbruch.",
        "GTA: San Andreas (2004) wurde mit rund 17 Millionen verkauften Exemplaren zum größten Hit der Konsole.",
        "Sony produzierte die PS2 fast 13 Jahre lang – erst Ende 2012 lief die Fertigung aus."
      ]
    },
    xbox: {
      tagline: "Ein PC im Konsolenkostüm. Mit Halo.",
      desc: "Microsofts erste Xbox (2001, in Europa 2002) war im Kern ein PC mit Festplatte und Netzwerkanschluss. Halo und Xbox Live machten sie zur Keimzelle einer neuen Konsolenmarke.",
      facts: [
        "Halo wurde ursprünglich für Mac und PC entwickelt – bis Microsoft im Jahr 2000 das Studio Bungie übernahm.",
        "Der erste Controller war so wuchtig, dass Fans ihn „The Duke“ tauften. Der kleinere „Controller S“ folgte bald.",
        "Xbox Live startete 2002 und machte Online-Mehrspieler mit Headset auf Konsolen zum Standard."
      ]
    },
    lanparty: {
      tagline: "Röhrenmonitor schleppen für Headshots.",
      desc: "Von den späten 90ern bis in die 2000er trafen sich Spieler mit PCs, Röhrenmonitoren und Kabelsalat in Kellern, Jugendzentren und Hallen. Counter-Strike und Quake liefen bis zum Morgengrauen.",
      facts: [
        "Counter-Strike entstand 1999 als Fan-Mod für Half-Life. Valve holte die Macher an Bord und machte daraus einen Welterfolg.",
        "Die schwedische DreamHack gilt als eine der größten LAN-Partys der Welt – mit zeitweise über zehntausend mitgebrachten Rechnern.",
        "Quake (1996) brachte echte 3D-Welten und Netzwerkspiel per TCP/IP – und damit eine riesige Clan- und Mod-Szene."
      ]
    },

    // ── Epoche 6: HD & Bewegung ──
    nds: {
      tagline: "Zwei Bildschirme, ein Stift, viel Hirn.",
      desc: "Der Nintendo DS (2004, in Europa 2005) mit Doppelbildschirm und Touchscreen erreichte völlig neue Zielgruppen. Mit rund 154 Millionen Geräten zählt er zu den meistverkauften Konsolen überhaupt.",
      facts: [
        "Dr. Kawashimas Gehirn-Jogging machte den DS ab 2006 auch bei Eltern und Großeltern beliebt.",
        "Mit Nintendogs streichelten Millionen Menschen virtuelle Welpen per Stift – und riefen ihre Namen ins Mikrofon.",
        "Der Codename lautete „Nitro“ – deshalb tragen viele DS-Modellnummern das Kürzel NTR."
      ]
    },
    x360: {
      tagline: "Drei rote Lichter, eine Milliarde.",
      desc: "Die Xbox 360 (2005) prägte mit Xbox Live, Achievements und Gamerscore das Online-Zeitalter der Konsolen. Ihr Hardwareproblem wurde allerdings genauso legendär.",
      facts: [
        "Der „Red Ring of Death“ kostete Microsoft über eine Milliarde US-Dollar für Garantieverlängerungen und Reparaturen.",
        "Mit der Xbox 360 kamen Achievements – seitdem jagen Spieler Gamerscore-Punkte, auch für völlig absurde Aufgaben.",
        "Die Bewegungskamera Kinect (2010) kam laut Guinness-Buch als am schnellsten verkauftes Unterhaltungselektronik-Gerät ihrer Zeit ins Rekordbuch."
      ]
    },
    wii: {
      tagline: "Oma schlägt dich im Bowling.",
      desc: "Nintendos Wii (2006) setzte auf Bewegungssteuerung statt Grafikpower. Wii Sports holte ganze Familien und sogar Seniorenheime vor den Fernseher – über 100 Millionen Konsolen wurden verkauft.",
      facts: [
        "Wii Sports lag in vielen Regionen der Konsole bei und zählt mit über 82 Millionen Exemplaren zu den meistverkauften Spielen aller Zeiten.",
        "Nach ersten Meldungen über fliegende Controller lieferte Nintendo stabilere Handgelenkschlaufen und später Silikonhüllen.",
        "Bis kurz vor der Enthüllung des Namens lautete der Codename der Konsole „Revolution“."
      ]
    },
    smartphone: {
      tagline: "Die Konsole, die jeder dabei hat.",
      desc: "Mit dem iPhone und dem App Store (2008) wurde das Smartphone zur meistgenutzten Spieleplattform der Welt. Angry Birds, Candy Crush und Co. machten Gelegenheitsspieler zur Mehrheit.",
      facts: [
        "Der App Store startete im Juli 2008 mit rund 500 Apps – heute sind es Millionen.",
        "Angry Birds (2009) vom finnischen Studio Rovio wurde zu einem der ersten weltweiten Mobile-Hits.",
        "Pokémon Go (2016) trieb Millionen Menschen auf die Straßen – auch in deutschen Innenstädten und Parks bildeten sich Menschentrauben."
      ]
    },

    // ── Epoche 7: Streaming & Indies ──
    ps4: {
      tagline: "Share-Taste drücken, Welt schaut zu.",
      desc: "Die PlayStation 4 (2013) setzte auf starke Hardware, Spiele im Mittelpunkt und die Share-Taste. Mit über 117 Millionen Geräten ist sie eine der erfolgreichsten Konsolen der Geschichte.",
      facts: [
        "Auf der E3 2013 erklärte Sony in einem kurzen Video, wie man PS4-Spiele verleiht: Man gibt einfach die Disc weiter. Das Publikum jubelte.",
        "Die Share-Taste auf dem DualShock 4 machte Screenshots, Clips und Livestreams zum Alltag.",
        "Mit PlayStation VR (2016) brachte Sony Virtual Reality auf eine Heimkonsole."
      ]
    },
    twitch: {
      tagline: "Zuschauen ist das neue Mitspielen.",
      desc: "2011 ging Twitch aus der Gaming-Sparte von Justin.tv hervor. Livestreams machten das Zuschauen zum eigenen Hobby und Streamer zu neuen Stars.",
      facts: [
        "Amazon kaufte Twitch 2014 für rund 970 Millionen US-Dollar.",
        "Bei „Twitch Plays Pokémon“ (2014) steuerten zehntausende Zuschauer gleichzeitig per Chat ein Game-Boy-Spiel – und spielten es tatsächlich durch.",
        "Speedrun-Marathons wie Games Done Quick sammeln regelmäßig Millionen für wohltätige Zwecke."
      ]
    },
    vr: {
      tagline: "Brille auf, Couchtisch umgerannt.",
      desc: "Nach einer gefeierten Kickstarter-Kampagne erschien die Oculus Rift 2016 für Endkunden. Zusammen mit HTC Vive und PlayStation VR begann die zweite große VR-Welle.",
      facts: [
        "Die Kickstarter-Kampagne von 2012 brachte rund 2,4 Millionen US-Dollar ein – angepeilt waren 250.000.",
        "Facebook übernahm Oculus 2014 für rund zwei Milliarden US-Dollar.",
        "Schon 1995 scheiterte Nintendo mit dem Virtual Boy: rote 3D-Grafik, steife Nacken – und in Europa erschien er gar nicht erst."
      ]
    },
    switch: {
      tagline: "Klick – und der Fernseher wird mobil.",
      desc: "Die Nintendo Switch (2017) ist Heimkonsole und Handheld in einem. Mit Zelda: Breath of the Wild, Mario Kart 8 Deluxe und Animal Crossing wurde sie zu einer der meistverkauften Konsolen aller Zeiten.",
      facts: [
        "Die Spielmodule schmecken absichtlich bitter – damit Kinder sie nicht in den Mund nehmen oder verschlucken.",
        "Animal Crossing: New Horizons (2020) wurde während der Corona-Lockdowns zum weltweiten Treffpunkt auf einsamen Inseln.",
        "Mario Kart 8 Deluxe ist mit über 60 Millionen Exemplaren das meistverkaufte Switch-Spiel."
      ]
    },
    esports: {
      tagline: "Volle Arena, niemand kickt einen Ball.",
      desc: "Aus LAN-Turnieren wurden Großevents mit Stadionatmosphäre und Millionen Zuschauern im Stream. Köln mit der ESL One in der LANXESS arena ist eine der Hauptstädte des Counter-Strike.",
      facts: [
        "Die ESL wurde 2000 in Köln gegründet und ging aus der Deutschen Clanliga hervor – heute ist sie einer der größten eSports-Veranstalter der Welt.",
        "Fans nennen die Counter-Strike-Turniere in der Kölner LANXESS arena liebevoll die „Kathedrale des Counter-Strike“.",
        "Beim Dota-2-Turnier The International lag der Preispool 2021 bei über 40 Millionen US-Dollar – großteils von Fans finanziert."
      ]
    },

    // ── Epoche 8: Next-Gen ──
    ps5: {
      tagline: "Weiß, groß und lange ausverkauft.",
      desc: "Die PlayStation 5 (2020) brachte eine ultraschnelle SSD, Raytracing und den DualSense-Controller mit adaptiven Triggern. Zum Start war sie wegen Chipmangels monatelang kaum zu bekommen.",
      facts: [
        "Der DualSense simuliert mit adaptiven Triggern und feiner Vibration Widerstand, Regen oder das Spannen eines Bogens.",
        "Astro's Playroom war vorinstalliert und steckt voller Anspielungen auf die PlayStation-Geschichte.",
        "Die PS5 startete im November 2020 mitten in der Pandemie – Scalper und Bots machten den Kauf zum Glücksspiel."
      ]
    },
    steamdeck: {
      tagline: "Die ganze Steam-Bibliothek im Rucksack.",
      desc: "Valves Steam Deck (2022) ist ein tragbarer Gaming-PC mit dem Linux-basierten SteamOS. Dank der Kompatibilitätsschicht Proton laufen darauf auch viele Windows-Spiele.",
      facts: [
        "Proton baut auf Wine auf und lässt Windows-Spiele unter Linux laufen – das Steam Deck machte das massentauglich.",
        "Zum Start verkaufte Valve das Gerät über ein Reservierungssystem, um Scalpern das Leben schwer zu machen.",
        "Valve arbeitet mit iFixit zusammen, damit Besitzer Ersatzteile wie Sticks oder Bildschirm selbst tauschen können."
      ]
    },
    switch2: {
      tagline: "Größer, schneller, alte Spiele inklusive.",
      desc: "Die Nintendo Switch 2 erschien am 5. Juni 2025 mit größerem Bildschirm, mehr Leistung und magnetischen Joy-Con 2. Sie ist weitgehend abwärtskompatibel zu Switch-Spielen.",
      facts: [
        "Die Joy-Con 2 lassen sich wie eine Computermaus über den Tisch führen – ein optischer Sensor macht's möglich.",
        "Zum Start erschien Mario Kart World, in dem bis zu 24 Fahrer gleichzeitig um den Sieg kämpfen.",
        "Laut Nintendo verkaufte sich die Switch 2 in den ersten vier Tagen über 3,5 Millionen Mal – Rekord für eine Nintendo-Konsole."
      ]
    },
    cloud: {
      tagline: "Die Konsole wohnt jetzt im Rechenzentrum.",
      desc: "Beim Cloud-Gaming laufen Spiele auf entfernten Servern, zu Hause kommt nur ein Videostream an. Dienste wie GeForce Now und Xbox Cloud Gaming bringen High-End-Spiele auf Handy, TV und Laptop.",
      facts: [
        "Google Stadia startete im November 2019 und wurde im Januar 2023 eingestellt. Google erstattete den Käufern Hardware und Spiele.",
        "Schon 2010 versuchte sich OnLive am Cloud-Gaming – zu früh für die damaligen Internetleitungen.",
        "Zum Abschied bekamen Stadia-Controller ein Bluetooth-Update und leben seitdem als normale Gamepads weiter."
      ]
    },

    // ── Epoche 9: Die Zukunft (fiktiv!) ──
    aiworld: {
      tagline: "Jede Welt einzigartig. Jeder Bug auch.",
      desc: "Um 2028 (Zukunftsspekulation) erzeugen KI-Systeme ganze Spielwelten in Echtzeit – Landschaften, Dialoge und Quests entstehen erst, wenn man hinschaut. Kein Durchgang gleicht dem anderen.",
      facts: [
        "Zukunft, 2028: Ein NPC lehnt erstmals eine Quest ab, weil sie „erzählerisch unmotiviert“ sei. Die Community feiert ihn als Helden.",
        "Zukunft, 2029: Eine KI-Welt errichtet auf eigene Faust ein Museum über die peinlichsten Fehler ihres Spielers. Eintritt: 3 Heiltränke.",
        "Zukunft, 2030: „Handgemacht“ wird zum Premium-Siegel für Level, die noch von echten Menschen gebaut wurden."
      ]
    },
    neuro: {
      tagline: "Einfach dran denken – und springen.",
      desc: "Um 2031 (Zukunftsspekulation) lesen nicht-invasive Neuro-Interfaces Absichten direkt aus dem Gehirn. Gamepads werden zu Sammlerstücken, Reaktionszeiten schrumpfen auf Gedankenschnelle.",
      facts: [
        "Zukunft, 2031: Erste Turniere führen eine „Gedanken-Pause“-Regel ein, nachdem ein Profi mitten im Finale versehentlich ans Hauptmenü dachte.",
        "Zukunft, 2032: Ärzte beschreiben das „Phantom-Controller-Syndrom“ – Betroffene tasten im Alltag nach nicht vorhandenen Schultertasten.",
        "Zukunft, 2033: Retro-Vereine kämpfen dafür, das Pusten in Module als Kulturtechnik zu bewahren."
      ]
    },
    quantum: {
      tagline: "Gewonnen und verloren. Bis du hinschaust.",
      desc: "Um 2035 (Zukunftsspekulation) berechnet die Quantenkonsole alle möglichen Spielverläufe gleichzeitig. Ladebildschirme gehören endgültig der Vergangenheit an – zumindest theoretisch.",
      facts: [
        "Zukunft, 2035: Die erste Quantenkonsole muss auf fast den absoluten Nullpunkt gekühlt werden. Das Wohnzimmer leider auch.",
        "Zukunft, 2036: Speedrunner streiten, ob ein Rekord zählt, der nur in einem Paralleluniversum schneller war.",
        "Zukunft, 2037: Schrödingers Speicherstand – solange man ihn nicht lädt, ist er gleichzeitig vorhanden und beschädigt."
      ]
    }
  },

  // ───────────────────────── Epochen-Intros ─────────────────────────
  eras: {
    0: { intro: "Computer füllen noch ganze Räume – doch ein paar Tüftler wagen das Unerhörte: Spielen auf dem Bildschirm. Mit Pong und der Magnavox Odyssey beginnt eine Industrie, die noch niemand ernst nimmt." },
    1: { intro: "Spielhallen blinken, piepen und schlucken Münzen im Akkord. Space Invaders, Pac-Man und Donkey Kong werden Popkultur, während Atari 2600 und C64 das Spielen ins Kinderzimmer holen." },
    2: { intro: "1983 bricht der US-Videospielmarkt zusammen: zu viele Konsolen, zu viele schlechte Spiele. Dann kommt Nintendo mit dem NES, einem Klempner namens Mario und strenger Qualitätskontrolle – und rettet die Branche." },
    3: { intro: "Sega gegen Nintendo, Sonic gegen Mario, Mega Drive gegen Super Nintendo: Auf Schulhöfen wird erbittert gestritten. Gleichzeitig regieren in deutschen Kinderzimmern Amiga und DOS-PC." },
    4: { intro: "Polygone erobern die Bildschirme. Sony steigt mit der PlayStation ein, Nintendo kontert mit N64 und Analogstick, und auf dem PC sorgen 3D-Karten für offene Münder. Spiele werden erwachsen." },
    5: { intro: "Konsolen gehen ans Netz, die PS2 wird zum Rekordhalter und Microsoft mischt mit der Xbox mit. Auf LAN-Partys fliegen nächtelang Headshots, während Deutschland über „Killerspiele“ streitet." },
    6: { intro: "Bilder werden scharf, Controller lernen Bewegung: Xbox 360 und PS3 bringen HD, die Wii holt Oma und Opa zum Bowling. Und plötzlich steckt die größte Spieleplattform in jeder Hosentasche." },
    7: { intro: "Spielen wird zum Zuschauersport: Twitch-Streams und eSports füllen Arenen. Kleine Indie-Teams landen Welthits, VR-Brillen ziehen ins Wohnzimmer und die Switch verschmilzt Handheld und Heimkonsole." },
    8: { intro: "SSDs verbannen Ladebildschirme, Raytracing lässt Pfützen glänzen. Das Steam Deck macht PC-Spiele mobil, die Switch 2 tritt ein großes Erbe an und Cloud-Gaming verspricht Spiele ganz ohne Konsole." },
    9: { intro: "Ab hier wird es spekulativ: KI baut Welten, Gedanken ersetzen Gamepads und Quantenrechner spielen alle Möglichkeiten gleichzeitig durch. Was davon wahr wird? Sicherheitshalber: speichern nicht vergessen." }
  },

  // ───────────────────────── News-Ticker ─────────────────────────
  news: [
    // ── Epoche 0: Die Pioniere ──
    { era: 0, text: "1958: William Higinbotham zeigt „Tennis for Two“ auf einem Oszilloskop – ein Urahn aller Videospiele." },
    { era: 0, text: "1962: Am MIT entsteht „Spacewar!“ für den Großrechner PDP-1 – Raumschiffduelle für Studenten." },
    { era: 0, text: "1966: Ralph Baer notiert die Idee, auf einem normalen Fernseher zu spielen – die Heimkonsole ist geboren." },
    { era: 0, text: "1971: „Computer Space“ von Nolan Bushnell und Ted Dabney wird der erste kommerzielle Videospielautomat." },
    { era: 0, text: "1972: Bushnell und Dabney gründen Atari – der Name stammt aus dem Brettspiel Go." },
    { era: 0, text: "1972: Die Magnavox Odyssey erscheint in den USA – die erste Heimkonsole der Welt." },
    { era: 0, text: "1972: Pong-Prototyp in Andy Capp's Tavern streikt. Ursache: Münzbehälter randvoll." },
    { era: 0, text: "1973: Pong-Klone überschwemmen den Markt – Dutzende Firmen bauen das Bildschirm-Tischtennis nach." },
    { era: 0, text: "1973: Atari gründet heimlich die „Konkurrenz“ Kee Games, um Exklusivverträge mit Aufstellern zu umgehen." },
    { era: 0, text: "1974: Ataris Gran Trak 10 bringt Autorennen in die Spielhalle – mit echtem Lenkrad und Pedalen." },
    { era: 0, text: "1974: Ein junger Steve Jobs heuert als Techniker bei Atari an." },
    { era: 0, text: "1975: Home Pong erscheint – zunächst exklusiv über die US-Kaufhauskette Sears." },
    { era: 0, text: "1975: „Gun Fight“ von Midway gilt als eines der ersten Automatenspiele mit Mikroprozessor." },
    { era: 0, text: "1975: Auch in Deutschland tauchen erste Telespiele auf – etwa das Video 2000 der Firma Interton." },
    { era: 0, text: "1976: Fairchild bringt das Channel F – mit austauschbaren Spielmodulen." },
    { era: 0, text: "1976: Breakout erscheint – an der Entwicklung waren Steve Wozniak und Steve Jobs beteiligt." },
    { era: 0, text: "1976: Mit dem Coleco Telstar und unzähligen Pong-Geräten rollt der erste Heimkonsolen-Boom." },
    { era: 0, text: "1976: Nolan Bushnell verkauft Atari für rund 28 Millionen US-Dollar an Warner Communications." },

    // ── Epoche 1: Goldenes Arcade-Zeitalter ──
    { era: 1, text: "1977: Nintendo bringt in Japan die Color-TV-Game-Serie heraus – Pong-Varianten für zu Hause." },
    { era: 1, text: "1977: Das Atari VCS kommt auf den Markt – mit Joystick, Paddles und stilechtem Holzfurnier." },
    { era: 1, text: "1978: Space Invaders landet in Japans Spielhallen und löst eine Invasion der Münzschlitze aus." },
    { era: 1, text: "1978: Interton bringt die Modulkonsole VC 4000 in deutsche Wohnzimmer." },
    { era: 1, text: "1979: Asteroids wird zu Ataris meistverkauftem Automaten." },
    { era: 1, text: "1979: Ehemalige Atari-Programmierer gründen Activision – der erste unabhängige Konsolen-Spielehersteller." },
    { era: 1, text: "1980: Pac-Man frisst sich um die Welt – Erfinder Toru Iwatani wollte auch Frauen in die Spielhallen locken." },
    { era: 1, text: "1980: Mattels Intellivision fordert Atari heraus – der erste große Konsolenkrieg beginnt." },
    { era: 1, text: "1980: Nintendos Game & Watch erscheint – ein LCD-Spiel mit Uhr und Weckfunktion." },
    { era: 1, text: "1980: Battlezone zeigt Vektor-Panzer in 3D – das US-Militär lässt sogar eine Trainingsversion bauen." },
    { era: 1, text: "1981: Donkey Kong erscheint – mit Jumpman, der bald Mario heißen wird." },
    { era: 1, text: "1981: Galaga und Frogger halten die Spielhallen in Atem." },
    { era: 1, text: "1982: Pitfall! von Activision schickt Pitfall Harry auf Dschungelsafari." },
    { era: 1, text: "1982: Der ZX Spectrum erobert Großbritannien, der Commodore 64 bald die ganze Welt." },
    { era: 1, text: "1982: Der Film „Tron“ bringt Videospielwelten auf die Kinoleinwand." },
    { era: 1, text: "1982: Das Vectrex bringt gestochen scharfe Vektorgrafik samt eingebautem Bildschirm ins Wohnzimmer." },
    { era: 1, text: "1982: E.T. für das Atari 2600 wird in rund fünf Wochen entwickelt – mit bekannten Folgen." },

    // ── Epoche 2: Die 8-Bit-Ära ──
    { era: 2, text: "1983: Der US-Videospielmarkt bricht ein – zu viele Konsolen, zu viele schlechte Spiele." },
    { era: 2, text: "1983: Nintendo bringt in Japan das Famicom heraus – am selben Tag startet Segas SG-1000." },
    { era: 2, text: "1983: Unverkaufte Atari-Module landen auf einer Deponie in Alamogordo, New Mexico." },
    { era: 2, text: "1983: In Deutschland versorgen Hefte wie TeleMatch die Telespieler mit Tests und Tipps." },
    { era: 2, text: "1984: Alexei Paschitnow programmiert in Moskau Tetris." },
    { era: 2, text: "1985: Andy Warhol malt bei der Vorstellung des Amiga 1000 live ein Porträt am Computer." },
    { era: 2, text: "1985: Super Mario Bros. erscheint – das Jump'n'Run-Genre wird zur Weltmacht." },
    { era: 2, text: "1985: Das NES startet in New York – Roboter R.O.B. dient als Türöffner in die Spielzeugläden." },
    { era: 2, text: "1986: Die Zeitschrift ASM (Aktueller Software Markt) erscheint erstmals am Kiosk." },
    { era: 2, text: "1986: The Legend of Zelda erscheint und lädt zum freien Erkunden ein." },
    { era: 2, text: "1986: Das NES erreicht Europa – in Deutschland regieren aber noch Heimcomputer wie der C64." },
    { era: 2, text: "1987: Der Amiga 500 erscheint und wird in Deutschland zum Spielecomputer schlechthin." },
    { era: 2, text: "1987: Metal Gear erscheint für den MSX2 – Schleichen statt Ballern." },
    { era: 2, text: "1987: Street Fighter kommt in die Spielhallen – der ganz große Durchbruch folgt mit Teil II." },
    { era: 2, text: "1987: The Great Giana Sisters erscheint bei Rainbow Arts – und verschwindet bald wieder aus den Regalen." },
    { era: 2, text: "1988: Die Power Play erscheint als eigenständiges Spielemagazin." },
    { era: 2, text: "1988: Segas Mega Drive startet in Japan – der 16-Bit-Krieg wirft seine Schatten voraus." },
    { era: 2, text: "1988: Super Mario Bros. 3 erscheint in Japan – mit Waschbärschwanz und Weltkarte." },

    // ── Epoche 3: Der 16-Bit-Konsolenkrieg ──
    { era: 3, text: "1989: Der Game Boy erscheint in Japan – im Westen wird Tetris zum Verkaufsschlager im Paket." },
    { era: 3, text: "1989: Populous von Bullfrog begründet das Genre der Göttersimulation." },
    { era: 3, text: "1989: Sega startet das Mega Drive in Nordamerika unter dem Namen Genesis." },
    { era: 3, text: "1990: Turrican von Rainbow Arts erscheint – deutsche Action von Weltrang für C64 und Amiga." },
    { era: 3, text: "1990: Nintendo eröffnet im bayerischen Großostheim seine Europazentrale." },
    { era: 3, text: "1990: Das Mega Drive erscheint in Europa." },
    { era: 3, text: "1990: Das Super Famicom startet in Japan mit Super Mario World." },
    { era: 3, text: "1991: Street Fighter II löst einen weltweiten Prügelspiel-Boom aus." },
    { era: 3, text: "1991: Sonic the Hedgehog rast los – Sega hat endlich ein Maskottchen gegen Mario." },
    { era: 3, text: "1991: Mit „Video Games“ bekommen Konsolenfans in Deutschland ein eigenes Kiosk-Magazin." },
    { era: 3, text: "1991: Tipp-Hotlines der Hersteller retten verzweifelte Kinder vor dem Endgegner – die Telefonrechnung nicht." },
    { era: 3, text: "1992: Das Super Nintendo erscheint in Europa – der 16-Bit-Krieg ist offiziell eröffnet." },
    { era: 3, text: "1992: Mortal Kombat schockt mit digitalisierten Kämpfern und Fatalities." },
    { era: 3, text: "1993: Die Siedler von Blue Byte erscheint für den Amiga – Aufbaustrategie aus dem Ruhrgebiet." },
    { era: 3, text: "1993: Starwing (Star Fox) zeigt echte 3D-Polygone auf dem SNES." },
    { era: 3, text: "1993: Myst macht das CD-ROM-Laufwerk zum Pflichtkauf." },
    { era: 3, text: "1993: Doom erscheint als Shareware – und bringt so manches Uni-Netzwerk ins Schwitzen." },
    { era: 3, text: "1994: Commodore meldet Insolvenz an – der Amiga verliert seine Heimat." },
    { era: 3, text: "1994: Die USK wird gegründet und prüft fortan Spiele auf ihre Jugendeignung." },
    { era: 3, text: "1994: Donkey Kong Country verblüfft mit vorgerenderter 3D-Grafik auf dem SNES." },
    { era: 3, text: "1994: Sega Saturn und Sony PlayStation starten im Abstand weniger Tage in Japan." },

    // ── Epoche 4: Die 3D-Revolution ──
    { era: 4, text: "1995: Escom aus Heppenheim kauft die Reste von Commodore – samt Amiga-Rechten." },
    { era: 4, text: "1995: Nintendos Virtual Boy floppt – rote 3D-Bilder und Nackenschmerzen überzeugen niemanden." },
    { era: 4, text: "1995: Windows 95 erscheint, kurz darauf folgt DirectX – der PC wird spieletauglicher." },
    { era: 4, text: "1995: Die PlayStation erscheint in Europa – Wipeout wird zum Soundtrack der Clubszene." },
    { era: 4, text: "1996: Pokémon Rot und Grün erscheinen in Japan für den Game Boy." },
    { era: 4, text: "1996: Das Nintendo 64 startet in Japan mit Super Mario 64." },
    { era: 4, text: "1996: Quake erscheint und macht Internet-Mehrspieler und Clans populär." },
    { era: 4, text: "1996: Lara Croft debütiert in Tomb Raider – und wird zum Popstar." },
    { era: 4, text: "1996: Die 3dfx Voodoo bringt echte 3D-Beschleunigung auf den PC." },
    { era: 4, text: "1997: Final Fantasy VII erscheint für die PlayStation – Rollenspiele werden Mainstream." },
    { era: 4, text: "1997: Das N64 erscheint in Europa – GoldenEye 007 folgt und sorgt für Split-Screen-Nächte." },
    { era: 4, text: "1997: Ultima Online öffnet seine Tore – eines der ersten großen Online-Rollenspiele." },
    { era: 4, text: "1997: Die GameStar erscheint erstmals und wird zu Deutschlands großem PC-Spielemagazin." },
    { era: 4, text: "1998: Giga startet im Fernsehen – ein Sender-Programm für die Internet- und Spielergeneration." },
    { era: 4, text: "1998: Anno 1602 erscheint und wird zu einem der erfolgreichsten deutschsprachigen PC-Spiele." },
    { era: 4, text: "1998: StarCraft und Half-Life erscheinen – zwei PC-Meilensteine in einem Jahr." },
    { era: 4, text: "1998: Der Game Boy Color bringt Farbe in den Handheld." },
    { era: 4, text: "1998: Zelda: Ocarina of Time setzt neue Maßstäbe für 3D-Abenteuer." },
    { era: 4, text: "1999: Pokémon erreicht Deutschland – Spiele und Anime lösen einen Sammelwahn aus." },
    { era: 4, text: "1999: Counter-Strike erscheint als Mod für Half-Life – LAN-Partys werden nie wieder dieselben sein." },
    { era: 4, text: "1999: Segas Dreamcast erscheint in Europa – mit eingebautem Modem." },
    { era: 4, text: "1999: Am Kiosk buhlen GameStar, PC Games, Bravo Screenfun und Co. ums Taschengeld." },

    // ── Epoche 5: Online & 128 Bit ──
    { era: 5, text: "2000: Die Sims erscheint – und wird zu einem der meistverkauften PC-Spiele." },
    { era: 5, text: "2000: Die PlayStation 2 erscheint in Japan – viele kaufen sie auch als DVD-Player." },
    { era: 5, text: "2000: In Köln wird die ESL gegründet – aus der Deutschen Clanliga." },
    { era: 5, text: "2000: Die PS2 erreicht Europa – zum Start ist sie heiß begehrt und knapp." },
    { era: 5, text: "2001: Sega steigt aus dem Konsolengeschäft aus und stellt die Dreamcast-Produktion ein." },
    { era: 5, text: "2001: Der Game Boy Advance erscheint – Super-Nintendo-Power für die Hosentasche." },
    { era: 5, text: "2001: Gothic von Piranha Bytes erscheint – deutsches Rollenspiel mit Ecken, Kanten und Kultstatus." },
    { era: 5, text: "2001: GTA III macht offene 3D-Städte zum Maß der Dinge." },
    { era: 5, text: "2001: Der Nintendo GameCube erscheint – mit Mini-Discs und Tragegriff." },
    { era: 5, text: "2001: Xbox und Halo starten in Nordamerika." },
    { era: 5, text: "2002: Die Xbox erscheint in Europa, in den USA geht später Xbox Live online." },
    { era: 5, text: "2002: In Leipzig öffnet die erste Games Convention." },
    { era: 5, text: "2002: In Deutschland beginnt eine jahrelange „Killerspiel“-Debatte um Gewalt in Videospielen." },
    { era: 5, text: "2003: Das neue Jugendschutzgesetz macht die USK-Alterskennzeichen verbindlich." },
    { era: 5, text: "2003: Steam startet – anfangs vor allem als ungeliebter Updater für Counter-Strike." },
    { era: 5, text: "2004: Far Cry von Crytek erscheint – das Studio wurde im oberfränkischen Coburg gegründet." },
    { era: 5, text: "2004: SingStar verwandelt Wohnzimmer in Karaoke-Bühnen." },
    { era: 5, text: "2004: GTA: San Andreas erscheint für die PS2." },
    { era: 5, text: "2004: Half-Life 2 erscheint – und macht Steam zur Pflicht." },
    { era: 5, text: "2004: World of Warcraft startet in den USA; Europa folgt Anfang 2005." },
    { era: 5, text: "2004: Der Nintendo DS erscheint in den USA und Japan, Sonys PSP startet in Japan." },

    // ── Epoche 6: HD & Bewegung ──
    { era: 6, text: "2005: Der Nintendo DS erscheint in Europa." },
    { era: 6, text: "2005: Nintendogs lässt Welpen per Touchscreen streicheln – und bellt zurück." },
    { era: 6, text: "2005: Die Xbox 360 startet – das HD-Zeitalter und die Jagd nach Achievements beginnen." },
    { era: 6, text: "2006: Gothic 3 erscheint – riesig, ambitioniert und zum Start voller Bugs." },
    { era: 6, text: "2006: Die PlayStation 3 startet in Japan und den USA mit Blu-ray-Laufwerk; Europa folgt 2007." },
    { era: 6, text: "2006: Die Wii erscheint – Wii Sports macht Bowling zum Familiensport." },
    { era: 6, text: "2007: Das erste iPhone erscheint – Spiele sind noch Nebensache." },
    { era: 6, text: "2007: Portal erscheint in der Orange Box – der Kuchen ist eine Lüge." },
    { era: 6, text: "2007: Crysis von Crytek setzt neue Grafikmaßstäbe – „Can it run Crysis?“ wird zum Meme." },
    { era: 6, text: "2008: Wii Fit bringt ein Balance Board in europäische Wohnzimmer." },
    { era: 6, text: "2008: Der App Store öffnet mit rund 500 Apps – Handyspiele werden Massenmarkt." },
    { era: 6, text: "2008: Die Games Convention in Leipzig zählt über 200.000 Besucher – zum letzten Mal in dieser Form." },
    { era: 6, text: "2009: Erstmals wird der Deutsche Computerspielpreis verliehen." },
    { era: 6, text: "2009: Giga TV wird eingestellt – eine Ära des Spielefernsehens endet." },
    { era: 6, text: "2009: Minecraft erscheint als frühe Testversion – Klötzchen erobern die Welt." },
    { era: 6, text: "2009: Die erste Gamescom öffnet in Köln." },
    { era: 6, text: "2009: Angry Birds startet für das iPhone." },
    { era: 6, text: "2010: Kinect erscheint – Xbox-Spieler werden selbst zum Controller." },
    { era: 6, text: "2011: Der Nintendo 3DS erscheint – 3D ganz ohne Brille." },
    { era: 6, text: "2011: Twitch geht an den Start – ausgegliedert aus Justin.tv." },
    { era: 6, text: "2011: The Elder Scrolls V: Skyrim erscheint am 11.11.11 – Pfeile im Knie inklusive." },
    { era: 6, text: "2012: Kickstarter-Boom: Oculus Rift und zahlreiche Spielprojekte sammeln Millionen von Fans." },
    { era: 6, text: "2012: Die Wii U erscheint – mit Tablet-Controller." },

    // ── Epoche 7: Streaming & Indies ──
    { era: 7, text: "2013: GTA V erscheint und spielt in nur drei Tagen über eine Milliarde US-Dollar ein." },
    { era: 7, text: "2013: PlayStation 4 und Xbox One erscheinen im November – die achte Konsolengeneration beginnt." },
    { era: 7, text: "2014: „Twitch Plays Pokémon“: Zehntausende steuern gemeinsam ein Spiel per Chat." },
    { era: 7, text: "2014: In Alamogordo werden die vergrabenen E.T.-Module tatsächlich ausgegraben." },
    { era: 7, text: "2014: Die ESL One Cologne bringt Counter-Strike in die LANXESS arena." },
    { era: 7, text: "2014: Amazon kauft Twitch für rund 970 Millionen US-Dollar." },
    { era: 7, text: "2014: Microsoft übernimmt Mojang und damit Minecraft für 2,5 Milliarden US-Dollar." },
    { era: 7, text: "2015: The Witcher 3 von CD Projekt Red erscheint – ein Rollenspiel-Meilenstein aus Polen." },
    { era: 7, text: "2015: Das Indie-Rollenspiel Undertale beweist: Man muss niemanden besiegen, um zu gewinnen." },
    { era: 7, text: "2015: Das Finale der League-of-Legends-WM findet in Berlin statt." },
    { era: 7, text: "2016: Oculus Rift und HTC Vive erscheinen – VR zieht ins Wohnzimmer." },
    { era: 7, text: "2016: Pokémon Go schickt Millionen Menschen auf Monsterjagd durch die Innenstädte." },
    { era: 7, text: "2016: PlayStation VR erscheint für die PS4." },
    { era: 7, text: "2017: Die Nintendo Switch erscheint am 3. März – mit Zelda: Breath of the Wild." },
    { era: 7, text: "2017: Fortnite Battle Royale startet und wird zum Phänomen." },
    { era: 7, text: "2018: Das Indie-Spiel Celeste erzählt vom Bergsteigen – und von Angst und Mut." },
    { era: 7, text: "2018: Red Dead Redemption 2 erscheint – mit Pferdepflege im Detail." },
    { era: 7, text: "2019: Beim Fortnite World Cup gewinnt ein 16-Jähriger drei Millionen US-Dollar." },
    { era: 7, text: "2019: Google Stadia startet im November – Spielen ohne Konsole, so das Versprechen." },

    // ── Epoche 8: Next-Gen ──
    { era: 8, text: "2020: Half-Life: Alyx zeigt, was ein echter VR-Blockbuster kann." },
    { era: 8, text: "2020: Animal Crossing: New Horizons wird im Lockdown zur digitalen Zuflucht." },
    { era: 8, text: "2020: Die Gamescom findet erstmals rein digital statt." },
    { era: 8, text: "2020: PS5 und Xbox Series X|S erscheinen im November – und sind sofort vergriffen." },
    { era: 8, text: "2021: Chipmangel: Konsolen, Grafikkarten und Geduld werden knapp." },
    { era: 8, text: "2021: Die Switch OLED erscheint – mit größerem, satterem Bildschirm." },
    { era: 8, text: "2022: Elden Ring erscheint und verkauft sich in wenigen Wochen über zwölf Millionen Mal." },
    { era: 8, text: "2022: Das Steam Deck wird ausgeliefert – der PC passt jetzt in den Rucksack." },
    { era: 8, text: "2023: Google stellt Stadia im Januar ein und erstattet die Käufe." },
    { era: 8, text: "2023: Zelda: Tears of the Kingdom lässt Spieler absurde Fahrzeuge bauen." },
    { era: 8, text: "2023: Baldur's Gate 3 von Larian räumt zahlreiche Spiel-des-Jahres-Preise ab." },
    { era: 8, text: "2023: Microsoft schließt die rund 69 Milliarden US-Dollar schwere Übernahme von Activision Blizzard ab." },
    { era: 8, text: "2023: Das Steam Deck OLED erscheint – mit besserem Display und größerem Akku." },
    { era: 8, text: "2024: Palworld wird zum Überraschungshit – Monster sammeln mit Werkzeuggürtel." },
    { era: 8, text: "2024: Die Gamescom in Köln meldet über 330.000 Besucher." },
    { era: 8, text: "2024: Die PS5 Pro erscheint im November." },
    { era: 8, text: "2025: Rockstar verschiebt GTA VI auf 2026 – Fans trainieren weiter ihre Geduld." },
    { era: 8, text: "2025: Die Nintendo Switch 2 erscheint am 5. Juni – mit Mario Kart World zum Start." },
    { era: 8, text: "2025: Die Switch 2 verkauft sich in vier Tagen über 3,5 Millionen Mal – Nintendo-Rekord." },
    { era: 8, text: "2025: Hollow Knight: Silksong erscheint nach jahrelangem Warten – das Internet atmet auf." },
    { era: 8, text: "2026: Pokémon wird 30 – Rot und Grün erschienen 1996 in Japan." },

    // ── Epoche 9: Die Zukunft (fiktiv) ──
    { era: 9, text: "2027: Erste Konsole ohne Laufwerk, Anschlüsse und Gehäuse erscheint – Kritiker loben das minimalistische Design." },
    { era: 9, text: "2028: KI generiert erstmals ein komplettes Open-World-Spiel – inklusive 40.000 Nebenquests zum Blumensammeln." },
    { era: 9, text: "2028: KI-NPCs gründen eine Gewerkschaft und fordern Pausen zwischen den Dialogzeilen." },
    { era: 9, text: "2029: Erster KI-Speedrunner schlägt Menschen – und beschwert sich über Input-Lag." },
    { era: 9, text: "2029: Patch-Notes kommen jetzt von der KI und sind erstmals ehrlich: „Wir wissen auch nicht, warum es jetzt geht.“" },
    { era: 9, text: "2030: Retro-Welle: Jugendliche entdecken den Ladebildschirm als meditative Kunstform." },
    { era: 9, text: "2030: Museum stellt letzten Röhrenfernseher aus – Besucher staunen über das Gewicht." },
    { era: 9, text: "2031: Erstes Neuro-Interface für Spieler erscheint – Tastenbelegung ab sofort per Gedanke." },
    { era: 9, text: "2031: Erster „Gedanken-Rage-Quit“ dokumentiert – Spieler beschuldigt trotzdem den Router." },
    { era: 9, text: "2032: Studie: Neuro-Controller senken die Reaktionszeit um 80 % – die Zahl der Ausreden bleibt konstant." },
    { era: 9, text: "2032: eSports-Ligen führen Tests gegen verbotene Konzentrations-Mods ein." },
    { era: 9, text: "2033: Die Gamescom öffnet zusätzlich ein virtuelles Köln – der Stau vor den Hallen bleibt trotzdem." },
    { era: 9, text: "2034: Erste Konsole mit Geruchsausgabe – Horror-Fans bereuen es sofort." },
    { era: 9, text: "2035: Die Quantenkonsole erscheint: Ladezeiten sind gleichzeitig null und unendlich." },
    { era: 9, text: "2036: Quanten-Multiplayer: Man gewinnt und verliert, bis jemand auf die Rangliste schaut." },
    { era: 9, text: "2037: Archäologen finden ein NES-Modul von 1985 – es läuft nach dem ersten Pusten." },
    { era: 9, text: "2040: Physiker erkennen „Nur noch eine Runde“ offiziell als stabile Zeitschleife an." },
    { era: 9, text: "2050: Letzter Day-One-Patch der Geschichte behebt alle Bugs – und fügt drei neue hinzu." },
    { era: 9, text: "2099: Die Menschheit speichert ihren Spielstand. Bitte Konsole nicht ausschalten." }
  ],

  // ───────────────────────── Scherz-Schlagzeilen ─────────────────────────
  jokes: [
    "Lokaler Spieler bläst zum 400. Mal in Modul – funktioniert wieder.",
    "Studie: 97 % aller „Nur noch eine Runde“ enden nach Mitternacht.",
    "Mann gibt Konami-Code am Geldautomaten ein – erhält 30 Extraleben, aber kein Geld.",
    "Rage-Quit-Weltrekord: Controller durchbricht erstmals die Schallmauer.",
    "Day-One-Patch größer als das eigentliche Spiel – Studio spricht von „Bonusinhalt“.",
    "Ladebildschirm-Tipp Nr. 47 endlich gelesen: „Du kannst springen.“",
    "Wissenschaftler bestätigen: Lag ist immer die Schuld der anderen.",
    "Achievement freigeschaltet: „Rasen gemäht“ – Mutter zeigt sich beeindruckt.",
    "Speedrunner erledigt Wocheneinkauf in 4:32 dank Clip durch die Ladentür.",
    "Git gud: Neues Motivationsseminar besteht nur aus diesen zwei Wörtern.",
    "Memory Card nach 25 Jahren wiedergefunden – die Quest ist immer noch nicht erledigt.",
    "Umfrage: 8 von 10 Spielern haben das Tutorial weggeklickt und fragen jetzt im Forum.",
    "Rätsel gelöst: Die verschwundene Socke lag die ganze Zeit hinter dem Röhrenmonitor.",
    "Kind kündigt an, „nur kurz zu speichern“ – Eltern warten seit drei Stunden.",
    "NPC sagt denselben Satz zum 10.000. Mal – Ehrenpreis für Konsequenz verliehen.",
    "Spieler kauft 200 Spiele im Sale und spielt weiter nur das eine von 2004.",
    "Ehemaliger Abenteurer mit Pfeil im Knie eröffnet erfolgreichen Wachdienst.",
    "Kabelsalat im Keller entwirrt – Forscher stoßen auf eine LAN-Party von 2003.",
    "Neue Studie: Hinter jedem Wasserlevel steckt ein Entwickler mit Rachegelüsten.",
    "Controller-Batterien leer – exakt im Endkampf, wie Physiker vorhergesagt hatten.",
    "„Ich spiele nur ganz casual“, sagt Mann mit 2.000 Spielstunden.",
    "Server-Wartung am Freitagabend – Community fragt, ob es noch ungünstiger ginge.",
    "Idle-Game über Nacht laufen gelassen: Spieler wacht als Pixel-Milliardär auf.",
    "Escort-Mission: KI-Begleiter läuft erneut gegen die Wand – Experten ratlos.",
    "Prinzessin gerettet – leider schon wieder im falschen Schloss.",
    "Endgegner gesteht: Die zweite Phase war eigentlich nie geplant.",
    "Röhrenfernseher wiegt 40 Kilo – Umzugshelfer fordern Gefahrenzulage.",
    "Spieler entdeckt Gras draußen: Grafik 10/10, Gameplay 3/10, keine Speicherpunkte.",
    "Neuer Rekord: Fünf Stunden im Charakter-Editor, zehn Minuten im eigentlichen Spiel.",
    "„Press Start“ gedrückt – Spieler fühlt sich endlich verstanden.",
    "Spielstand überschrieben: Geschwisterstreit geht in die dritte Woche.",
    "Häufigster Satz auf LAN-Partys bestätigt: „Seht ihr mich im Netzwerk?“",
    "USB-Stecker passt erst beim dritten Versuch – Forscher vermuten eine vierte Dimension.",
    "Kiste zerschlagen, wieder nur drei Münzen – Held reicht Beschwerde ein.",
    "Spiel verlässt nach neun Jahren den Early Access – Fans vermissen die Bugs.",
    "Stealth-Mission gescheitert: Held musste in seiner Pappkiste niesen.",
    "Gaming-Stuhl mit 47 Einstellmöglichkeiten gekauft – Besitzer sitzt weiter schief.",
    "RGB-Beleuchtung steigert Leistung um 30 %, bestätigen 100 % der RGB-Hersteller.",
    "Kuchen im Testlabor gefunden – Forscher bestätigen: Er war eine Lüge.",
    "Streamer vergisst Stummschaltung – Chat kennt jetzt Omas Lasagne-Rezept.",
    "Update 1.0.1 behebt den Fehler, der die Installation von Update 1.0.1 verhinderte.",
    "C64-Ladevorgang abgeschlossen – Spieler inzwischen volljährig.",
    "Wii-Fernbedienung fliegt durchs Wohnzimmer – Fernseher legt offiziell Protest ein.",
    "Ranglistenspiel verloren: Spieler nennt 14 Schuldige, darunter die Sonne.",
    "Lokaler Clan feiert 25. Jubiläum – Tagesordnung: „nur noch eine Runde“.",
    "Unkaputtbar: Game Boy übersteht Waschgang, Sturz vom Hochbett und kleine Geschwister.",
    "Achievement „Alles gesammelt“: 0,01 % der Spieler, 100 % der Rückenschmerzen.",
    "Handbuch aus Papier entdeckt – Jugendliche halten es für ein sehr kurzes Buch.",
    "Mann will „nur kurz“ ein Update installieren – Lagerfeuer draußen inzwischen erloschen.",
    "Wettervorhersage für heute: 100 % Wahrscheinlichkeit für Lag-Spitzen um 20 Uhr."
  ]
};
