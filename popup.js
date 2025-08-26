// Alt Text Generation
document.getElementById("altTextButton").addEventListener("click", () => {

  const resultDiv = document.getElementById("result");
  resultDiv.innerText = "Generating alt text... Please wait.";

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    // First, inject the content script if it's not already present
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content/altTextGenerator.js']
    }).then(() => {
      // Now send the message
      chrome.tabs.sendMessage(
        tab.id,
        { type: "GENERATE_ALT_TEXT" },
        (res) => {
          if (chrome.runtime.lastError) {
            console.error("Error:", chrome.runtime.lastError.message);
            return;
          }
          console.log("res:", res);
        }
      );
    }).catch((error) => {
      console.error("Failed to inject content script:", error);
    });
  });
});

chrome.runtime.onMessage.addListener((req, _sender, _sendResponse) => {
  if (req.type === "ALT_TEXT_FINISHED") {
    document.getElementById("result").innerText = "Alt text generation finished!";
  }
});


// Simplify Text
document.getElementById("simplifyTextButton").addEventListener("click", () => {
  const resultDiv = document.getElementById("result");
  resultDiv.innerText = "Simplifying text... Please wait.";

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    // Inject simplifyText.js if not already present
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content/textSimplifier.js'],
    }).then(() => {
      // Send message to simplifyText.js
      chrome.tabs.sendMessage(
        tab.id,
        { type: "SIMPLIFY_SELECTED_TEXT" },
        (res) => {
          if (chrome.runtime.lastError) {
            console.error("Error:", chrome.runtime.lastError.message);
            return;
          }
          console.log("Simplify Text Response:", res);
          if (res?.simplifiedText) {
            document.getElementById("result").innerText = res.simplifiedText;
          }
        }
      );
    }).catch((error) => {
      console.error("Failed to inject simplifyText.js:", error);
    });
  });
});


// Text-to-Speech 
const ttsControls = document.getElementById("ttsControls");

document.getElementById("textToSpeechButton").addEventListener("click", () => {
  ttsControls.style.display = "flex";
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    // Inject TTS content script
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content/textToSpeech.js"]
    }).then(() => {
      chrome.tabs.sendMessage(tab.id, { type: "TEXT_TO_SPEECH" });
    }).catch((error) => {
      console.error("Failed to inject TTS content script:", error);
    });
  });
});

document.getElementById("pauseTTSButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.tabs.sendMessage(tab.id, { type: "PAUSE_TTS" });
  });
});

document.getElementById("resumeTTSButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.tabs.sendMessage(tab.id, { type: "RESUME_TTS" });
  });
});

document.getElementById("stopTTSButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.tabs.sendMessage(tab.id, { type: "STOP_TTS" });
  });
});

chrome.runtime.onMessage.addListener((req) => {
  if (req.type === "TTS_STATUS" && req.status === "finished") {
    ttsControls.style.display = "none"; // Hide controls when finished
  }
});