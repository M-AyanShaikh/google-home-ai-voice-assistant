export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const userMessage = req.body.queryResult?.queryText || "Hello";

    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer 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", // replace with your HF key
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: userMessage }),
      }
    );

    if (!hfResponse.ok) {
      const errText = await hfResponse.text();
      console.error("Hugging Face error:", errText);
      return res.status(500).json({ fulfillmentText: "Model request failed." });
    }

    const data = await hfResponse.json();
    const reply =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text
        : "Sorry, I didn’t understand that.";

    return res.status(200).json({ fulfillmentText: reply });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ fulfillmentText: "Internal server error." });
  }
}
