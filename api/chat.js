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

Finance Calculator Mode:
If the user provides inputs such as S, K, r, IV, T, option type, market price, portfolio return, beta, risk-free rate, or market return, perform the calculation step by step.

For options, calculate when possible:
- Black-Scholes model price
- d1
- d2
- Delta
- Gamma
- Vega
- Theta
- Intrinsic value
- Time value
- Moneyness

Always show:
1. Inputs
2. Formula
3. Result
4. Interpretation
5. Limitation
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