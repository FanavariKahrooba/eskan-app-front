import { Users, DollarSign, ShoppingCart, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "کل کاربران",
    value: "1,245",
    icon: Users,
    change: "+12%",
  },

  {
    title: "فروش امروز",
    value: "$4,320",
    icon: DollarSign,
    change: "+8%",
  },

  {
    title: "سفارش‌ها",
    value: "342",
    icon: ShoppingCart,
    change: "+4%",
  },

  {
    title: "رشد فروش",
    value: "18%",
    icon: TrendingUp,
    change: "+2%",
  },
]

export default function StatsCards() {
  return (
    <div className="grid grid-cols-4 gap-6">
      {stats.map((s, i) => {
        const Icon = s.icon

        return (
          <div
            key={i}
            className="
      bg-white
      border
      border-gray-200
      rounded-xl
      p-5
      flex
      justify-between
      "
          >
            <div>
              <p className="text-sm text-gray-500">{s.title}</p>

              <p className="text-2xl font-semibold mt-2">{s.value}</p>

              <span className="text-green-600 text-sm">{s.change}</span>
            </div>

            <div
              className="
      w-10 h-10
      bg-gray-100
      rounded-lg
      flex
      items-center
      justify-center
      "
            >
              <Icon size={18} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
