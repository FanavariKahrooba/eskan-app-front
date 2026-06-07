import { Activity } from "lucide-react"

export default function RecentActivity() {
  const logs = ["کاربر جدید ایجاد شد", "گزارش ماهانه تولید شد", "تنظیمات سیستم بروزرسانی شد"]

  return (
    <div className="bg-white border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={18} />
        <h3 className="font-bold text-gray-800">فعالیت‌های اخیر</h3>
      </div>

      <div className="space-y-2">
        {logs.map((l, i) => (
          <div key={i} className="text-sm text-gray-600 p-2 border-b last:border-0">
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}
