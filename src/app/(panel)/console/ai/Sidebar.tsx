"use client"

export default function Sidebar({ chats, active, setActive, newChat }: any) {
  return (
    <div className="w-64 bg-[#202123] text-white flex flex-col">
      <button onClick={newChat} className="m-3 border border-gray-600 rounded-lg py-2">
        + New Chat
      </button>

      <div className="flex-1 overflow-y-auto">
        {chats.map((c: any) => (
          <div
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`px-4 py-3 cursor-pointer hover:bg-[#2a2b32]
            ${active === c.id ? "bg-[#343541]" : ""}`}
          >
            {c.title}
          </div>
        ))}
      </div>
    </div>
  )
}
