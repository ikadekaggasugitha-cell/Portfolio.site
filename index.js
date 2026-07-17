import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.ZENMUX_API_KEY,
  baseURL: "https://zenmux.ai/api/v1",
});

async function main() {
  try {
    const completion = await client.chat.completions.create({
      model: "z-ai/glm-5.2",
      messages: [
        {
          role: "user",
          content: "Halo, perkenalkan dirimu."
        }
      ]
    });

    console.log("AI:");
    console.log(completion.choices[0].message.content);

  } catch (error) {
    console.error(error);
  }
}

main();