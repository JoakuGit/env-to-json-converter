# ENV ↔ JSON Converter

A lightweight React app that converts `.env` files into JSON—and JSON back into ENV—directly in the browser.

## Features

- Paste `.env` content and get live JSON output
- Convert a JSON object into copy-ready ENV entries
- Supports `export` lines
- Parses strings, numbers, and booleans
- Copy JSON or ENV with one click
- Mobile-friendly layout

## How to use

1. Open `index.html` in a browser.
2. Choose the `ENV → JSON` or `JSON → ENV` direction.
3. Paste your content into the input panel.
4. Copy the generated output from the output panel.

## GitHub Pages

If you publish this repo with GitHub Pages, update these placeholders in `index.html`:

- `https://YOUR-USERNAME.github.io/YOUR-REPO/`

Replace it in:

- `og:url`
- JSON-LD `url`

## Notes

- This version uses React and Babel from CDN.
- No build step is required.
- The app runs entirely in the browser.
