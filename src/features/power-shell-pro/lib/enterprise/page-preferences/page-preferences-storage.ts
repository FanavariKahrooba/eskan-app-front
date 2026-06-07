"use client";

import type { PagePreferencesStorageAdapter } from "./page-preferences-types";
import { LocalPagePreferencesAdapter } from "./local-page-preferences-adapter";
// import { ApiPagePreferencesAdapter } from "./api-page-preferences-adapter";

let adapter: PagePreferencesStorageAdapter = new LocalPagePreferencesAdapter();

/**
 * اگر بعدا خواستی به دیتابیس وصل کنی:
 *
 * setPagePreferencesAdapter(
 *   new ApiPagePreferencesAdapter({
 *     baseUrl: "/api/page-preferences",
 *     getAccessToken: () => token,
 *   })
 * );
 */
export function setPagePreferencesAdapter(
    nextAdapter: PagePreferencesStorageAdapter
) {
    adapter = nextAdapter;
}

export function getPagePreferencesAdapter() {
    return adapter;
}
