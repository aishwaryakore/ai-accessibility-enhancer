import { CONFIG } from "./config.js";

const GEMINI_API_KEY = CONFIG.GEMINI_API_KEY;
const GOOGLE_TTS_API_KEY = CONFIG.GOOGLE_TTS_API_KEY

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "GET_GEMINI_API_KEY") {
    sendResponse({ key: GEMINI_API_KEY });
    return true
  }
  if (req.type === "GET_GOOGLE_TTS_API_KEY") {
    sendResponse({ key: GOOGLE_TTS_API_KEY });
    return true
  }
});