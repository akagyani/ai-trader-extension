export default async function handler(req, res) {
  try {
    const { prompt } = req.body

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.AIzaSyCXYuM9CsCAZ-b1PHdPQkdrejHm6zLzGgA}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    )

    const data = await response.json()

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No AI response"

    res.status(200).json({ text })
  } catch (error) {
    res.status(500).json({
      error: "AI backend failed"
    })
  }
}