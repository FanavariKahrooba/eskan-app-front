export type HallMonitoringSeverity = "info" | "warning" | "critical";

export interface HallsOverviewResponse {
    success: boolean;
    generated_at: string;
    data: HallsOverviewData;
}

export interface HallsOverviewData {
    kpis: {
        total_halls: number;
        active_halls: number;
        inactive_halls: number;

        halls_with_info: number;
        halls_without_info: number;

        halls_with_geo: number;
        halls_with_missing_geo: number;

        halls_with_contact: number;
        halls_with_missing_contact: number;

        halls_with_manager: number;
        halls_without_manager: number;

        shelter_enabled_halls: number;
        halls_with_profile: number;
        halls_without_profile: number;

        total_capacity: number;
        usable_capacity: number;
        available_capacity: number;
        reserved_capacity: number;
        occupied_capacity: number;

        average_usage_rate: number;
        average_occupancy_rate: number;

        critical_halls: number;
        halls_with_programs: number;
    };

    status_breakdown: {
        key: string;
        label: string;
        value: number;
    }[];

    region_breakdown: {
        region_id: number | null;
        region_name: string | null;
        total_halls: number;
        active_halls: number;
        shelter_enabled_halls: number;
        halls_with_info: number;
        total_capacity: number;
        available_capacity: number;
        usage_rate: number;
    }[];

    district_breakdown: {
        district_id: number | null;
        district_name: string | null;
        total_halls: number;
        active_halls: number;
        shelter_enabled_halls: number;
        halls_with_info: number;
        total_capacity: number;
        available_capacity: number;
        usage_rate: number;
    }[];

    facility_breakdown: {
        key: string;
        label: string;
        available: number;
        missing: number;
    }[];

    capacity_distribution: {
        key: string;
        label: string;
        value: number;
    }[];

    top_halls: {
        id: number;
        name: string | null;
        hall_code: string | null;
        status: string | null;
        region_id: number | null;
        region_name: string | null;
        district_id: number | null;
        district_name: string | null;
        manager_id: number | null;
        manager_name: string | null;
        manager_phone: string | null;
        contact_number: string | null;
        has_contact: boolean;
        lat: string | number | null;
        lng: string | number | null;
        has_geo: boolean;
        address: string | null;
        population: number | null;
        property_type: string | null;
        image: string | null;

        has_info: boolean;
        staff_count: number;
        insurance: string | null;
        has_workshop: boolean;
        ownership: string | null;
        area_land: number;
        area_building: number;
        has_study_hall: boolean;
        has_theater: boolean;
        theater_capacity: number;
        has_gym: boolean;
        has_preschool: boolean;
        elevator_count: number;
        floor_count: number;
        number_of_rooms: number;
        number_of_computer_workshops: number;
        number_of_guards: number;
        number_of_programs_held: number;
        number_of_active_programs: number;
        number_of_branches: number;
        has_a_telephone_line: boolean;
        number_telephone_line: number;
        fire_extinguishing_system: boolean;
        year_of_manufacture: string | number | null;
        employees_count: number;

        has_shelter_profile: boolean;
        is_shelter_enabled: boolean;
        total_capacity: number;
        usable_capacity: number;
        available_capacity: number;
        reserved_capacity: number;
        occupied_capacity: number;
        usage_rate: number;
        occupancy_rate: number;
    }[];

    alerts: {
        type: string;
        severity: HallMonitoringSeverity;
        title: string;
        message: string;
        hall_id?: number | null;
        value?: number | null;
    }[];

    data_quality: {
        key: string;
        label: string;
        good: number;
        bad: number;
        score: number;
    }[];

    ownership_breakdown: {
        key: string;
        label: string;
        value: number;
    }[];

    program_activity_breakdown: {
        key: string;
        label: string;
        value: number;
    }[];

    filters: {
        region_id: number | null;
        district_id: number | null;
        top: number;
    };
}
