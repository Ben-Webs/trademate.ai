import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' })
  }

  const { message, email } = req.body

  if (!message) {
    return res.status(400).json({ error: 'No message' })
  }

  let user = null

  // If email provided → check user
  if (email) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    user = data
  }

  // If no user → create free user
  if (!user) {
    const { data } = await supabase
      .from('users')
      .insert([{ email: email || 'guest', messages_used: 0, plan: 'free' }])
      .select()
      .single()

    user = data
  }

  // 🚫 LIMIT FREE USERS
  if (user.plan === 'free' && user.messages_used >= 3) {
    return res.status(403).json({
      reply: "🚫 You've used your 3 free messages.\n\n👉 Sign up to continue using TradeMate AI."
    })
  }

  // 🤖 Call OpenAI
  const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are TradeMate AI, helping UK trades grow their business with practical advice."
        },
        { role: "user", content: message }
      ]
    })
  })

  const aiData = await aiRes.json()
  const reply = aiData.choices[0].message.content

  // ✅ Update message count
  await supabase
    .from('users')
    .update({ messages_used: user.messages_used + 1 })
    .eq('id', user.id)

  return res.status(200).json({ reply })
}
