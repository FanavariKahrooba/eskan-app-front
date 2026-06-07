import { create } from "zustand"

export const useCommandStore = create((set: any) => ({
    open: false,
    setOpen: (value: any) => set({ open: value })
}))
