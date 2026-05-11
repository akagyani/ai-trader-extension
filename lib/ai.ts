export async function askAI(prompt: string) {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCXYuM9CsCAZ-b1PHdPQkdrejHm6zLzGgA",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    )

    const data = await response.json()

    console.log("FULL RESPONSE:", data)

    if (data.candidates?.length > 0) {
      return data.candidates[0].content.parts[0].text
    }

    if (data.error) {
      return `API Error: ${data.error.message}`
    }

    return "No AI response from Gemini."
  } catch (error) {
    console.error("FETCH ERROR:", error)
    return "Failed to connect AI."
  }
}