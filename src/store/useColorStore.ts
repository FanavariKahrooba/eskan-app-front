import { create } from "zustand"

export const useColorStore = create((set) => ({
    color: "#6366f1",
    setColor: (c: any) => set({ color: c }),

    gradientStops: [
        { id: 1, color: "#6366f1", pos: 0 },
        { id: 2, color: "#ec4899", pos: 100 },
    ],

    setGradientStops: (stops: any) => set({ gradientStops: stops }),

    angle: 45,
    setAngle: (a: any) => set({ angle: a }),
}))
