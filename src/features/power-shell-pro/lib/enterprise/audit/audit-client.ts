"use client";

import type { AuditLogEvent } from "./audit-types";

type AuditTransport = "console" | "api";

interface AuditClientOptions {
    transport?: AuditTransport;
    endpoint?: string;
    getAccessToken?: () => string | Promise<string | null> | null;
}

class AuditClient {
    private transport: AuditTransport;
    private endpoint: string;
    private getAccessToken?: AuditClientOptions["getAccessToken"];

    constructor(options: AuditClientOptions = {}) {
        this.transport = options.transport || "console";
        this.endpoint = options.endpoint || "/api/audit-log";
        this.getAccessToken = options.getAccessToken;
    }

    configure(options: AuditClientOptions) {
        if (options.transport) this.transport = options.transport;
        if (options.endpoint) this.endpoint = options.endpoint;
        if (options.getAccessToken) this.getAccessToken = options.getAccessToken;
    }

    async track(event: AuditLogEvent) {
        const payload: AuditLogEvent = {
            ...event,
            createdAt: event.createdAt || new Date().toISOString(),
        };

        if (this.transport === "console") {
            console.info("[Audit]", payload);
            return;
        }

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        const token = await this.getAccessToken?.();

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        await fetch(this.endpoint, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });
    }
}

export const auditClient = new AuditClient();
