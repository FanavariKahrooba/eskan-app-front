import type { PageShellModuleConfig } from './page-shell-types'

export const SHELL_SIZE_ORDER = ['sm', 'md', 'lg', 'xl', 'full'] as const

export const SHELL_SIZE_CLASSES: Record<
    PageShellModuleConfig['size'],
    string
> = {
    sm: 'col-span-1',
    md: 'col-span-1 md:col-span-2',
    lg: 'col-span-1 md:col-span-2 xl:col-span-3',
    xl: 'col-span-1 md:col-span-2 xl:col-span-4',
    full: 'col-span-1 md:col-span-2 xl:col-span-6',
}

export function getNextShellSize(
    current: PageShellModuleConfig['size']
): PageShellModuleConfig['size'] {
    const order = [...SHELL_SIZE_ORDER]
    const currentIndex = order.indexOf(current)
    return order[(currentIndex + 1) % order.length]
}

export function getPreviousShellSize(
    current: PageShellModuleConfig['size']
): PageShellModuleConfig['size'] {
    const order = [...SHELL_SIZE_ORDER]
    const currentIndex = order.indexOf(current)
    return currentIndex === 0 ? order[order.length - 1] : order[currentIndex - 1]
}
