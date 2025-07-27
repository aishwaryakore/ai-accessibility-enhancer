// Prevent multiple listeners
if (!window.contentScriptLoaded) {
  window.contentScriptLoaded = true;

  chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
    if (req.type === "GENERATE_ALT_TEXT") {
      generateAltTextForImages();
      sendResponse({ status: "started" });
      return true;
    }
  });
}

// Delay to avoid rate limits
function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

const GEMINI_API_KEY = "AIzaSyDy6Z69kBTF4ZcQvXf51ooAbo7No_S9mhc";

async function generateAltTextForImages() {
  const images = document.querySelectorAll("img:not([alt]), img[alt='']");
  console.log("Found images:", images);

  if (!images.length) {
    alert("No images without alt text found.");
    return;
  }

  for (const img of images) {
    try {
      if (!img.src) {
        console.warn("Image src missing");
        continue;
      }

      const base64 = await convertImageToBase64(img);
      const altText = await getAltTextFromGemini(base64);
      if (!altText) continue;

      img.alt = altText;

      const tag = document.createElement("div");
      tag.innerText = `🧠 alt: ${altText}`;
      tag.style.cssText = `
      font-size: 12px;
      background: #e0f7fa;
      color: #222;
      padding: 4px 6px;
      border-radius: 6px;
      margin-top: 4px;
      max-width: 250px;
    `;
      img.insertAdjacentElement("afterend", tag);

      await delay(1500); // to avoid hitting rate limits
    } catch (error) {
      console.error("Skipping image due to error:", error);
    }
  }
}

async function getAltTextFromGemini(base64Image) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image
                }
              },
              {
                text: "Caption this image in one sentence for alt text."
              }
            ]
          }
        ]
      })
    }
  );

  const result = await res.json();

  if (res.ok && result.candidates?.[0]?.content?.parts?.[0]?.text) {
    return result.candidates[0].content.parts[0].text;
  } else {
    console.error("Gemini API Error:", result);
    return null;
  }
}

function convertImageToBase64(img) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = img.src;

    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        const base64 = canvas.toDataURL("image/jpeg").split(",")[1];
        resolve(base64);
      } catch (e) {
        reject("Canvas error: " + e);
      }
    };

    image.onerror = () => reject("Failed to load image");
  });
}


