if (!window.simplifyScriptLoaded) {
  window.simplifyScriptLoaded = true;

  chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
    if (req.type === "SIMPLIFY_SELECTED_TEXT") {
      simplifySelectedText().then((simplified) => {
        sendResponse({ simplifiedText: simplified });
      }).catch((err) => {
        console.error("Simplify Error:", err);
        sendResponse({ simplifiedText: "Failed to simplify text." });
      });
      return true; // Indicates async response
    }
  });
}

async function getApiKey() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "GET_GEMINI_API_KEY" }, (res) => {
      resolve(res.key);
    });
  });
}

async function simplifySelectedText() {
  // Get user-selected text
  const selectedText = window.getSelection().toString().trim();

  if (!selectedText) {
    alert("Please select some text on the page first.");
    throw new Error("No text selected");
  }

  console.log("Selected text:", selectedText);

  const apiKey = await getApiKey();

  // Send to Gemini for simplification
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Simplify this text to make it easy to understand:\n\n${selectedText}`,
              },
            ],
          },
        ],
      })
    }
  );

  const data = await res.json();

  const simplifiedText = data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Could not simplify text.";

  console.log("Simplified text:", simplifiedText);

  return simplifiedText;
}
