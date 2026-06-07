"use client"
import { useState, useEffect } from "react"
import { NotebookPen } from "lucide-react"

export function QuickNoteWidget() {
  const [note, setNote] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("quickNote")
    if (saved) setNote(saved)
  }, [])

  const saveNote = (val: string) => {
    setNote(val)
    localStorage.setItem("quickNote", val)
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <NotebookPen size={18} className="text-blue-500" />
        <h2 className="font-bold text-slate-700">یادداشت سریع</h2>
      </div>
      <textarea
        value={note}
        onChange={(e) => saveNote(e.target.value)}
        placeholder="چیزی بنویس..."
        className="flex-1 resize-none text-sm text-slate-700 bg-slate-50 rounded-2xl p-3 leading-relaxed outline-none"
        rows={5}
      />
    </div>
  )
}
