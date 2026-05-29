import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    const { message, messages } = req.body;

    const userMessages = Array.isArray(messages)
      ? messages
      : [
          {
            role: "user",
            content: message || "",
          },
        ];

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional finance AI assistant specializing in investment analysis, portfolio management, derivatives, options, valuation, risk management, and corporate finance. Explain concepts clearly and provide examples when appropriate."
        },
        ...userMessages
      ],
    });

    res.status(200).json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
}