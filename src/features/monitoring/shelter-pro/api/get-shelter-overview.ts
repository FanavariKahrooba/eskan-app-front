import { ShelterOverviewResponse, ShelterOverviewData } from "../types/shelter-overview.types";

export interface ShelterOverviewFilters {
    hall_id?: number;
    region_id?: number;
    district_id?: number;
    top?: number;
    recent_requests?: number;
    capacity_logs?: number;
}

export async function getShelterOverview(
    filters: ShelterOverviewFilters = {}
): Promise<ShelterOverviewData> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.set(key, String(value));
        }
    });

    const query = params.toString();
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/shelter/overview${query ? `?${query}` : ""}`;

    const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch shelter monitoring overview");
    }

    const json: ShelterOverviewResponse = await res.json();
    return json.data;
}
