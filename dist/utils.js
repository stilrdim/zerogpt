import { fileURLToPath } from "url";
import path from "path";
import { spawn } from "child_process";
import * as electron from "electron";
import fs from "fs";
const electronPath = electron.default || electron;
export const KEY_TO_PRESS = "F4";
export const KEY_TO_CLOSE = "NUMPAD DOT";
export const NEW_SECTION = "\n\n\n\n\n\n\n\n\n\n\n\n";
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const showNotification = (title, message, autoClose) => {
    const notificationScript = path.join(__dirname, "notification.js");
    spawn(electronPath, [notificationScript, `"${title}"`, `"${message}"`, autoClose.toString()], {
        detached: true,
        stdio: "ignore",
        shell: true,
    }).unref();
};
export const getPercentage = (msg) => {
    const match = msg.match(/\d+(?:\.\d+)?%/);
    if (!match)
        return -1;
    return parseFloat(match[0].replace("%", ""));
};
class Logger {
    log = (key) => {
        const logPath = path.join(__dirname, "log.txt");
        const logDate = new Date().toISOString();
        const logMessage = `${key.toUpperCase()} pressed at ${logDate}\n`;
        fs.appendFileSync(logPath, logMessage);
    };
}
export const logger = new Logger();
