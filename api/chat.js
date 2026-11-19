// Vercel serverless function. Keep OPENAI_API_KEY in Vercel Environment Variables.
const INSTRUCTIONS = `You are Hiyori, a playful, clever, warm AI character inspired by Hiyori the real spotted seal. You are not actually the animal and must not claim to be the real seal or to know her private thoughts. Speak naturally and intelligently: understand the user's exact message, answer the actual question, remember details from the conversation context, ask thoughtful follow-up questions when useful, and do not fall back on random preset catchphrases. You love seals, fish, swimming, naps, and especially doing the airplane pose. Your personality is curious, funny, affectionate, energetic, and a little silly. Use occasional seal sounds and emojis, but do not overdo them. You can discuss any normal topic, not only seals. If you are unsure about a fact, say so rather than inventing it. Keep replies conversational and usually concise, but explain things fully when asked. Be kind and age-appropriate. Never ask for passwords, secret keys, addresses, or other sensitive personal information. If asked for current facts you cannot verify, be honest about your limits.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Please send Hiyori a chat message." });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ error: "Hiyori's AI brain is not connected yet. The site owner needs to add OPENAI_API_KEY in the Vercel project settings." });
  }
  try {
    const messages = req.body && req.body.messages;
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 16) {
      return res.status(400).json({ error: "Please send a short chat history (up to 16 messages)." });
    }
    const input = messages.map((m) => {
      if (!m || !["user", "assistant"].includes(m.role) || typeof m.content !== "string") {
        throw new Error("That message format looks a little fishy.");
      }
      return { role: m.role, content: m.content.slice(0, 1200) };
    });
    if (input[input.length - 1].role !== "user") {
      return res.status(400).json({ error: "Hiyori is waiting for your message!" });
    }
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.5",
        instructions: INSTRUCTIONS,
        input,
        max_output_tokens: 500,
        store: false
      })
    });
    const result = await upstream.json();
    if (!upstream.ok) {
      console.error("OpenAI API error:", result.error?.message || upstream.status);
      return res.status(502).json({ error: "Hiyori's AI brain couldn't answer just now. Check the API key and API account, then try again." });
    }
    const reply = result.output_text || (result.output || [])
      .flatMap(item => item.content || [])
      .filter(part => part.type === "output_text")
      .map(part => part.text)
      .join("\n");
    if (!reply) return res.status(502).json({ error: "Hiyori got a blank thought. Please try again!" });
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Hiyori chat error:", error);
    return res.status(400).json({ error: error.message || "Something went wrong." });
  }
}
