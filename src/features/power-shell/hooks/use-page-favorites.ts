"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "console:favorites";

export function usePageFavorites(page: string) {
    const [favorites, setFavorites]: any = useState<string[]>([]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setFavorites(parsed);
            }
        } catch {
            setFavorites([]);
        }
    }, []);

    const isFavorite = useMemo(() => {
        return favorites.includes(page);
    }, [favorites, page]);

    const toggleFavorite = () => {
        setFavorites((prev) => {
            const next = prev.includes(page)
                ? prev.filter((item) => item !== page)
                : [...prev, page];

            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    };

    return {
        isFavorite,
        favorites,
        toggleFavorite,
    };
}
