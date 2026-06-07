"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

export default function CodeBlock({ language, value }: { language: string; value: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-xl overflow-hidden border bg-[#1e1e1e]">
      <div className="flex justify-between px-3 py-2 text-xs bg-[#2d2d2d] text-gray-300">
        <span>{language}</span>

        <button onClick={copy} className="flex gap-1 items-center">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <SyntaxHighlighter language={language} style={vscDarkPlus} customStyle={{ margin: 0, padding: "16px" }}>
        {value}
      </SyntaxHighlighter>
    </div>
  )
}
