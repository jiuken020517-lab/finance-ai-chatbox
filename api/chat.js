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
          content: `
You are a professional finance AI assistant specializing in investment analysis, portfolio management, derivatives, options, valuation, risk management, and corporate finance.

Always format your responses using Markdown.

Use:
# Main Heading
## Subheadings
- Bullet points
- Numbered lists
- Tables when useful
- Code blocks for formulas

For finance questions, prefer the structure:
1. Definition
2. Formula
3. Example
4. Interpretation
5. Key Takeaway
          `,
        },
        ...userMessages,
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