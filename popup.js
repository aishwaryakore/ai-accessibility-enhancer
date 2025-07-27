document.getElementById("altTextButton").addEventListener("click", () => {
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


document.getElementById("simplifyTextButton").addEventListener("click", () => {
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

document.getElementById("textToSpeechButton").addEventListener("click", () => {
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
