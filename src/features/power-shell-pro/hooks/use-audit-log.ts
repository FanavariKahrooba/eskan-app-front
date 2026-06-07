"use client";

import { useCallback } from "react";
import { AuditLogEvent } from "../lib/enterprise/audit/audit-types";
import { auditClient } from "../lib/enterprise/audit/audit-client";


interface UseAuditLogOptions {
    pageKey?: string;
    userId?: string;
}

export function useAuditLog(options: UseAuditLogOptions = {}) {
    const track = useCallback(
        async (event: Omit<AuditLogEvent, "pageKey" | "userId">) => {
            try {
                await auditClient.track({
                    ...event,
                    pageKey: options.pageKey,
                    userId: options.userId,
                });
            } catch (error) {
                console.error("Audit log failed:", error);
            }
        },
        [options.pageKey, options.userId]
    );

    return {
        track,
    };
}
