"use client"

import { create } from "zustand"

export type ModifierOption = {
    id: string
    name: string
    price?: number
}

export type ModifierGroup = {
    id: string
    name: string
    required?: boolean
    multiple?: boolean
    options: ModifierOption[]
}

export type Product = {
    id: string
    name: string
    price: number
    category: string
    image?: string
    description?: string
    modifiers?: ModifierGroup[]
}

export type CartItem = {
    id: string
    name: string
    price: number
    image?: string
    qty: number
    modifiers?: ModifierOption[]
}

export type OrderTab = {
    id: string
    title: string
    type: "table" | "takeaway" | "delivery"
    items: CartItem[]
}

type PosState = {
    products: Product[]
    tabs: OrderTab[]
    activeTab: string

    addToCart: (product: Product, modifiers?: ModifierOption[]) => void
    removeFromCart: (id: string) => void

    createTab: (title: string, type: OrderTab["type"]) => void
    setActiveTab: (id: string) => void
}

export const usePosStore = create<PosState>((set, get) => ({
    activeTab: "1",

    tabs: [
        {
            id: "1",
            title: "میز ۱",
            type: "table",
            items: [],
        },
    ],

    products: [
        {
            id: "1",
            name: "برگر کلاسیک",
            price: 180000,
            category: "برگر",
            image: "/assets/images/burger.jpg",
            description: "برگر مخصوص با گوشت آبدار",
            modifiers: [
                {
                    id: "cheese",
                    name: "پنیر اضافه",
                    multiple: true,
                    options: [
                        { id: "c1", name: "چدار", price: 20000 },
                        { id: "c2", name: "موزارلا", price: 25000 },
                    ],
                },
            ],
        },
        {
            id: "2",
            name: "پیتزا پپرونی",
            price: 260000,
            category: "پیتزا",
            image: "/images/pizza.jpg",
            description: "پیتزا ترد با پپرونی",
        },
        {
            id: "3",
            name: "سیب زمینی",
            price: 90000,
            category: "پیش غذا",
            image: "/images/fries.jpg",
        },
    ],

    addToCart: (product, modifiers = []) => {
        const { tabs, activeTab } = get()

        const tabIndex = tabs.findIndex((t) => t.id === activeTab)
        const tab = tabs[tabIndex]

        const existing = tab.items.find((i) => i.id === product.id)

        let updatedItems

        if (existing) {
            updatedItems = tab.items.map((i) =>
                i.id === product.id ? { ...i, qty: i.qty + 1 } : i
            )
        } else {
            updatedItems = [
                ...tab.items,
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    qty: 1,
                    modifiers,
                },
            ]
        }

        const updatedTabs = [...tabs]
        updatedTabs[tabIndex] = { ...tab, items: updatedItems }

        set({ tabs: updatedTabs })
    },

    removeFromCart: (id) => {
        const { tabs, activeTab } = get()

        const tabIndex = tabs.findIndex((t) => t.id === activeTab)
        const tab = tabs[tabIndex]

        const updatedTabs = [...tabs]

        updatedTabs[tabIndex] = {
            ...tab,
            items: tab.items.filter((i) => i.id !== id),
        }

        set({ tabs: updatedTabs })
    },

    createTab: (title, type) => {
        const newTab: OrderTab = {
            id: Date.now().toString(),
            title,
            type,
            items: [],
        }

        set((state) => ({
            tabs: [...state.tabs, newTab],
            activeTab: newTab.id,
        }))
    },

    setActiveTab: (id) => set({ activeTab: id }),
}))
