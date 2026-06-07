"use client"

import { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import CodeBlock from "./CodeBlock"

export default function Chat({ chat, update }: any) {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const controller = useRef<AbortController | null>(null)

  const bottomRef = useRef<HTMLDivElement>(null)

  function scroll() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scroll, [chat.messages])

  async function send(text?: string) {
    const prompt = text ?? input
    if (!prompt) return

    const messages = [...chat.messages, { role: "user", content: prompt }]

    update(messages)

    setInput("")
    setLoading(true)

    controller.current = new AbortController()

    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({ messages }),
    })

    const reader = res.body?.getReader()

    let ai = ""

    update([...messages, { role: "assistant", content: "" }])

    while (true) {
      const { done, value } = await reader!.read()

      if (done) break

      const chunk = new TextDecoder().decode(value)

      ai = chunk

      update([...messages, { role: "assistant", content: ai }])
    }

    setLoading(false)
  }

  function stop() {
    controller.current?.abort()
    setLoading(false)
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 overflow-y-auto p-8 space-y-6 max-w-3xl mx-auto w-full">
        {chat.messages.map((m: any, i: number) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`px-5 py-3 rounded-2xl max-w-[75%]
              ${m.role === "user" ? "bg-blue-500 text-white" : "bg-white border"}`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children }) {
                    const match = /language-(\w+)/.exec(className || "")

                    if (match) {
                      return <CodeBlock language={match[1]} value={String(children)} />
                    }

                    return <code>{children}</code>
                  },
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="border-t p-4 bg-white">
        <div className="max-w-3xl mx-auto flex gap-3">
          <textarea
            className="flex-1 border rounded-xl px-4 py-3"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send message..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
          />

          {loading ? (
            <button onClick={stop} className="bg-red-500 text-white px-4 rounded-lg">
              Stop
            </button>
          ) : (
            <button onClick={() => send()} className="bg-black text-white px-5 rounded-lg">
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
