import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// === CONFIGURATION ===
const HF_TOKEN = "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"; // Replace with your token
const MODEL = "HuggingFaceH4/zephyr-7b-beta";

// === ROOT ENDPOINT ===
app.get("/", (req, res) => {
  res.send("Google Home AI Voice Assistant Webhook is running ✅");
});

// === MAIN CHAT ENDPOINT ===
app.post("/chat", async (req, res) => {
  try {
    // Dialogflow sends user message in req.body.queryResult.queryText
    const userMessage = req.body?.queryResult?.queryText || "Hello";

    console.log("User:", userMessage);

    // === Call Hugging Face Inference API ===
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HF_TOKEN}`,
        },
        body: JSON.stringify({
          inputs: userMessage,
          parameters: { max_new_tokens: 200 },
        }),
      }
    );

    if (!response.ok) {
      console.error("Hugging Face API error:", response.statusText);
      throw new Error("Model request failed");
    }

    const data = await response.json();
    console.log("Model raw response:", JSON.stringify(data));

    // Hugging Face returns array of outputs
    const modelReply =
      data[0]?.generated_text?.trim() ||
      data.generated_text?.trim() ||
      "Sorry, I couldn’t generate a response.";

    console.log("Assistant:", modelReply);

    // === Dialogflow-compatible response ===
    res.json({
      fulfillmentText: modelReply,
    });
  } catch (error) {
    console.error("Error:", error);
    res.json({
      fulfillmentText:
        "I’m sorry, I ran into a problem while thinking about that.",
    });
  }
});

// === EXPORT FOR VERCEL ===
export default app;
