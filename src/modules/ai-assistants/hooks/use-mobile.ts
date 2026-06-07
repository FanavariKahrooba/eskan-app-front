"use client";

import { useEffect, useState } from "react";

export function useMobile(breakpoint = 1024) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

        const handleChange = () => setIsMobile(media.matches);
        handleChange();

        media.addEventListener("change", handleChange);
        return () => media.removeEventListener("change", handleChange);
    }, [breakpoint]);

    return isMobile;
}
