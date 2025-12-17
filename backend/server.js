import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Chat endpoint using OpenRouter (DeepSeek)
app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;
    console.log("OpenRouter request:", message);

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "DEEPSEEK_API_KEY missing" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "Linear-AI"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "user", content: message }
        ],
        max_tokens: 500,   // ✅ IMPORTANT FIX
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({
        error: "OpenRouter error",
        details: data.error
      });
    }

    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        error: "No response from DeepSeek",
        raw: data
      });
    }

    res.json({ reply });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Server failed",
      details: error.message
    });
  }
});

app.listen(5000, () => {
  console.log("Backend running at http://localhost:5000");
});
