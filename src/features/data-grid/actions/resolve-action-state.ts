export interface ResolvableActionState<TContext = unknown> {
    hidden?: boolean | ((context: TContext) => boolean);
    disabled?: boolean | ((context: TContext) => boolean);
    loading?: boolean | ((context: TContext) => boolean);
    requireSelection?: boolean;
}

export interface ResolvedActionState {
    hidden: boolean;
    disabled: boolean;
    loading: boolean;
}

function resolveBoolean<TContext>(
    value: boolean | ((context: TContext) => boolean) | undefined,
    context: TContext,
    fallback = false,
): boolean {
    if (typeof value === 'function') {
        return Boolean(value(context));
    }

    if (typeof value === 'boolean') {
        return value;
    }

    return fallback;
}

export function resolveActionState<TContext extends Record<string, any>>(
    action: ResolvableActionState<TContext>,
    context: TContext,
): ResolvedActionState {
    const hidden = resolveBoolean(action.hidden, context);
    const loading = resolveBoolean(action.loading, context);

    let disabled = resolveBoolean(action.disabled, context);

    if (
        action.requireSelection &&
        Array.isArray(context.selectedRowIds) &&
        context.selectedRowIds.length === 0
    ) {
        disabled = true;
    }

    return {
        hidden,
        disabled,
        loading,
    };
}
