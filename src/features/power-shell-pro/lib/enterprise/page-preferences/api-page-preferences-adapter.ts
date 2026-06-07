"use client";

import type {
    PagePreferencesStorageAdapter,
    PagePreferencesValue,
} from "./page-preferences-types";

interface ApiPagePreferencesAdapterOptions {
    baseUrl?: string;
    getAccessToken?: () => string | Promise<string | null> | null;
}

export class ApiPagePreferencesAdapter implements PagePreferencesStorageAdapter {
    private baseUrl: string;
    private getAccessToken?: ApiPagePreferencesAdapterOptions["getAccessToken"];

    constructor(options: ApiPagePreferencesAdapterOptions = {}) {
        this.baseUrl = options.baseUrl || "/api/page-preferences";
        this.getAccessToken = options.getAccessToken;
    }

    private async getHeaders() {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        const token = await this.getAccessToken?.();

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        return headers;
    }

    async getPreferences(params: {
        pageKey: string;
        userId?: string;
    }): Promise<PagePreferencesValue | null> {
        const searchParams = new URLSearchParams();

        searchParams.set("pageKey", params.pageKey);

        if (params.userId) {
            searchParams.set("userId", params.userId);
        }

        const response = await fetch(`${this.baseUrl}?${searchParams.toString()}`, {
            method: "GET",
            headers: await this.getHeaders(),
            cache: "no-store",
        });

        if (response.status === 404) return null;

        if (!response.ok) {
            throw new Error("Failed to load page preferences");
        }

        const data = await response.json();

        return data?.value || null;
    }

    async setPreferences(params: {
        pageKey: string;
        userId?: string;
        value: PagePreferencesValue;
    }): Promise<void> {
        const response = await fetch(this.baseUrl, {
            method: "PUT",
            headers: await this.getHeaders(),
            body: JSON.stringify({
                pageKey: params.pageKey,
                userId: params.userId,
                value: params.value,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to save page preferences");
        }
    }

    async resetPreferences(params: {
        pageKey: string;
        userId?: string;
    }): Promise<void> {
        const response = await fetch(this.baseUrl, {
            method: "DELETE",
            headers: await this.getHeaders(),
            body: JSON.stringify({
                pageKey: params.pageKey,
                userId: params.userId,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to reset page preferences");
        }
    }
}
