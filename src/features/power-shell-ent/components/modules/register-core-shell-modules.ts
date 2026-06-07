'use client'

import { pageShellRegistry } from '../page-shell/page-shell-registry'
import { coreShellModules } from './core-shell-modules'

let registered = false

export function registerCoreShellModules() {
    if (registered) return

    pageShellRegistry.registerMany(coreShellModules)

    registered = true
}
