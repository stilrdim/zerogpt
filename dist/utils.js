import path from "path";
import { spawn } from "child_process";
import * as electron from "electron";
import fs from "fs";
import { __dirname } from "./constants.js";
const electronPath = electron.default || electron;
export const showNotification = (title, message, autoClose) => {
    const notificationScript = path.join(__dirname, "notification.js");
    spawn(electronPath, [notificationScript, `"${title}"`, `"${message}"`, autoClose.toString()], {
        detached: true,
        stdio: "ignore",
        shell: true,
    }).unref();
};
export const imgToBase64Url = (relativeImagePath) => {
    const imagePath = path.join(__dirname, relativeImagePath);
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");
    const mimeType = "image/png";
    const base64DataUrl = `data:${mimeType};base64,${base64Image}`;
    return base64DataUrl;
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
