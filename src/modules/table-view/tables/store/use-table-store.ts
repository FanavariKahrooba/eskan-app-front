"use client"

import { create } from "zustand"

export type TableStatus =
    | "free"
    | "seated"
    | "ordering"
    | "served"
    | "payment"

export type Table = {
    id: string
    name: string
    capacity: number
    status: TableStatus
    x: number
    y: number
    total?: number
    startedAt?: number
}

type TableState = {
    tables: Table[]

    seatTable: (id: string) => void
    freeTable: (id: string) => void
    updateStatus: (id: string, status: TableStatus) => void
}

export const useTableStore = create<TableState>((set) => ({
    tables: [
        {
            id: "1",
            name: "میز ۱",
            capacity: 4,
            status: "free",
            x: 100,
            y: 120,
        },
        {
            id: "2",
            name: "میز ۲",
            capacity: 2,
            status: "ordering",
            x: 320,
            y: 200,
            total: 420000,
        },
        {
            id: "3",
            name: "میز ۳",
            capacity: 6,
            status: "served",
            x: 520,
            y: 110,
            total: 760000,
        },
    ],

    seatTable: (id) =>
        set((state) => ({
            tables: state.tables.map((t) =>
                t.id === id
                    ? { ...t, status: "seated", startedAt: Date.now() }
                    : t
            ),
        })),

    freeTable: (id) =>
        set((state) => ({
            tables: state.tables.map((t) =>
                t.id === id
                    ? { ...t, status: "free", total: 0, startedAt: undefined }
                    : t
            ),
        })),

    updateStatus: (id, status) =>
        set((state) => ({
            tables: state.tables.map((t) =>
                t.id === id ? { ...t, status } : t
            ),
        })),
}))
