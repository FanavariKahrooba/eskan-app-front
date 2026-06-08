// lib/shelters.ts
import axios from "axios";

export type ShelterStatus = "active" | "limited" | "full";
export type ShelterGenderType = "men" | "women" | "family" | "mixed";
export type ShelterAdmissionType = "normal" | "emergency" | "referral";

export type ApiHallItem = {
    id: number;
    name: string;
    user?: string;
    lat?: number | string;
    lng?: number | string;
    district?: {
        id?: number | string;
        name?: string;
        region?: {
            id?: number | string;
            name?: string;
        };
    };
    info?: {
        address?: string;
        contact_number?: string;
        staff_count?: number | string;
        insurance?: number | string;
        has_workshop?: number | string;
        area_land?: number | string;
        area_building?: number | string;
        ownership?: string;
        has_study_hall?: number | string;
        has_theater?: number | string;
        theater_capacity?: number | string;
        has_gym?: number | string;
        has_preschool?: number | string;
        elevator_count?: number | string;
        floor_count?: number | string;
        number_of_rooms?: number | string;
        number_of_computer_workshops?: number | string;
        year_of_manufacture?: number | string;
        total_capacity?: number | string;
        free_capacity?: number | string;
        reserved_capacity?: number | string;
        occupied_capacity?: number | string;
        gender_type?: ShelterGenderType;
        admission_type?: ShelterAdmissionType;
    };
};

export type Shelter = {
    id: number;
    name: string;
    manager: string;
    region: string;
    regionId?: string;
    district: string;
    districtId?: string;
    neighborhood: string;
    address: string;
    phone: string;
    status: ShelterStatus;
    genderType: ShelterGenderType;
    admissionType: ShelterAdmissionType;
    totalCapacity: number;
    freeCapacity: number;
    reservedCapacity: number;
    occupiedCapacity: number;
    facilities: string[];
    lat: number;
    lng: number;
    raw?: ApiHallItem;
};

// ---- helper functions ----
// توجه: اگر نسخه اصلی این سه تابع در فایل فرق داشت، همان را جایگزین کن.
function toNumber(value: unknown, fallback = 0): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}

function safeText(value: unknown, fallback: string): string {
    const s = typeof value === "string" ? value.trim() : "";
    return s.length > 0 ? s : fallback;
}

function isTruthyOne(value: unknown): boolean {
    return Number(value) === 1 || value === true || value === "1";
}

// ---- facilities ----
function buildFacilities(item: ApiHallItem): string[] {
    const facilities: string[] = [];

    if (isTruthyOne(item.info?.has_study_hall)) facilities.push("سالن مطالعه");
    if (isTruthyOne(item.info?.has_theater)) facilities.push("آمفی‌تئاتر");
    if (isTruthyOne(item.info?.has_gym)) facilities.push("سالن ورزشی");
    if (isTruthyOne(item.info?.has_preschool)) facilities.push("پیش‌دبستانی");
    if (isTruthyOne(item.info?.has_workshop)) facilities.push("کارگاه بیمه");
    if (item.info?.contact_number) facilities.push("دارای شماره تماس");

    return facilities.length > 0 ? facilities : ["اطلاعات امکانات ثبت نشده"];
}

// ---- adapter ----
export function adaptHall(item: ApiHallItem): Shelter | null {
    const lat = Number(item.lat);
    const lng = Number(item.lng);

    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

    const totalCapacity = toNumber(item.info?.total_capacity, 0);
    const freeCapacity = toNumber(item.info?.free_capacity, 0);
    const reservedCapacity = toNumber(item.info?.reserved_capacity, 0);
    const occupiedCapacity = toNumber(item.info?.occupied_capacity, 0);

    const status: ShelterStatus =
        totalCapacity > 0 && freeCapacity === 0
            ? "full"
            : totalCapacity > 0 && freeCapacity <= Math.max(10, totalCapacity * 0.1)
                ? "limited"
                : "active";

    return {
        id: item.id,
        name: safeText(item.name, "سرای بدون نام"),
        manager: safeText(item.user, "ثبت نشده"),
        region: safeText(item.district?.region?.name, "منطقه نامشخص"),
        regionId: item.district?.region?.id
            ? String(item.district.region.id)
            : undefined,
        district: safeText(item.district?.name, "ناحیه نامشخص"),
        districtId: item.district?.id ? String(item.district.id) : undefined,
        neighborhood: safeText(item.name, "محله نامشخص"),
        address: safeText(item.info?.address, "آدرس ثبت نشده"),
        phone: safeText(item.info?.contact_number, "ثبت نشده"),
        status,
        genderType: item.info?.gender_type || "mixed",
        admissionType: item.info?.admission_type || "normal",
        totalCapacity,
        freeCapacity,
        reservedCapacity,
        occupiedCapacity,
        facilities: buildFacilities(item),
        lat,
        lng,
        raw: item,
    };
}

// ---- shared fetcher ----
export type ShelterQueryParams = {
    region?: string;
    district?: string;
    q?: string;
};

export async function fetchShelters(
    params: ShelterQueryParams = {},
): Promise<Shelter[]> {
    const { data } = await axios.get("/api/neighborhood-halls/shelter-explorer", {
        params: {
            region: params.region,
            district: params.district,
            q: params.q,
        },
    });

    const list: ApiHallItem[] = Array.isArray(data?.data) ? data.data : [];
    return list.map(adaptHall).filter(Boolean) as Shelter[];
}
