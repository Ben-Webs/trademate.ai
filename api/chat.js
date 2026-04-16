export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const { message } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a UK business growth expert helping trades get more leads and customers. Be simple, practical and direct.",
        },
        { role: "user", content: message },
      ],
    }),
  });

  const data = await response.json();

  res.status(200).json({
    reply: data.choices[0].message.content,
  });
}
