# Ayyi SetList Archive

A neon Y2K-style archive of DJ Ayyi's mixes, with an in-page audio player and a live visualizer.

## Features

- Seven curated setlists spanning hard techno, industrial techno, rawstyle, hipdut, IndoBounce, big room and oldskool.
- Play, pause, seek, skip, and volume controls.
- Audio-reactive visualizer and animated setlist artwork.
- Responsive layout with reduced-motion support.
- Mix durations loaded from the audio metadata when available.

## Run locally

Requirements: Node.js and npm.

```sh
npm install
npm run dev
```

Vite prints the local development URL in the terminal. To create and preview a production build:

```sh
npm run build
npm run preview
```

Run the TypeScript check with `npm run lint`.

## Project structure

- `src/App.tsx` — setlist data, audio playback and page UI.
- `src/components/SetlistRow.tsx` — setlist list rows.
- `src/components/Visualizer.tsx` — audio visualizer.
- `src/index.css` — visual styling and responsive rules.
- `public/favicon.svg` — site icon.

The mixes are streamed from their configured Dropbox links, so playback requires an internet connection and those links to remain available. No API key or server-side service is required to run the site.
