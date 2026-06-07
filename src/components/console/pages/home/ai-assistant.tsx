"use client"

import { useState, useEffect, useRef } from "react"
import { Bot, Send, Loader2, Trash2, X } from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [streamText, setStreamText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const bottomRef = useRef<HTMLDivElement>(null)
  const typingQueue = useRef<string[]>([])
  const typingInterval = useRef<NodeJS.Timeout | null>(null)

  /* history */
  useEffect(() => {
    const saved = localStorage.getItem("ai-history")
    if (saved) setMessages(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("ai-history", JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamText])

  /* typing effect */
  const startTypingEffect = () => {
    if (typingInterval.current) return

    typingInterval.current = setInterval(() => {
      if (typingQueue.current.length === 0) {
        clearInterval(typingInterval.current!)
        typingInterval.current = null
        return
      }

      const char = typingQueue.current.shift()!
      setStreamText((prev) => prev + char)

      clearInterval(typingInterval.current!)
      typingInterval.current = null
      setTimeout(startTypingEffect, 18)
    }, 0)
  }

  /* clear */
  function clearChat() {
    setMessages([])
    setStreamText("")
    localStorage.removeItem("ai-history")
  }

  /* send */
  async function sendMessage(text: string) {
    if (!text.trim()) return

    const newMessages: any = [...messages, { role: "user", content: text }]
    setMessages(newMessages)
    setInput("")
    setStreamText("")
    setLoading(true)

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await res.json()
      let reply = data.reply || ""

      if (reply.length < 3) {
        reply = "پاسخی دریافت نشد. دوباره تلاش کنید."
      }

      typingQueue.current = reply.split("")
      startTypingEffect()

      await new Promise<void>((resolve) => {
        const check = setInterval(() => {
          if (!typingInterval.current) {
            clearInterval(check)
            resolve()
          }
        }, 50)
      })

      setMessages((prev) => [...prev, { role: "assistant", content: reply }])
      setStreamText("")
    } catch {
      setError("ارتباط با سرور برقرار نشد")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition"
      >
        <Bot size={22} />
      </button>

      {open && (
        <div className="fixed bottom-24 left-6 w-[360px] bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          {/* header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <Bot size={18} />
              دستیار هوشمند
            </div>

            <div className="flex gap-3">
              <button onClick={clearChat}>
                <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
              </button>

              <button onClick={() => setOpen(false)}>
                <X size={16} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* messages */}
          <div className="p-4 h-80 overflow-y-auto space-y-3 text-sm">
            {messages.length === 0 && <div className="text-gray-500">سلام 👋 چطور می‌توانم کمک کنم؟</div>}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl max-w-[80%] ${m.role === "user" ? "bg-black text-white ml-auto" : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"}`}
              >
                {m.content}
              </div>
            ))}

            {/* streaming text */}
            {streamText && (
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-3 rounded-2xl max-w-[80%]">
                {streamText}
                <span className="animate-pulse">|</span>
              </div>
            )}

            {loading && !streamText && (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 size={14} className="animate-spin" />
                در حال فکر کردن...
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {error && <div className="text-red-500 text-xs px-4 pb-2">{error}</div>}

          {/* input */}
          <div className="border-t flex items-center p-2 gap-2 bg-white/60">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="سوال بپرس..."
              className="flex-1 px-3 py-2 rounded-xl bg-white border outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />

            <button onClick={() => sendMessage(input)} disabled={loading} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-xl">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
