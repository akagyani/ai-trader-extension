import { askAI } from "../lib/ai"
import React, { useEffect, useState } from "react"

const Sidebar = () => {
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // LIVE MARKET DATA
  const [tickerData, setTickerData] = useState<any[]>([])

  // FETCH STOCKS
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const symbols = ["AAPL", "TSLA", "NVDA", "MSFT"]

        const results = await Promise.all(
          symbols.map(async (symbol) => {
            const res = await fetch(
              `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=d812bo9r01qler4gnhs0d812bo9r01qler4gnhsg`
            )

            const data = await res.json()

            return {
              symbol,
              price: data.c || 0,
              change: data.dp || 0
            }
          })
        )

        setTickerData(results)
      } catch (error) {
        console.error("Ticker fetch failed:", error)
      }
    }

    fetchStocks()

    const interval = setInterval(fetchStocks, 15000)

    return () => clearInterval(interval)
  }, [])

  // EXTRACT STOCK DATA
  const extractStockData = () => {
    const stockElements = document.querySelectorAll("table tr")

    let extractedData = ""

    stockElements.forEach((row) => {
      extractedData += row.textContent + "\n"
    })

    if (!extractedData.trim()) {
      extractedData = document.body.innerText
    }

    return extractedData.slice(0, 3000)
  }

  // EXTRACT NEWS
  const extractNewsHeadlines = () => {
    const headlines = document.querySelectorAll("h1, h2, h3")

    let newsText = ""

    headlines.forEach((headline) => {
      newsText += headline.textContent + "\n"
    })

    return newsText.slice(0, 2000)
  }

  // GENERIC AI CALL
  const runAI = async (prompt: string) => {
    setLoading(true)

    try {
      const aiReply = await askAI(prompt)
      setResponse(aiReply)
    } catch (error) {
      console.error(error)
      setResponse("AI failed to respond.")
    }

    setLoading(false)
  }

  // ASK AI
  const handleAskAI = async () => {
    const pageText = extractStockData()

    runAI(`
You are an advanced AI trading copilot.

Current market data:
${pageText}

User Question:
${message}

Give smart concise insights.
    `)
  }

  // PORTFOLIO
  const analyzePortfolio = async () => {
    const pageText = extractStockData()

    runAI(`
You are a hedge fund portfolio analyst.

Portfolio data:
${pageText}

Tasks:
- Identify risks
- Suggest diversification
- Detect concentration
- Give investment insights
    `)
  }

  // MARKET MOOD
  const analyzeMarketMood = async () => {
    const pageText = extractStockData()

    runAI(`
You are a market sentiment AI.

Market data:
${pageText}

Analyze:
- Bullish/Bearish
- Momentum
- Fear vs greed
- Strong sectors
- Weak sectors
    `)
  }

  // AI SIGNALS
  const generateSignals = async () => {
    const pageText = extractStockData()

    runAI(`
You are an elite hedge fund trading AI.

Market data:
${pageText}

Generate:
- BUY / SELL / HOLD
- Confidence %
- Risk level
- Momentum
- Short explanation
    `)
  }

  // NEWS SUMMARY
  const summarizeNews = async () => {
    const newsText = extractNewsHeadlines()

    runAI(`
You are a financial news AI.

Current market news:
${newsText}

Tasks:
- Summarize news
- Explain impact
- Mention bullish/bearish effect
- Mention affected sectors
    `)
  }

  return (
    <>
      {/* FLOATING BUTTON */}
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            top: "120px",
            right: "20px",
            width: "62px",
            height: "62px",
            borderRadius: "22px",
            background:
              "linear-gradient(135deg,#00F5FF,#0066FF)",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow:
              "0 10px 40px rgba(0,245,255,0.35)",
            color: "white",
            fontWeight: "700",
            fontSize: "20px",
            backdropFilter: "blur(20px)"
          }}
        >
          AI
        </div>
      )}

      {/* SIDEBAR */}
      <div
        style={{
          position: "fixed",
          top: "0",
          right: isOpen ? "0" : "-430px",
          width: "400px",
          height: "100vh",
          background: "rgba(10,10,15,0.96)",
          backdropFilter: "blur(30px)",
          zIndex: 999999,
          transition: "all 0.35s ease",
          borderLeft:
            "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow:
            "-10px 0 60px rgba(0,0,0,0.5)",
          fontFamily: "Inter, Arial"
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: "22px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom:
              "1px solid rgba(255,255,255,0.06)"
          }}
        >
          <div>
            <div
              style={{
                color: "white",
                fontSize: "24px",
                fontWeight: "700"
              }}
            >
              Trading AI
            </div>

            <div
              style={{
                color: "#8b949e",
                fontSize: "12px",
                marginTop: "5px"
              }}
            >
              AI Market Intelligence
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "26px",
              cursor: "pointer"
            }}
          >
            ×
          </button>
        </div>

        {/* MARKET TICKER */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            overflowX: "auto",
            padding: "18px"
          }}
        >
          {tickerData.map((stock, index) => (
            <div
              key={index}
              style={{
                minWidth: "115px",
                background:
                  "rgba(255,255,255,0.04)",
                border:
                  "1px solid rgba(255,255,255,0.06)",
                borderRadius: "20px",
                padding: "14px",
                backdropFilter: "blur(20px)"
              }}
            >
              <div
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: "15px"
                }}
              >
                {stock.symbol}
              </div>

              <div
                style={{
                  color: "#d1d5db",
                  marginTop: "8px",
                  fontSize: "14px"
                }}
              >
                ${stock.price}
              </div>

              <div
                style={{
                  marginTop: "6px",
                  color:
                    stock.change >= 0
                      ? "#00ff99"
                      : "#ff4d4d",
                  fontWeight: "700",
                  fontSize: "13px"
                }}
              >
                {stock.change.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>

        {/* TEXT INPUT */}
        <div style={{ padding: "0 18px" }}>
          <textarea
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="Ask about stocks, crypto, portfolio..."
            style={{
              width: "100%",
              height: "120px",
              background:
                "rgba(255,255,255,0.04)",
              color: "white",
              border:
                "1px solid rgba(255,255,255,0.06)",
              borderRadius: "22px",
              padding: "16px",
              resize: "none",
              outline: "none",
              fontSize: "14px",
              lineHeight: "1.6",
              backdropFilter: "blur(20px)"
            }}
          />
        </div>

        {/* BUTTONS */}
        <div
          style={{
            padding: "18px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px"
          }}
        >
          <button
            onClick={analyzePortfolio}
            style={premiumBtn}
          >
            Portfolio
          </button>

          <button
            onClick={analyzeMarketMood}
            style={premiumBtn}
          >
            Market Mood
          </button>

          <button
            onClick={generateSignals}
            style={premiumBtn}
          >
            AI Signals
          </button>

          <button
            onClick={summarizeNews}
            style={premiumBtn}
          >
            News
          </button>
        </div>

        {/* ASK AI BUTTON */}
        <div style={{ padding: "0 18px" }}>
          <button
            onClick={handleAskAI}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "20px",
              border: "none",
              background:
                "linear-gradient(90deg,#00F5FF,#0066FF)",
              color: "white",
              fontWeight: "700",
              fontSize: "15px",
              cursor: "pointer",
              boxShadow:
                "0 10px 30px rgba(0,245,255,0.25)"
            }}
          >
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </div>

        {/* RESPONSE */}
        <div
          style={{
            flex: 1,
            margin: "18px",
            background:
              "rgba(255,255,255,0.03)",
            border:
              "1px solid rgba(255,255,255,0.06)",
            borderRadius: "24px",
            padding: "18px",
            overflowY: "auto",
            color: "#d1d5db",
            fontSize: "14px",
            lineHeight: "1.7",
            whiteSpace: "pre-wrap"
          }}
        >
          {response ||
            "AI trading responses will appear here..."}
        </div>
      </div>
    </>
  )
}

// PREMIUM BUTTON STYLE
const premiumBtn = {
  background: "rgba(255,255,255,0.04)",
  color: "white",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "18px",
  padding: "14px",
  cursor: "pointer",
  fontWeight: "600",
  transition: "all 0.2s ease"
}

export default Sidebar