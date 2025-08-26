// Prevent multiple listeners
if (!window.ttsScriptLoaded) {
  window.ttsScriptLoaded = true;

  chrome.runtime.onMessage.addListener(async (req, _sender, _sendResponse) => {
    if (req.type === "TEXT_TO_SPEECH") {
      const selectedText = window.getSelection().toString().trim();
      if (!selectedText) {
        alert("Please select some text on the page to read aloud.");
        return;
      }

      console.log("Selected text for TTS:", selectedText);

      try {

        const apiKey = await getApiKey();

        const response = await fetch(
          `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              input: { text: selectedText },
              voice: {
                languageCode: "en-US",
                name: "en-US-Wavenet-D"
              },
              audioConfig: { audioEncoding: "MP3" }
            })
          }
        );

        const data = await response.json();

        if (response.ok && data.audioContent) {
          const audio = new Audio("data:audio/mp3;base64," + data.audioContent);
          audio.play();
        } else {
          console.error("❌ Google TTS API Error:", data);
          alert("Failed to generate speech. Check console for details.");
        }
      } catch (error) {
        console.error("❌ TTS Error:", error);
        alert("An error occurred while generating speech.");
      }
    }
  });
}

async function getApiKey() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "GET_GOOGLE_TTS_API_KEY" }, (res) => {
      resolve(res.key);
    });
  });
}