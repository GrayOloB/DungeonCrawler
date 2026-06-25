# Rabbit Run: Tales of the Warren - Starter Project

This is your starting point. Clone or copy this whole folder, open it in VS Code,
and run `index.html` with **Live Server**.

You should see a "Starter project ready!" message on a blue canvas. That means
everything is wired up and you're ready to start building.

## What's already here (you do NOT type these)

These are data, art, and plumbing - there's nothing to learn by typing them, so
they're provided for you:

- `assets/` - all the art (sprite sheets, tile sheets), sound, and the level
  data (`map_meadow.json`). Credit: "Little Dreamyland" by Starmixu & Utaskuas.
- `index.html` - the web page that holds the `<canvas>` and loads your code.
- `js/tilesets.js` - a small lookup table (how many columns each tile sheet has).
- `js/assets.js` - loads all the images and sounds before the game starts.
- `js/audio.js` - a small helper for playing sound effects and music.
- `editor/` - the standalone Map Editor (Week 4) for building your own levels.

## What YOU build (the fun part)

These files are **stubs** right now - just a comment at the top. You'll write
each one during the code-along, following the slides and the Coding Companion
for that week:

| File | When you build it |
|---|---|
| `js/config.js` | Week 1 |
| `js/input.js` | Week 1 |
| `js/tilemap.js` | Week 1 |
| `js/camera.js` | Week 1 |
| `js/game.js` | Week 1 (grows every week) |
| `js/sprite.js` | Week 2 |
| `js/player.js` | Week 2 (grows in Week 4) |
| `js/npc.js` | Week 3 |
| `js/dialogue.js` | Week 3 |
| `js/item.js` | Week 3 |
| `js/quest.js` | Week 3 |
| `js/ui.js` | Week 3 (grows in Week 4) |
| `js/enemy.js` | Week 4 |
| `js/battle.js` | Week 4 |

## Running it

1. Open this folder in VS Code (File - Open Folder).
2. Right-click `index.html` - "Open with Live Server".
3. Your browser opens at an `http://...` address. Edit a file, save, refresh.
4. Press **F12** for the console - that's where errors and your `console.log`
   messages appear.

Build `config.js` first (most files use it), then follow the build order on the
slides: `config -> input -> tilesets (given) -> tilemap -> camera -> player -> game`.

If you fall behind, the complete version of any file is in that week's
`weekN-checkpoint/js/` folder - copy it in and keep going.
