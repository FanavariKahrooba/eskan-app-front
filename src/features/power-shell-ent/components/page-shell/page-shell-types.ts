import type { ReactNode } from 'react'

export type ShellItemSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type ShellSectionKey = 'header' | 'main' | 'sidebar' | 'footer'

export interface PageShellModuleConfig<TSettings = Record<string, any>> {
    id: string
    type: string
    title: string
    description?: string
    pageKey: string
    section?: ShellSectionKey
    size: ShellItemSize
    order: number
    hidden?: boolean
    static?: boolean
    permissions?: string[]
    settings?: TSettings
    metadata?: Record<string, any>
}

export interface PageShellModuleDefinition<
    TSettings = Record<string, any>,
    TContext = any,
> {
    type: string
    title: string
    description?: string
    defaultSize: ShellItemSize
    defaultSection?: ShellSectionKey
    minSize?: ShellItemSize
    maxSize?: ShellItemSize
    permissions?: string[]
    className?: string
    render: (params: {
        module: PageShellModuleConfig<TSettings>
        context?: TContext
    }) => ReactNode
}

export interface PageShellLayout {
    pageKey: string
    modules: PageShellModuleConfig[]
}

export interface PageShellHeaderAction {
    key: string
    label: string
    icon?: ReactNode
    onClick?: () => void
    variant?: 'default' | 'primary' | 'danger'
}

export interface DynamicPageShellProps<TContext = any> {
    pageKey: string
    title: string
    description?: string
    modules: PageShellModuleConfig[]
    onModulesChange: (modules: PageShellModuleConfig[]) => void
    context?: TContext
    className?: string
    contentClassName?: string
    allowDrag?: boolean
    allowResize?: boolean
    allowHide?: boolean
    allowReset?: boolean
    permissions?: string[]
    actions?: PageShellHeaderAction[]
    emptyState?: ReactNode
    loading?: boolean
    auditKey?: string
}
