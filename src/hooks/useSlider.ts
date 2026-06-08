// components/hero/useSlider.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useSlider(length: number, interval = 6000) {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const timer = useRef<ReturnType<typeof setInterval> | null>(null);

    const go = useCallback(
        (i: number) => setIndex(((i % length) + length) % length),
        [length],
    );
    const next = useCallback(() => go(index + 1), [go, index]);
    const prev = useCallback(() => go(index - 1), [go, index]);

    useEffect(() => {
        if (paused || length <= 1) return;
        timer.current = setInterval(() => setIndex((i) => (i + 1) % length), interval);
        return () => {
            if (timer.current) clearInterval(timer.current);
        };
    }, [paused, length, interval, index]);

    // pause وقتی تب پنهان است
    useEffect(() => {
        const onVis = () => setPaused(document.hidden);
        document.addEventListener("visibilitychange", onVis);
        return () => document.removeEventListener("visibilitychange", onVis);
    }, []);

    return { index, next, prev, go, setPaused, paused };
}
