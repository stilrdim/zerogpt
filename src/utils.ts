import { fileURLToPath } from "url";
import path from "path";
import { spawn } from "child_process";
import { IGlobalKey } from "node-global-key-listener";
import * as electron from "electron";
import fs from "fs";

const electronPath: string = (electron as any).default || electron;

export const KEY_TO_PRESS: IGlobalKey = "F4";
export const KEY_TO_CLOSE: IGlobalKey = "NUMPAD DOT";
export const NEW_SECTION = "\n\n\n\n\n\n\n\n\n\n\n\n";

const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

export const showNotification = (
  title: string,
  message: string,
  autoClose: boolean
) => {
  const notificationScript = path.join(__dirname, "notification.js");

  spawn(
    electronPath,
    [notificationScript, `"${title}"`, `"${message}"`, autoClose.toString()],
    {
      detached: true,
      stdio: "ignore",
      shell: true,
    }
  ).unref();
};

export const imgToBase64Url = (relativeImagePath: string) => {
  const imagePath = path.join(__dirname, relativeImagePath);
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString("base64");
  const mimeType = "image/png";
  const base64DataUrl = `data:${mimeType};base64,${base64Image}`;
  return base64DataUrl;
};

export const getPercentage = (msg: string): number => {
  const match = msg.match(/\d+(?:\.\d+)?%/);
  if (!match) return -1;
  return parseFloat(match[0].replace("%", ""));
};

class Logger {
  public log = (key: string) => {
    const logPath = path.join(__dirname, "log.txt");
    const logDate = new Date().toISOString();
    const logMessage = `${key.toUpperCase()} pressed at ${logDate}\n`;

    fs.appendFileSync(logPath, logMessage);
  };
}

export const logger = new Logger();
