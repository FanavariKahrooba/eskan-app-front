import type { PageShellModuleConfig } from './page-shell-types'
import { pageShellRegistry } from './page-shell-registry'

export function hasRequiredPermissions(
    userPermissions: string[] = [],
    requiredPermissions: string[] = []
) {
    if (!requiredPermissions.length) return true
    return requiredPermissions.every((permission) =>
        userPermissions.includes(permission)
    )
}

export function filterModulesByPermissions(
    modules: PageShellModuleConfig[],
    userPermissions: string[] = []
) {
    return modules.filter((module) => {
        const definition = pageShellRegistry.resolve(module)

        const modulePermissions = module.permissions ?? []
        const definitionPermissions = definition?.permissions ?? []

        return (
            hasRequiredPermissions(userPermissions, modulePermissions) &&
            hasRequiredPermissions(userPermissions, definitionPermissions)
        )
    })
}
