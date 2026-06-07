import { Megaphone } from "lucide-react"

export default function Announcements() {
  const items = [
    {
      title: "بروزرسانی سیستم",
      desc: "نسخه جدید سیستم فردا منتشر می‌شود.",
      date: "امروز",
    },
    {
      title: "نگهداری سرور",
      desc: "شنبه ساعت ۲۳ سرویس موقتاً قطع می‌شود.",
      date: "۲ روز دیگر",
    },
  ]

  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Megaphone size={18} />
        <h3 className="font-bold text-gray-800">تابلو اعلانات</h3>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="p-3 rounded-xl hover:bg-gray-50 border border-gray-100">
            <div className="flex justify-between">
              <div className="font-medium text-sm">{item.title}</div>
              <div className="text-xs text-gray-400">{item.date}</div>
            </div>
            <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
