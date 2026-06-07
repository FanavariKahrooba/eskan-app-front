export type ShelterStatus = "active" | "inactive" | "maintenance";

export type ShelterSpaceType =
    | "room"
    | "hall"
    | "bed"
    | "family_room"
    | "emergency";

export type ShelterRequestStatus =
    | "pending"
    | "approved"
    | "rejected"
    | "reserved"
    | "cancelled";

export type ShelterReservationStatus =
    | "reserved"
    | "checked_in"
    | "checked_out"
    | "cancelled"
    | "expired";

export type ShelterProfile = {
    id: number | string;
    neighborhood_hall_id?: number | string;
    title: string;
    manager_name?: string;
    manager_mobile?: string;
    region_name?: string;
    district_name?: string;
    neighborhood_hall_name?: string;
    address?: string;
    status: ShelterStatus;
    total_capacity: number;
    occupied_capacity: number;
    available_capacity: number;
    created_at?: string;
    updated_at?: string;
};

export type ShelterSpace = {
    id: number | string;
    shelter_profile_id: number | string;
    shelter_title?: string;
    title: string;
    type: ShelterSpaceType;
    capacity: number;
    occupied_capacity: number;
    available_capacity: number;
    status: ShelterStatus;
    description?: string;
    created_at?: string;
    updated_at?: string;
};

export type ShelterRequest = {
    id: number | string;
    user_id?: number | string;
    user_name?: string;
    user_mobile?: string;
    shelter_profile_id?: number | string;
    shelter_title?: string;
    requested_capacity: number;
    from_date?: string;
    to_date?: string;
    status: ShelterRequestStatus;
    reason?: string;
    admin_note?: string;
    created_at?: string;
    updated_at?: string;
};

export type ShelterReservation = {
    id: number | string;
    shelter_request_id?: number | string;
    shelter_profile_id: number | string;
    shelter_space_id?: number | string;
    shelter_title?: string;
    space_title?: string;
    user_name?: string;
    user_mobile?: string;
    capacity: number;
    status: ShelterReservationStatus;
    check_in_at?: string;
    check_out_at?: string;
    cancelled_at?: string;
    created_at?: string;
};

export type ShelterDashboard = {
    profiles_count: number;
    active_profiles_count: number;
    spaces_count: number;
    total_capacity: number;
    occupied_capacity: number;
    available_capacity: number;
    pending_requests_count: number;
    approved_requests_count: number;
    active_reservations_count: number;
    checked_in_count: number;
    cancelled_reservations_count: number;
};

export type PaginatedResponse<T> = {
    data: T[];
    meta?: {
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
    };
    links?: unknown;
};

export type ApiResponse<T> = {
    data: T;
    message?: string;
};


export type ShelterCategoryStatus = "active" | "inactive";

export interface ShelterCategory {
    id: string | number;
    title: string;
    code?: string | null;
    description?: string | null;
    status: ShelterCategoryStatus;
    shelters_count?: number;
    spaces_count?: number;
    created_at?: string | null;
    updated_at?: string | null;
}

export type ShelterFacilityStatus = "active" | "inactive" | "maintenance";

export interface ShelterFacility {
    id: string | number;
    title: string;
    code?: string | null;
    category?: string | null;
    description?: string | null;
    status: ShelterFacilityStatus;
    shelters_count?: number;
    is_required?: boolean;
    created_at?: string | null;
    updated_at?: string | null;
}

export type CapacityRuleStatus = "active" | "inactive";

export type CapacityRuleScope = "global" | "shelter" | "space" | "category";

export interface ShelterCapacityRule {
    id: string | number;
    title: string;
    code?: string | null;
    scope: CapacityRuleScope;
    status: CapacityRuleStatus;
    max_capacity?: number | null;
    min_capacity?: number | null;
    reserve_buffer?: number | null;
    gender_policy?: "male" | "female" | "family" | "any" | null;
    description?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}