export type AuditActionType =
    | "page.view"
    | "page.preference.update"
    | "page.preference.reset"
    | "action.click"
    | "data.export"
    | "data.create"
    | "data.update"
    | "data.delete"
    | `delivery.zone.${string}`
    | `${string}.${string}.${string}`
    | `${string}.${string}`;

export interface AuditLogEvent {
    type: AuditActionType;
    pageKey?: string;
    userId?: string;
    message?: string;
    metadata?: Record<string, unknown>;
    createdAt?: string;
}
