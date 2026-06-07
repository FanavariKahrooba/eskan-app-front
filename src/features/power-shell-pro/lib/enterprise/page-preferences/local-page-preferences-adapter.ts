"use client";

import type {
    PagePreferencesStorageAdapter,
    PagePreferencesRecord,
    PagePreferencesValue,
} from "./page-preferences-types";

const STORAGE_PREFIX = "console:page-preferences";

function getStorageKey(pageKey: string, userId?: string) {
    return `${STORAGE_PREFIX}:${userId || "anonymous"}:${pageKey}`;
}

export class LocalPagePreferencesAdapter
    implements PagePreferencesStorageAdapter {
    async getPreferences(params: {
        pageKey: string;
        userId?: string;
    }): Promise<PagePreferencesValue | null> {
        if (typeof window === "undefined") return null;

        try {
            const key = getStorageKey(params.pageKey, params.userId);
            const raw = window.localStorage.getItem(key);

            if (!raw) return null;

            const parsed = JSON.parse(raw) as PagePreferencesRecord;

            return parsed.value || null;
        } catch {
            return null;
        }
    }

    async setPreferences(params: {
        pageKey: string;
        userId?: string;
        value: PagePreferencesValue;
    }): Promise<void> {
        if (typeof window === "undefined") return;

        const key = getStorageKey(params.pageKey, params.userId);

        const record: PagePreferencesRecord = {
            pageKey: params.pageKey,
            userId: params.userId,
            value: params.value,
            updatedAt: new Date().toISOString(),
        };

        window.localStorage.setItem(key, JSON.stringify(record));
    }

    async resetPreferences(params: {
        pageKey: string;
        userId?: string;
    }): Promise<void> {
        if (typeof window === "undefined") return;

        const key = getStorageKey(params.pageKey, params.userId);
        window.localStorage.removeItem(key);
    }
}
