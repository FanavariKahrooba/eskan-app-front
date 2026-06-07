"use client"

import { useState, useEffect, useRef } from "react"
import { Bot, Send, X, Maximize2 } from "lucide-react"
import { useRouter } from "next/navigation"

type Message = {
  role: "user" | "assistant"
  content: string
}

type Thread = {
  id: string
  title: string
  messages: Message[]
}

export default function AIAssistantWidget() {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [threads, setThreads] = useState<Thread[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("ai-threads")

    if (saved) {
      const parsed = JSON.parse(saved)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThreads(parsed)

      if (parsed.length) {
        setActiveId(parsed[0].id)
      } else {
        const id = Date.now().toString()

        const thread = {
          id,
          title: "گفتگوی جدید",
          messages: [],
        }

        setThreads([thread])
        setActiveId(id)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("ai-threads", JSON.stringify(threads))
  }, [threads])

  const activeThread = threads.find((t) => t.id === activeId)

  function updateMessages(messages: Message[]) {
    setThreads((prev) => prev.map((t) => (t.id === activeId ? { ...t, messages } : t)))
  }

  async function sendMessage() {
    if (!input.trim() || !activeThread) return

    const newMessages: any = [...activeThread.messages, { role: "user", content: input }]

    updateMessages(newMessages)

    const text = input
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await res.json()

      const reply = data.reply || "پاسخی دریافت نشد"

      updateMessages([...newMessages, { role: "assistant", content: reply }])
    } catch {
      updateMessages([...newMessages, { role: "assistant", content: "خطا در ارتباط" }])
    }

    setLoading(false)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeThread?.messages])

  return (
    <>
      {/* floating button */}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-lg
bg-gradient-to-r from-indigo-500 to-blue-500
flex items-center justify-center text-white
hover:scale-105 transition"
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>

      {/* widget */}

      {open && (
        <div className="fixed bottom-24 left-6 w-[360px] h-[520px] bg-white border rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50">
          {/* header */}

          <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white">
                <Bot size={16} />
              </div>

              <div className="text-sm font-semibold text-gray-700">دستیار هوشمند</div>
            </div>

            <button onClick={() => router.push("/ai")} className="p-1 hover:bg-gray-100 rounded">
              <Maximize2 size={16} />
            </button>
          </div>

          {/* messages */}

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeThread?.messages.length === 0 && <div className="text-sm text-gray-400">سلام 👋 چطور می‌توانم کمک کنم؟</div>}

            {activeThread?.messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`
px-4 py-2 rounded-xl max-w-[75%] text-sm
${m.role === "user" ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white" : "bg-gray-100 text-gray-700"}
`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && <div className="text-gray-400 text-xs">AI در حال نوشتن...</div>}

            <div ref={bottomRef} />
          </div>

          {/* input */}

          <div className="border-t p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="پیام..."
              className="flex-1 border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <button onClick={sendMessage} className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 rounded-xl flex items-center">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
