export type MonitoringSeverity = "info" | "warning" | "critical";

export interface ShelterOverviewResponse {
    success: boolean;
    generated_at: string;
    data: ShelterOverviewData;
}

export interface ShelterOverviewData {
    kpis: {
        total_halls: number;
        enabled_halls: number;
        active_profiles: number;

        total_spaces: number;
        active_spaces: number;
        reservable_spaces: number;

        total_capacity: number;
        usable_capacity: number;
        reserved_capacity: number;
        occupied_capacity: number;
        available_capacity: number;
        emergency_capacity: number;

        used_capacity: number;
        usage_rate: number;
        occupancy_rate: number;

        active_requests: number;
        active_reservations: number;
    };

    capacity_breakdown: {
        key: "available" | "reserved" | "occupied" | "emergency";
        label: string;
        value: number;
    }[];

    reservation_statuses: {
        key: string;
        label: string;
        value: number;
    }[];

    request_statuses: {
        key: string;
        label: string;
        value: number;
    }[];

    request_priorities: {
        key: string;
        label: string;
        value: number;
    }[];

    request_types: {
        key: string;
        label: string;
        value: number;
    }[];

    space_types: {
        key: string;
        label: string;
        value: number;
        capacity: number;
        available_capacity: number;
        reserved_capacity: number;
        occupied_capacity: number;
    }[];

    top_shelters: {
        id: number;
        neighborhood_hall_id: number;
        name: string | null;
        hall_code: string | null;
        number: string | number | null;
        is_shelter_enabled: boolean;
        is_active: boolean;
        total_capacity: number;
        usable_capacity: number;
        reserved_capacity: number;
        occupied_capacity: number;
        available_capacity: number;
        emergency_capacity: number;
        usage_rate: number;
        occupancy_rate: number;
    }[];

    alerts: {
        type: string;
        severity: MonitoringSeverity;
        title: string;
        message: string;
        neighborhood_hall_id?: number | null;
        shelter_space_id?: number | null;
        value?: number;
    }[];

    recent_requests: {
        id: number;
        request_number: string;
        neighborhood_hall_id: number;
        hall_name: string | null;
        hall_code: string | null;
        preferred_space_id: number | null;
        preferred_space_name: string | null;
        applicant_name: string | null;
        applicant_mobile: string | null;
        household_size: number;
        request_type: string;
        request_type_label: string;
        priority_level: string;
        priority_label: string;
        status: string;
        status_label: string;
        requested_from: string | null;
        requested_until: string | null;
        created_at: string | null;
    }[];

    capacity_logs: {
        id: number;
        neighborhood_hall_id: number;
        hall_name: string | null;
        hall_code: string | null;
        shelter_space_id: number | null;
        space_name: string | null;
        space_code: string | null;
        user_id: number | null;
        user_name: string | null;
        action_type: string;
        action_label: string;
        before_total_capacity: number;
        after_total_capacity: number;
        before_available_capacity: number;
        after_available_capacity: number;
        before_reserved_capacity: number;
        after_reserved_capacity: number;
        before_occupied_capacity: number;
        after_occupied_capacity: number;
        delta_available: number;
        delta_reserved: number;
        delta_occupied: number;
        reason: string | null;
        payload: Record<string, unknown> | null;
        created_at: string | null;
    }[];

    filters: {
        hall_id: number | null;
        region_id: number | null;
        district_id: number | null;
        top: number;
        recent_requests: number;
        capacity_logs: number;
    };
}
