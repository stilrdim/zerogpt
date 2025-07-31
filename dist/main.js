import { GlobalKeyboardListener } from "node-global-key-listener";
import { handleAppClose, handleLookupKeyPressed } from "./handleStates.js";
import { KEY_TO_CLOSE_APP, KEY_TO_LOOKUP_TEXT } from "./constants.js";
const listener = new GlobalKeyboardListener();
// Check for pressed keys
listener.addListener((e) => {
    if (e.state === "DOWN") {
        const pressedKey = e.name;
        switch (pressedKey) {
            case KEY_TO_LOOKUP_TEXT:
                handleLookupKeyPressed();
                break;
            case KEY_TO_CLOSE_APP:
                handleAppClose();
        }
    }
});
