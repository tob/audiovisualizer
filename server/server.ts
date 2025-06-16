// server/index.ts

import express from "express";
import dotenv from "dotenv";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";

dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());

app.post("/analyze", async (req, res) => {
  const { lyrics } = req.body;

  const chat = new ChatOpenAI({
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const result = await chat.call([
      new HumanMessage(
        `Given the following song lyrics:\n\n"${lyrics}"\n\nReturn a mood (e.g. happy, sad, energetic), a short visual description (e.g. neon blue waves on a dark grid), and a color palette (hex codes). Return in JSON.`
      ),
    ]);

    res.json({ result: result.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI processing failed" });
  }
});

app.listen(port, () => {
  console.log(`LangChain server running on http://localhost:${port}`);
});
