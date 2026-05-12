export async function askAI(prompt: string) {
  try {
    const response = await fetch(
      "https://YOUR-VERCEL-APP.vercel.app/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt
        })
      }
    )

    const data = await response.json()

    return data.text
  } catch (error) {
    console.error(error)
    return "AI request failed."
  }
}