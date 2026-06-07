// FieldRegistry.ts
//-------------------------------------------
//  Field Registry
//-------------------------------------------

import { ComponentType } from "react"

type Registry = Record<string, ComponentType<any>>

const registry: Registry = {}

export function registerField(type: string, component: ComponentType<any>) {
    registry[type] = component
}

export function getField(type: string) {
    return registry[type]
}

export function getAllFields() {
    return registry
}
