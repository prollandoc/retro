# MetroRetro to Confluence (via Spreadsheets)

## Overview

This script will download your sticky notes from MetroRetro, convert them to a table, and, with a small trick using Google Spreadsheets, make them renderable into Confluence.

## Installation

```bash
git clone https://github.com/prollandoc/retro.git && cd retro
npm install
```

Copy your MetroRetro credentials into `config.json`

## Use

```bash
npm start YOUR_METRORETRO_BOARD_REFERENCE
```

_The MetroRetro board reference is available in the MetroRetro board url._

The script will open a page in your browser. From this point on:
- Hit a key, you'll be redirected to Google Spreadsheets
- Hit CMD+V and then CMD+C
- Open Confluence, create a new table and put the cursor in the first cell
- Hit CMD+V
