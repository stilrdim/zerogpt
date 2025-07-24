import electron from "electron";
const { app, BrowserWindow, screen } = electron;
import { imgToBase64Url } from "./utils.js";
const [, , title, message, autoCloseArg] = process.argv;
const autoClose = autoCloseArg === "true";
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
    const marginForX = 20;
    const marginForY = 60;
    // Start off-screen to the right
    const startX = width;
    const endX = width - winWidth - marginForX;
    const startY = height - winHeight - marginForY;
    let currentX = startX;
    const slideSpeed = 10; // pixels per frame
    const intervalTime = 10; // ms between updates
    const win = new BrowserWindow({
        width: winWidth,
        height: winHeight,
        x: startX,
        y: startY,
        alwaysOnTop: true,
        frame: false,
        transparent: true,
        skipTaskbar: true,
        focusable: false,
        resizable: false,
    });
    // Convert local image path to file URL
    const imageUrl = imgToBase64Url("/../result.png");
    win.loadURL("data:text/html;charset=utf-8," +
        encodeURIComponent(`
    <style>
      ::-webkit-scrollbar { display: none; }
      html, body {
        margin: 0;
        padding: 0;
        background: transparent;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: sans-serif;
        cursor: pointer;
      }

      .pill-container {
        width: 100%;
        height: 100%;
        ${autoClose
            ? `background-color: ${COLORS.DEFAULT}; border-radius: 1.5rem;`
            : `background: url('${imageUrl}') no-repeat center center / cover; border-radius: 0px;`}
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      }

      h4 {
        margin: 0;
        font-size: 16px;
        font-weight: bold;
      }

      p {
        margin: 5px 0 0;
        font-size: 14px;
      }
    </style>

    <body onclick="window.close()">
      <div class="pill-container">
        ${autoClose ? `<h4>${title}</h4><p>${message}</p>` : ""}
      </div>
      <script>
        document.body.addEventListener('click', () => window.close());
      </script>
    </body>
  `));
    // Slide in from the right
    const slideIn = setInterval(() => {
        if (currentX > endX) {
            currentX -= slideSpeed;
            if (currentX < endX)
                currentX = endX;
            win.setPosition(currentX, startY);
        }
        else {
            clearInterval(slideIn);
            // Stay visible for 2.5s, then slide out
            if (autoClose) {
                setTimeout(() => {
                    slideOut();
                }, 1500);
            }
        }
    }, intervalTime);
    // Slide out to the right
    function slideOut() {
        const slideOutInterval = setInterval(() => {
            if (currentX < startX) {
                currentX += slideSpeed;
                if (currentX > startX)
                    currentX = startX;
                win.setPosition(currentX, startY);
            }
            else {
                clearInterval(slideOutInterval);
                if (!win.isDestroyed())
                    win.close();
            }
        }, intervalTime);
    }
}
app.whenReady().then(createNotification);
