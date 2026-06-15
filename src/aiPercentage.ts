import puppeteer, { Browser } from "puppeteer";
import axios from "axios";
import { showNotification } from "./utils.js";
import os from "os";
import { OurResponse, ZerogptResponse } from "./types/index.js";

console.log("Copy your text and press [F4] to check AI %!\n");

// Check for the user's name in OS variables
const username = os.userInfo().username.toLowerCase();

export const getAIPercentage = async (
  textToCheck: string,
  key: string,
  isHeadless: boolean = true,
): Promise<string> => {
  showNotification("ZeroGPT", `[${key}] Looking up text...`, true);

  console.log("\n\nCreating a browser...");
  let browser: Browser;
  if (username === "stil")
    browser = await puppeteer.launch({ headless: isHeadless });
  else
    browser = await puppeteer.launch({
      headless: isHeadless,
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    });
  const page = await browser.newPage();

  console.log("Heading to ZEROGPT.COM...");
  await page.goto("https://zerogpt.com/");

  // Wait for the iframe to appear and get its frame
  // Example popup iframe:      id="sp_message_iframe_1366862" title="SP Consent Message"></iframe>
  await page.waitForSelector('[title="SP Consent Message"]', {
    timeout: 10000,
  });
  const iframeElementHandle = await page.$('[title="SP Consent Message"]');
  const iframe = await iframeElementHandle?.contentFrame();
  if (iframe) {
    await iframe.waitForSelector('button[title="Accept"]', { timeout: 10000 });
    await iframe.click('button[title="Accept"]');
    console.log("Popup avoided successfully!");
  } else {
    console.log("Privacy iframe not found, continuing...");
  }

  // Write to the textarea

  page.evaluate((text) => {
    const input = document.querySelector("#textArea") as HTMLTextAreaElement;
    if (input) {
      console.log("Pasting your text...");
      input.value = text;

      // Simulate input to ensure we get back the correct state
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }, textToCheck);

  console.log("Checking score...");
  const scoreButton = await page.$(".scoreButton");

  if (scoreButton) {
    await scoreButton.evaluate((btn) => btn.scrollIntoView());
    await scoreButton.evaluate((btn) => {
      if (btn instanceof HTMLElement) btn.click();
    });
  } else {
    console.error("scoreButton not found");
  }

  await page
    .waitForSelector(".semi-circle", { timeout: 30000 })
    .then((el) => el?.screenshot({ path: "result.png" }));
  const result = await page.$eval(
    "div.percentage-div>.header-text.text-center",
    (el) => el.textContent?.replace(/\n/g, " ").trim(),
  );

  if (!result) {
    if (isHeadless) await browser.close();
    return "Unable to get response";
  }

  const match = result.match(/\d+(?:\.\d+)?%/);
  if (!match) {
    if (isHeadless) await browser.close();
    return "Unable to get percentage";
  }

  if (isHeadless) await browser.close();

  return match.toString();
};

export const getAiPercentageThroughAPI = async (
  input_text: string,
  key: string,
): Promise<OurResponse> => {
  showNotification("ZeroGPT", `[${key}] Looking up text...`, true);

  const { data: res } = await axios.post<ZerogptResponse>(
    "https://api.zerogpt.com/api/detect/detectText",
    { input_text },
    {
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0",
        Origin: "https://www.zerogpt.com",
      },
    },
  );

  if (!res.success) return { feedback: "Failed contacting the ZeroGPT API" };

  const { fakePercentage, feedback } = res.data;

  return { fakePercentage, feedback };
};
