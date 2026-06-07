"use client";

import { useCallback, useEffect, useState } from "react";

export function useMonitoringFullscreen(targetId?: string) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const getTarget = useCallback(() => {
        if (typeof document === "undefined") return null;
        if (!targetId) return document.documentElement;
        return document.getElementById(targetId) ?? document.documentElement;
    }, [targetId]);

    const enter = useCallback(async () => {
        const target = getTarget();
        if (!target?.requestFullscreen) return;
        await target.requestFullscreen();
    }, [getTarget]);

    const exit = useCallback(async () => {
        if (typeof document === "undefined" || !document.fullscreenElement) return;
        await document.exitFullscreen();
    }, []);

    const toggle = useCallback(async () => {
        if (document.fullscreenElement) {
            await exit();
        } else {
            await enter();
        }
    }, [enter, exit]);

    useEffect(() => {
        const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
        handler();
        document.addEventListener("fullscreenchange", handler);
        return () => document.removeEventListener("fullscreenchange", handler);
    }, []);

    return {
        isFullscreen,
        enter,
        exit,
        toggle,
    };
}
