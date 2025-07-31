import clipboard from "clipboardy";

export const safeReadClipboard = async (): Promise<string> => {
  try {
    const text = await clipboard.read();
    // Clipboard is empty
    if (!text) {
      console.log("Clipboard appears empty");
      return "NO COPIED TEXT";
    }
    return text;
  } catch (error) {
    // Assuming clipboard has an image or something??
    console.error("Failed to read clipboard: ", error);
    return "NO COPIED TEXT";
  }
};
