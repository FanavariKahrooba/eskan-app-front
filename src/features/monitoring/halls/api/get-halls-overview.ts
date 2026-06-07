import { HallsOverviewResponse } from "../types/halls-overview.types";

export interface HallsOverviewFilters {
    region_id?: number | null;
    district_id?: number | null;
    top?: number | null;
}

export async function getHallsOverview(
    filters: HallsOverviewFilters = {}
): Promise<HallsOverviewResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.set(key, String(value));
        }
    });

    const query = params.toString();

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/halls/overview${query ? `?${query}` : ""}`,
        {
            method: "GET",
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch halls monitoring overview");
    }

    return res.json();
}
