import { getAIPercentage } from "./aiPercentage.js";
import { safeReadClipboard } from "./clipboard.js";
import { KEY_TO_CLOSE_APP, KEY_TO_LOOKUP_TEXT, NEW_SECTION, USE_HEADLESS_BROWSER, } from "./constants.js";
import { logger, showNotification } from "./utils.js";
export const handleLookupKeyPressed = () => {
    safeReadClipboard().then((copiedText) => {
        if (copiedText === "NO COPIED TEXT")
            return console.log(copiedText);
        getAIPercentage(copiedText, KEY_TO_LOOKUP_TEXT, USE_HEADLESS_BROWSER)
            .then((result) => {
            console.log(`\nYour text:\n${copiedText}\n\n`);
            console.log(`Your text is ${result} AI!${NEW_SECTION}`);
            showNotification("ZeroGPT", `Your text is ${result} AI`, false);
        })
            .catch((error) => console.error("An error occured while fetching the response: ", error));
    });
    logger.log(KEY_TO_LOOKUP_TEXT);
};
export const handleAppClose = () => {
    showNotification("ZeroGPT", `[${KEY_TO_CLOSE_APP}] Shutting down...`, true);
    console.log(`[${KEY_TO_CLOSE_APP}] Shutting down!`);
    logger.log(KEY_TO_CLOSE_APP);
    process.exit(1);
};
