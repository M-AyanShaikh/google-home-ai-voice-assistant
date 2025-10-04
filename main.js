import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const HF_TOKEN = "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";
const MODEL = "HuggingFaceH4/zephyr-7b-beta";

app.post("/chat", async (req, res) => {
  const userMessage = req.body.query || "Hello!";

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${MODEL}`,
    {
      headers: { Authorization: `Bearer ${HF_TOKEN}` },
      method: "POST",
      body: JSON.stringify({ inputs: userMessage }),
    }
  );

  const data = await response.json();
  const reply = data[0]?.generated_text || "Sorry, I didn’t understand.";

  res.json({ reply });
});

app.listen(3000, () => console.log("Assistant webhook running on port 3000"));
