import puppeteer from "puppeteer";
import { __dirname, showNotification } from "./utils.js";

console.log("Copy your text and press [F4] to check AI %!\n");

export const getAIPercentage = async (
  textToCheck: string,
  key: string,
  isHeadless: boolean = true
): Promise<string> => {
  // Send a Windows notification to announce F4 was detected
  showNotification("ZeroGPT", `[${key}] Looking up text...`, true);

  console.log("\n\nCreating a browser...");
  const browser = await puppeteer.launch({ headless: isHeadless });
  const page = await browser.newPage();

  console.log("Heading to ZEROGPT.COM...");
  await page.goto("https://zerogpt.com/");
  await page.type("#textArea", textToCheck);

  const scoreButton = await page.$(".scoreButton");

  console.log("Evaluating text...");
  // Ensure the button is loaded in and clickable
  if (scoreButton) {
    await scoreButton.evaluate((btn) => btn.scrollIntoView());
    await scoreButton.evaluate((btn) => {
      if (btn instanceof HTMLElement) btn.click();
    });
  } else {
    console.error("scoreButton not found");
  }

  await page.waitForSelector(".semi-circle");

  const result = await page.$eval(
    "div.percentage-div>.header-text.text-center",
    (el) => el.textContent?.replace(/\n/g, " ").trim()
  );
  if (!result) return "Unable to get response";

  const match = result.match(/\d+(?:\.\d+)?%/);
  if (!match) return "Unable to get percentage";

  if (isHeadless === true) await browser.close();

  return match.toString();
};
