# MetroRetro to Confluence (via Spreadsheets)

## Overview

This script will download your sticky notes from MetroRetro, convert them to a table and make them renderable into Confluence.

## Installation

```bash
git clone https://github.com/prollandoc/retro.git && cd retro
npm install
```

## Use

Copy your MetroRetro credentials into `config.json`

```bash
npm start YOUR_METRORETRO_BOARD_REFERENCE
```

_OR_

```bash
npm start YOUR_METRORETRO_BOARD_REFERENCE YOUR_METRORETRO_USERNAME YOUR_METRORETRO_PASSWORD 
```

_The MetroRetro board reference is available in the MetroRetro board url._

The script will open a page in your browser. From this point on:
- Click the Copy button
- Open Confluence and paste
