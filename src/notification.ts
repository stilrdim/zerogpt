import electron from "electron";
const { app, BrowserWindow, screen } = electron;
import { getPercentage, __dirname, imgToBase64Url } from "./utils.js";
import path from "path";
import { pathToFileURL } from "url";

const [, , title, message, autoCloseArg] = process.argv;
const autoClose = autoCloseArg === "true";

const percentage = getPercentage(message);

const COLORS = {
  DARK_GREEN: "rgba(32,65,32,0.8)",
  DARK_RED: "rgba(109, 15, 15, 0.8)",
  DEFAULT: "rgba(30,30,30,0.9)",
};

function createNotification() {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  const winWidth = 200;
  const winHeight = 100;

  const x = width - winWidth - 20;
  const y = height - winHeight - 20;

  const win = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x,
    y,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    skipTaskbar: true,
    focusable: false,
    resizable: false,
  });

  // Convert local image path to file URL
  const imageUrl = imgToBase64Url("/../result.png");

  win.loadURL(
    "data:text/html;charset=utf-8," +
      encodeURIComponent(`
    <style>
      ::-webkit-scrollbar { display: none; }
      body {
        overflow: hidden;
        margin: 0;
        width: 100vw;
        height: 100vh;
        ${
          autoClose
            ? `background-color: ${COLORS.DEFAULT};`
            : `background: url('${imageUrl}') no-repeat center center / cover;`
        }
        color: white;
        font-family: sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      h4 {
        font-weight: bold;
      }
    </style>
    <body onclick="window.close()">
      <div>
        ${autoClose ? `<h4>${title}</h4>` : ""}
        ${autoClose ? `<p>${message}</p>` : ""}
      </div>
      <script>
        document.body.addEventListener('click', () => window.close());
      </script>
    </body>
  `)
  );

  if (autoClose) {
    setTimeout(() => {
      if (!win.isDestroyed()) win.close();
      app.quit();
    }, 2500);
  }
}

app.whenReady().then(createNotification);
