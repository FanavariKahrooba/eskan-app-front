"use client"

import { useState, useEffect, useRef } from "react"
import { Bot, Send, Plus, Search, Copy, RotateCcw, Check } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

type Message = {
  role: "user" | "assistant"
  content: string
}

type Thread = {
  id: string
  title: string
  messages: Message[]
}

export default function AIPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("ai-threads")
    if (saved) {
      const parsed = JSON.parse(saved)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThreads(parsed)
      if (parsed.length) setActiveId(parsed[0].id)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("ai-threads", JSON.stringify(threads))
  }, [threads])

  const activeThread = threads.find((t) => t.id === activeId)

  function newThread() {
    const id = Date.now().toString()

    const thread = {
      id,
      title: "گفتگوی جدید",
      messages: [],
    }

    setThreads((prev) => [thread, ...prev])
    setActiveId(id)
  }

  function updateMessages(messages: Message[]) {
    setThreads((prev) => prev.map((t) => (t.id === activeId ? { ...t, messages } : t)))
  }

  async function sendMessage(text: string) {
    if (!text.trim() || !activeThread || loading) return

    const userMsg = { role: "user" as const, content: text }

    const newMessages = [...activeThread.messages, userMsg]

    updateMessages(newMessages)

    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await res.json()

      const reply = data.reply || "پاسخی دریافت نشد"

      updateMessages([
        ...newMessages,
        {
          role: "assistant",
          content: reply,
        },
      ])

      if (activeThread.title === "گفتگوی جدید") {
        setThreads((prev) => prev.map((t) => (t.id === activeId ? { ...t, title: text.slice(0, 35) } : t)))
      }
    } catch {
      updateMessages([...newMessages, { role: "assistant", content: "خطا در ارتباط با سرور" }])
    }

    setLoading(false)
  }

  function copy(text: string, index: number) {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)

    setTimeout(() => {
      setCopiedIndex(null)
    }, 1500)
  }

  function regenerate() {
    if (!activeThread) return

    const msgs = [...activeThread.messages]

    if (msgs.length < 2) return

    msgs.pop()

    const lastUser = msgs[msgs.length - 1]

    updateMessages(msgs)

    if (lastUser?.role === "user") {
      sendMessage(lastUser.content)
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }, [activeThread?.messages, loading])

  useEffect(() => {
    if (!textareaRef.current) return

    textareaRef.current.style.height = "auto"
    textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px"
  }, [input])

  const filtered = threads.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex h-screen bg-gradient-to-br from-white to-gray-50">
      {/* sidebar */}

      <div className="w-72 border-l border-blue-300 bg-white/80 backdrop-blur-xl flex flex-col">
        <div className="p-2 border-b space-y-3">
          <button
            onClick={newThread}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-1 rounded-xl shadow hover:scale-105 transition"
          >
            <Plus size={18} />
            گفتگوی جدید
          </button>

          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو..."
              className="w-full border rounded-xl pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filtered.map((t) => (
            <div
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={`p-3 rounded-lg cursor-pointer text-sm transition
              ${t.id === activeId ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-100"}
              `}
            >
              {t.title}
            </div>
          ))}
        </div>
      </div>

      {/* chat */}

      <div className="flex flex-col flex-1">
        <div className="border-b border-gray-200 backdrop-blur-xl bg-white/70 p-1 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white">
            <Bot size={18} />
          </div>

          <div className="font-semibold text-gray-700">دستیار هوشمند</div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 max-w-3xl mx-auto w-full">
          {activeThread?.messages.map((m, i) => (
            <div key={i} className={`group flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
              <div
                className={`relative px-5 py-3 rounded-2xl max-w-[90%] shadow-sm
                ${m.role === "user" ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white" : "bg-white border border-gray-300"}`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ className, children }) {
                      const match = /language-(\w+)/.exec(className || "")

                      return match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          customStyle={{
                            borderRadius: "10px",
                            padding: "14px",
                            fontSize: "13px",
                          }}
                        >
                          {String(children)}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-gray-100 px-1 py-0.5 rounded">{children}</code>
                      )
                    },
                  }}
                >
                  {m.content}
                </ReactMarkdown>

                {m.role === "assistant" && (
                  <div className="absolute -bottom-10 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => copy(m.content, i)} className="p-1.5 bg-white border rounded-lg hover:bg-gray-200 cursor-pointer">
                      {copiedIndex === i ? <Check size={14} /> : <Copy size={14} />}
                    </button>

                    <button onClick={regenerate} className="p-1.5 bg-white border rounded-lg hover:bg-gray-200 cursor-pointer">
                      <RotateCcw size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-gray-400 text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              در حال فکر کردن...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="border-t border-gray-300 backdrop-blur-xl bg-white/70 p-2 sticky">
          <div className="max-w-3xl mx-auto flex gap-3 items-end">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage(input)
                }
              }}
              placeholder="پیام خود را بنویسید..."
              className="flex-1 resize-none border rounded-2xl border-gray-300 px-5 py-2 bg-white focus:ring-2 focus:ring-indigo-500 outline-none max-h-[200px]"
            />

            <button
              disabled={loading}
              onClick={() => sendMessage(input)}
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-2xl shadow hover:scale-105 transition disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
