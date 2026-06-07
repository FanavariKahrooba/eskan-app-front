"use client";

import { Star } from "lucide-react";
import { usePageFavorites } from "../../hooks/use-page-favorites";


export default function FavoriteButton({ page }: { page: string }) {
  const { isFavorite, toggleFavorite } = usePageFavorites(page);

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      aria-label={
        isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
      }
      title={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-yellow-500"
    >
      <Star
        size={16}
        className={isFavorite ? "fill-yellow-400 text-yellow-400" : ""}
      />
    </button>
  );
}
