# PIXELZEIT

Ein Idle-/Clicker-Spiel durch 50 Jahre Gaming-Geschichte – von Pong (1972) über NES, PlayStation und Wii bis zur (fiktiven) Quantenkonsole. Privates Fan-Projekt.

## Spielen

**Online:** https://dysphode.github.io/pixelzeit/ – funktioniert auf PC und Smartphone. Der Spielstand liegt im Browser; zum Gerätewechsel unter *Optionen → Exportieren/Importieren*. (Die Claude-Artifact-Version synchronisiert zusätzlich über die Cloud.)

**Lokal:**

```bash
python3 -m http.server 8917
```

Dann `http://localhost:8917` öffnen. (Ein Doppelklick auf `index.html` geht auch, dann laufen die Soundeffekte aber über den eingebauten Synthesizer.)

## Features

- 39 historische Geräte in 10 Epochen – echte Fotos (Wikimedia Commons, v. a. Evan-Amos), mit Museum, Anekdoten und Newsticker (≈200 historische Meldungen)
- Klick-Controller, der sich je Epoche ändert (Odyssey-Controller → Atari-Joystick → NES → … → DualSense → VR)
- Combo-System mit FEVER-Modus, kritische Treffer, Auto-Klicks
- Power-Ups (Münzregen, Turbo, Klickrausch, Beutekiste, Superstern, 1-UP, Glitch)
- Bosskämpfe mit 12 Pixel-Art-Bossen (u. a. „Roter Ring des Todes“, „Lootbox-Mimic“, „Scalper-Bot“)
- ~100 Kult-Spiele als Sammelobjekte mit Seltenheiten und Stufen, Grabbeltisch
- Konsolenkriege (SEGA vs. Nintendo, PC vs. Konsole, …) mit unterschiedlichen Boni
- Prestige „Der große Crash“ (1983!) mit Nostalgie-Punkten und Hall of Fame (30 Perks inkl. Automatisierung)
- 229 Trophäen (Bronze bis Platin, inkl. Geheimnisse – Konami-Code, IDDQD …)
- Animierte Hintergründe je Epoche (Pong-Phosphor, Invaders, 8-Bit-Parallax, Mode 7, Low-Poly, …), CRT-Effekt
- Chiptune-Musik & 8-Bit-Soundeffekte (CC0, OpenGameArt)
- Offline-Ertrag, Tagesbonus, Export/Import, Cloud-Sync

## Tastatur

Leertaste = Klick · 1–4 = Kaufmenge · B = Boss · P = Pause

## Struktur

- `index.html`, `css/style.css`
- `js/engine.js` – Spiellogik (DOM-frei, per Node simulierbar)
- `js/data.js`, `js/loot.js`, `js/achievements.js`, `js/history.js` – Inhalte
- `js/ui.js`, `js/main.js`, `js/bg.js`, `js/audio.js`, `js/sprites.js` – Darstellung
- `tools/build.js` – erzeugt `js/credits.js` und `dist/pixelzeit.html` für die Veröffentlichung
- `assets/` – Fotos, Controller, Schriften, Musik, Sounds, Quellennachweise (`assets/credits/`)
