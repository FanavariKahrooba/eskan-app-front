export type ApiPaginationMeta = {
    current_page?: number;
    from?: number;
    last_page?: number;
    links?: unknown[];
    path?: string;
    per_page?: number;
    to?: number;
    total?: number;
};

export type ApiCollectionResponse<T> = {
    data: T[];
    meta?: ApiPaginationMeta;
    links?: Record<string, string | null>;
};

export type ApiSingleResponse<T> = {
    status: string;
    data: T;
};

export type NeighborhoodHallListItem = {
    id: number;
    name: string;
    user?: string | null;
    phone_number?: string | null;
    created_at?: string | null;
};

export type NeighborhoodHallInfo = {
    id?: number;
    neighborhood_hall_id?: number;
    staff_count?: number | null;
    insurance?: string | null;
    has_workshop?: boolean | number | null;
    area_land?: number | string | null;
    area_building?: number | string | null;
    has_study_hall?: boolean | number | null;
    has_theater?: boolean | number | null;
    theater_capacity?: number | null;
    has_gym?: boolean | number | null;
    has_preschool?: boolean | number | null;
    contact_number?: string | null;
};

export type NeighborhoodHallDetail = {
    id: number;
    name: string;
    name_en?: string | null;
    slug?: string | null;
    slug_en?: string | null;
    description?: string | null;
    short_description?: string | null;
    popup_desc?: string | null;
    lat?: number | string | null;
    lng?: number | string | null;
    image?: string | null;
    site_address?: string | null;
    address?: string | null;
    phone?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
    meta_keywords?: string | null;
    region_id?: number | null;
    district_id?: number | null;
    manager_id?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
    district?: {
        id: number;
        name: string;
    } | null;
    user?: {
        id?: number;
        name?: string;
        phone_number?: string;
    } | string | null;
    info?: NeighborhoodHallInfo | null;
};

export type NeighborhoodHallDashboard = {
    status: string;
    userCountManager: number;
    NeighborhoodHallCount: number;
};

export type NeighborhoodHallUserOption = {
    id: number;
    name: string;
    phone_number?: string | null;
};

export type NeighborhoodHallDistrictOption = {
    id: number;
    name: string;
};

export type NeighborhoodHallRegionOption = {
    id: number;
    name: string;
};

export type NeighborhoodHallPosition = {
    id: number;
    title: string;
    name?: string;
};

export type EmploymentType = "full_time" | "part_time";

export type NeighborhoodHallEmployee = {
    id: number;
    user_id?: number;
    neighborhood_hall_id?: number;
    nh_position_id?: number;
    employment_type?: EmploymentType | string | null;
    created_at?: string | null;
    updated_at?: string | null;
    position?: NeighborhoodHallPosition | null;
    user?: {
        id: number;
        first_name?: string | null;
        last_name?: string | null;
        name?: string | null;
        phone_number?: string | null;
        email?: string | null;
        employment_type?: string | null;
    } | null;
};

export type NeighborhoodHallEmployeePayload = {
    id?: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    email?: string;
    nh_position_id: number;
    neighborhood_hall_id?: number;
    employment_type?: EmploymentType;
};

export type NeighborhoodHallFormPayload = {
    id?: number;
    create_hall_name: string;
    create_hall_name_en?: string;
    create_hall_description?: string;
    create_hall_short_description?: string;
    create_hall_popup_desc?: string;
    create_hall_coordinates: string;
    create_hall_region?: number | string;
    create_hall_district?: number | string;
    create_hall_user_manager?: number | string;
    create_hall_address?: string;
    create_hall_phone?: string;
    create_hall_cover_image?: File | null;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    staffCount?: number | string;
    insurance?: string;
    hasWorkshop?: "0" | "1" | boolean;
    areaLand?: number | string;
    areaBuilding?: number | string;
    hasStudyHall?: "0" | "1" | boolean;
    hasTheater?: "0" | "1" | boolean;
    theaterCapacity?: number | string;
    hasGym?: "0" | "1" | boolean;
    elevatorCount?: number | string;
};
