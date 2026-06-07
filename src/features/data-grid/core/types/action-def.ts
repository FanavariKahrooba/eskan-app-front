export type ActionPermissionEvaluator<TRow = unknown> =
    | boolean
    | ((row?: TRow) => boolean);

export interface ActionDef<TRow = unknown> {
    id: string;
    label?: string;
    permission?: ActionPermissionEvaluator<TRow>;
}
