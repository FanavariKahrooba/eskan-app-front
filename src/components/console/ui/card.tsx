export default function DashboardCards() {
  const cards = [
    { title: "Total Sales", value: "$12,540" },
    { title: "Orders", value: "320" },
    { title: "Visitors", value: "8,210" },
    { title: "Conversion", value: "4.3%" },
  ]

  return (
    <div className="grid grid-cols-4 gap-6">
      {cards.map((card) => (
        <div key={card.title} className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-500">{card.title}</div>

          <div className="text-2xl font-semibold mt-2">{card.value}</div>
        </div>
      ))}
    </div>
  )
}
