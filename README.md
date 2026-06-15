# ZeroGPT CLI App

Simple desktop utility that checks whether copied text is likely AI-generated using `ZeroGPT`.

It runs in the background and listens for global keybinds. When triggered, it reads your clipboard and sends the text for analysis.

---

## What it does

- Reads text from your clipboard
- Sends it to `ZeroGPT` (`UI` or `API` depending on mode)
- Returns an AI probability score
- Shows a small desktop notification with the result
- Logs key presses locally
- Optionally uses `Puppeteer` to scrape results from `ZeroGPT` website

---

## Keybinds

- `F4` - Analyze clipboard text
- `NUMPAD DOT` - Exit application

You can change these in `./src/constants.ts`:

```ts
export const KEY_TO_LOOKUP_TEXT = "F4";
export const KEY_TO_CLOSE_APP = "NUMPAD DOT";
```

> All valid key names are commented out at the **bottom** of the file

---

## Demo Images

![A demo image displaying the app being used including the screenshot it generates as notification](https://i.ibb.co/kVKgRbFn/zerogpt.png)

---

## How it works

The app runs three main parts:

### 1. Global keyboard listener

Uses `node-global-key-listener` to detect key presses anywhere in the system.

### 2. Clipboard reader

On trigger, it reads clipboard content safely using `clipboardy`.

### 3. ZeroGPT analysis

Two modes exist:

- **Puppeteer mode**
  - Opens `ZeroGPT` website
    > Bypasses "Accept Cookies" popup
  - Pastes text into input field
  - Clicks analyze button
  - Scrapes result percentage

- **API mode**
  - Sends `POST` request directly to `ZeroGPT` endpoint
  - Returns `fakePercentage` and `feedback`

---

## Benefits

### 1. One-click analysis from anywhere

Trigger a lookup instantly with a single keypress (`F4` by default) without switching windows or opening a browser tab.

### 2. Fresh results every time

Each **Puppeteer** lookup runs in a completely new browser instance with no cache — so repeated checks on the same text return naturally varied percentages, closer to what an external reviewer would see.

> **Example:** Your local browser might cache a result of `26.58%`, while three fresh lookups on the same text return `25.20%`, `29.81%`, and `21.44%`.

---

## Build & Run

Install dependencies

```bash
npm i
```

Compile and run (`CLI` mode)

```bash
npm run main
```

Run with `Electron` notification UI

```bash
npm run electron
```

---

## Notification system

When a result is found:

- A small `Electron` popup appears
- Shows AI percentage
- Optionally displays screenshot result (`./result.png`)
- Auto closes after a few seconds (configurable)

---

## Notes

- Puppeteer mode may break if ZeroGPT changes their UI
- API mode is faster but may change or get rate-limited
- The app is intended for personal use / experimentation
- Works best when running in background

---

## Package scripts

- `npm run main` - Main script start
- `npm run test` - Compile + run test file

## Start script manually

Use `./run.bat` _(can create Desktop shortcut to it)_ or `node dist/main.js`

---
