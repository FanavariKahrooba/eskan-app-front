"use client"

import { useState } from "react"
import { Star } from "lucide-react"

export default function FavoriteButton({ page }: { page: string }) {
  const [fav, setFav] = useState(false)

  return (
    <button onClick={() => setFav(!fav)} className="text-gray-400 hover:text-yellow-500 transition">
      <Star size={16} className={fav ? "fill-yellow-400 text-yellow-400" : ""} />
    </button>
  )
}
