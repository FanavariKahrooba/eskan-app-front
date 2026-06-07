import { create } from "zustand"

interface SidebarState {
    activeMenu: string | null
    setActiveMenu: (id: string | null) => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
    activeMenu: null,
    setActiveMenu: (id) => set({ activeMenu: id }),
}))