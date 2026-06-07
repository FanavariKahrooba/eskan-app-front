import { create } from "zustand"

interface ColorProjectState {
    current: any
    history: any[]
    future: any[]

    setState: (newState: any) => void
    undo: () => void
    redo: () => void

    saveProject: () => void
    loadProject: (data: any) => void
}

export const useColorProject = create<ColorProjectState>((set, get) => ({

    current: {
        baseColor: "#6366f1",
        gradient: [],
        palette: [],
    },

    history: [],
    future: [],

    setState: (newState) => {
        const { current, history } = get()

        set({
            current: newState,
            history: [...history, current],
            future: []
        })
    },

    undo: () => {
        const { history, current, future } = get()
        if (!history.length) return

        const prev = history[history.length - 1]

        set({
            current: prev,
            history: history.slice(0, -1),
            future: [current, ...future]
        })
    },

    redo: () => {
        const { future, current, history } = get()
        if (!future.length) return

        const next = future[0]

        set({
            current: next,
            history: [...history, current],
            future: future.slice(1)
        })
    },

    saveProject: () => {
        const { current } = get()
        localStorage.setItem("color-project", JSON.stringify(current))
    },

    loadProject: (data) => {
        set({
            current: data,
            history: [],
            future: []
        })
    }

}))
