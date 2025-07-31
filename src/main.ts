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

/*
KEY OPTIONS:



"0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

"A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";

"UP ARROW" | "DOWN ARROW" | "LEFT ARROW" | "RIGHT ARROW";

"NUMPAD 0" | "NUMPAD 1" | "NUMPAD 2" | "NUMPAD 3" | "NUMPAD 4" | "NUMPAD 5" | "NUMPAD 6" | "NUMPAD 7" | "NUMPAD 8" | "NUMPAD 9";

"NUMPAD EQUALS" | "NUMPAD DIVIDE" | "NUMPAD MULTIPLY" | "NUMPAD MINUS" | "NUMPAD PLUS" | "NUMPAD RETURN" | "NUMPAD DOT";

"LEFT META" | "RIGHT META" | "LEFT CTRL" | "RIGHT CTRL" | "LEFT ALT" | "RIGHT ALT" | "LEFT SHIFT" | "RIGHT SHIFT" | "CAPS LOCK" | "NUM LOCK" | "SCROLL LOCK" | "FN";

"F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10" | "F11" | "F12" | "F13" | "F14" | "F15" | "F16" | "F17" | "F18" | "F19" | "F20" | "F21" | "F22" | "F23" | "F24";

"EQUALS" | "MINUS" | "SQUARE BRACKET OPEN" | "SQUARE BRACKET CLOSE" | "SEMICOLON" | "QUOTE" | "BACKSLASH" | "COMMA" | "DOT" | "FORWARD SLASH";

"SPACE" | "BACKSPACE" | "RETURN" | "ESCAPE" | "BACKTICK" | "SECTION" | "DELETE" | "TAB";

"INS" | "NUMPAD CLEAR" | "PRINT SCREEN";

"PAGE UP" | "PAGE DOWN" | "HOME" | "END";

"MOUSE LEFT" | "MOUSE RIGHT" | "MOUSE MIDDLE" | "MOUSE X1" | "MOUSE X2";

*/
