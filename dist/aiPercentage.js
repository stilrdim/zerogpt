import puppeteer from "puppeteer";
import { showNotification } from "./utils.js";
import os from "os";
console.log("Copy your text and press [F4] to check AI %!\n");
// Check for the user's name in OS variables
const username = os.userInfo().username.toLowerCase();
export const getAIPercentage = async (textToCheck, key, isHeadless = true) => {
    showNotification("ZeroGPT", `[${key}] Looking up text...`, true);
    console.log("\n\nCreating a browser...");
    let browser;
    if (username === "stil")
        browser = await puppeteer.launch({ headless: isHeadless });
    else
        browser = await puppeteer.launch({
            headless: isHeadless,
            executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        });
    const page = await browser.newPage();
    console.log("Heading to ZEROGPT.COM...");
    await page.goto("https://zerogpt.com/");
    // Wait for the iframe to appear and get its frame
    await page.waitForSelector("#sp_message_iframe_1232525", { timeout: 10000 });
    const iframeElementHandle = await page.$("#sp_message_iframe_1232525");
    const iframe = await iframeElementHandle?.contentFrame();
    if (iframe) {
        await iframe.waitForSelector('button[title="Accept"]', { timeout: 10000 });
        await iframe.click('button[title="Accept"]');
        console.log("Popup avoided successfully!");
    }
    else {
        console.log("Privacy iframe not found, continuing...");
    }
    // Write to the textarea
    console.log("Writing your text...");
    await page.type("#textArea", textToCheck);
    console.log("Checking score...");
    const scoreButton = await page.$(".scoreButton");
    if (scoreButton) {
        await scoreButton.evaluate((btn) => btn.scrollIntoView());
        await scoreButton.evaluate((btn) => {
            if (btn instanceof HTMLElement)
                btn.click();
        });
    }
    else {
        console.error("scoreButton not found");
    }
    await page
        .waitForSelector(".semi-circle", { timeout: 30000 })
        .then((el) => el?.screenshot({ path: "result.png" }));
    const result = await page.$eval("div.percentage-div>.header-text.text-center", (el) => el.textContent?.replace(/\n/g, " ").trim());
    if (!result) {
        if (isHeadless)
            await browser.close();
        return "Unable to get response";
    }
    const match = result.match(/\d+(?:\.\d+)?%/);
    if (!match) {
        if (isHeadless)
            await browser.close();
        return "Unable to get percentage";
    }
    if (isHeadless)
        await browser.close();
    return match.toString();
};
