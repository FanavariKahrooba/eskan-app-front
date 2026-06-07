"use client";

import { useEffect } from "react";

type ShortcutHandler = (event: KeyboardEvent) => void;

interface ShortcutOptions {
    ctrl?: boolean;
    meta?: boolean;
    shift?: boolean;
    alt?: boolean;
    key: string;
    enabled?: boolean;
}

export function useKeyboardShortcut(
    options: ShortcutOptions,
    handler: ShortcutHandler
) {
    const {
        ctrl = false,
        meta = false,
        shift = false,
        alt = false,
        key,
        enabled = true,
    } = options;

    useEffect(() => {
        if (!enabled) return;

        const listener = (event: KeyboardEvent) => {
            const keyMatches = event.key.toLowerCase() === key.toLowerCase();

            if (!keyMatches) return;
            if (ctrl && !event.ctrlKey) return;
            if (meta && !event.metaKey) return;
            if (shift && !event.shiftKey) return;
            if (alt && !event.altKey) return;

            handler(event);
        };

        window.addEventListener("keydown", listener);
        return () => window.removeEventListener("keydown", listener);
    }, [ctrl, meta, shift, alt, key, enabled, handler]);
}
