# Íslenskir Fuglar — Icelandic Birds Browser

A local photo-rich taxonomy browser for Icelandic birds.  
88 species across 13 orders, with visitor species marked ✦.

## Quick Start

1. **Unzip** the project folder anywhere on your computer.

2. **Start a local server** (pick one):
   ```bash
   # Option A — Python (built-in on Mac/Linux)
   cd icelandic-birds
   python3 -m http.server 8000

   # Option B — Node.js
   cd icelandic-birds
   npx serve
   ```

3. **Open** `http://localhost:8000` in your browser.

> ⚠️ You need a local server — opening index.html directly via `file://`
> won't work because browsers block loading JSX files from the filesystem.

## Adding Photos

Drop photos into the `photos/` folder. Each species has its own subfolder
named by scientific name with underscores:

```
photos/
  Fratercula_arctica/
    01.jpg
    02.jpg
    colony-wide.jpg
  Sterna_paradisaea/
    portrait.jpg
    flight.jpg
```

File names don't matter — they're sorted alphabetically, and the first
image becomes the thumbnail on the species card.

**Supported formats:** .jpg, .jpeg, .png, .webp

After adding photos, regenerate the manifest:

```bash
node scan-photos.js
```

Then refresh the browser.

## File Structure

```
icelandic-birds/
├── index.html           ← open this (via server)
├── app.jsx              ← the React app
├── photo-manifest.js    ← auto-generated photo index
├── scan-photos.js       ← run after adding/removing photos
├── README.md
└── photos/
    ├── Fratercula_arctica/
    ├── Sterna_paradisaea/
    ├── Uria_aalge/
    └── ... (88 species folders)
```

## Updating the App

When we make UI changes in Claude, just replace `app.jsx` with the new
version. Your photos and folder structure stay untouched.

## Features

- 3-level taxonomy navigation (Order → Family → Species)
- Drag-and-resize photo galleries on species pages
- Mood theme editor (shift-click the header ☀)
- Visitor species marked with ✦
- Icelandic names throughout
- Dynamic card sizing based on family size
