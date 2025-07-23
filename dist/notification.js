import electron from "electron";
const { app, BrowserWindow, screen } = electron;
import { getPercentage } from "./utils.js";
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
    const winWidth = 250;
    const winHeight = 100;
    // Position: bottom-right corner with 20px margin
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
    win.loadURL("data:text/html;charset=utf-8," +
        encodeURIComponent(`
      <style>
        ::-webkit-scrollbar { display: none; }
        body {
          overflow: hidden;
          margin: 0;
          background: ${!autoClose // If it's an autoClose window, set color to default
            ? percentage < 20
                ? COLORS.DARK_GREEN
                : COLORS.DARK_RED
            : COLORS.DEFAULT};
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
          <h4>${title}</h4>
          <p>${message}</p>
        </div>
        <script>
          document.body.addEventListener('click', () => {
            window.close();
          });
        </script>
      </body>
    `));
    if (autoClose) {
        setTimeout(() => {
            if (!win.isDestroyed())
                win.close();
            app.quit();
        }, 2500);
    }
}
app.whenReady().then(createNotification);
