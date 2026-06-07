import { Users } from "lucide-react"

export function TeamStatusWidget() {
  const users = [
    { name: "علی مظفری", online: true },
    { name: "نازنین قاسمی", online: true },
    { name: "مهدی شریفی", online: false },
  ]

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
        <Users size={18} className="text-blue-500" />
        وضعیت تیم
      </h2>
      <ul className="space-y-3">
        {users.map((u, i) => (
          <li key={i} className="flex justify-between items-center">
            <span className="text-sm text-slate-700">{u.name}</span>
            <div className={`w-2.5 h-2.5 rounded-full ${u.online ? "bg-emerald-500" : "bg-slate-300"}`}></div>
          </li>
        ))}
      </ul>
    </div>
  )
}
