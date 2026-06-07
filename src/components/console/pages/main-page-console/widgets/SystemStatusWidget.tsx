import { Server, Database, Wifi } from "lucide-react"

const services = [
  { name: "API اصلی", icon: Wifi, status: "active" },
  { name: "پایگاه داده", icon: Database, status: "warning" },
  { name: "درگاه پرداخت", icon: Server, status: "offline" },
]

export function SystemStatusWidget() {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <h2 className="font-bold text-slate-700 mb-4">وضعیت سیستم</h2>
      <ul className="space-y-3">
        {services.map((srv, i) => {
          const Icon = srv.icon
          const color = srv.status === "active" ? "text-emerald-500" : srv.status === "warning" ? "text-amber-500" : "text-red-500"
          const text = srv.status === "active" ? "فعال" : srv.status === "warning" ? "کند" : "غیرفعال"
          return (
            <li key={i} className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Icon size={18} className={color} />
                <span className="text-sm font-medium text-slate-700">{srv.name}</span>
              </div>
              <span className={`text-xs font-bold ${color}`}>{text}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
