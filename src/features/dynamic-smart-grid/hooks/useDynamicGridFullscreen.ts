'use client'
import { useState } from "react";

export function useDynamicGridFullscreen() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        setIsFullscreen((prev) => !prev);
    };

    return {
        isFullscreen,
        setIsFullscreen,
        toggleFullscreen,
    };
}
