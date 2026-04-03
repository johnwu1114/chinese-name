# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chinese baby name generator (新生兒取名) — a static client-side web app that suggests Chinese names based on four naming methodologies:
- **周易文字筆劃五行** (Five Elements stroke analysis)
- **十二生肖姓名學** (Chinese Zodiac naming)
- **81數理姓名學** (81 Numerology)
- **五行三才姓名學** (Sancai / Three Talents)

## Running

No build step. Open `index.html` in a browser or serve via any static file server (e.g. `python3 -m http.server`). The app fetches JSON data files from the GitHub Pages URL defined in `index.js` (`$api_url`).

## Architecture

- **index.html** — Single-page UI built with jQuery 2.1.1 (loaded from CDN). Contains all markup and CSS inline.
- **index.js** — All application logic. Key functions:
  - `getCombinations(familyName)` — computes valid stroke-count combinations for a given surname using Sancai and 81 numerology scoring, filtered by `$quality` threshold
  - `renderResult(type, draw)` — displays 81 numerology results for each of the five name positions (天格/人格/地格/外格/總格)
  - `get5EColor(fiveEle)` — maps Five Elements values to colored HTML labels
  - `getWordsOf5E(chars)` — annotates characters with their Five Element classification

### Data Files (JSON)

- **ChineseCharacters.json** — Character dictionary with stroke counts (`draw`), Five Elements classification (`fiveEle`), and character lists (`chars`)
- **Sancai.json** — Three Talents (三才) lookup table keyed by three-element combinations (e.g. "水木木"), with scores and descriptions
- **EightyOne.json** — 81 numerology meanings, each with stroke count (`draw`), score (`value`), assessment (`text`), and description (`content`)
- **{1-12}_{animal}.json** — Per-zodiac character recommendations with `better` (喜用) and `worse` (忌用) character lists keyed by stroke count (e.g. `"_8"`)

### Naming Algorithm

The Five Elements cycle maps digit positions: `$sancaiKey = ["水","木","木","火","火","土","土","金","金","水"]`. The surname's stroke count determines its element, then `getCombinations` iterates possible middle/bottom stroke counts to find Sancai combinations scoring >= 8, further filtered by a composite 81 numerology score across all five positions (天格, 人格, 地格, 外格, 總格) against the `$quality` threshold (default 75).
