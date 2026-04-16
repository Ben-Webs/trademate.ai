export default async function handler(req, res) {
  
  // ✅ CORS headers (must be first)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Only allow POST after that
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
