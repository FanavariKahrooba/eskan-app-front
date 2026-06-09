import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const SHELTER_REQUESTS_PATH = "/api/v1/front/shelter-requests";

export async function POST(req: NextRequest) {
    try {
        if (!BACKEND_URL) {
            return NextResponse.json(
                { message: "LARAVEL_API_BASE_URL تنظیم نشده است." },
                { status: 500 },
            );
        }

        const formData = await req.formData();
        const cookieStore = await cookies();

        const token =
            cookieStore.get("token")?.value ||
            cookieStore.get("access_token")?.value ||
            cookieStore.get("jwt")?.value;

        const headers: HeadersInit = {
            Accept: "application/json",
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${BACKEND_URL}${SHELTER_REQUESTS_PATH}`, {
            method: "POST",
            headers,
            body: formData,
            cache: "no-store",
        });

        const text = await response.text();

        let data: unknown = null;

        try {
            data = text ? JSON.parse(text) : null;
        } catch {
            data = { message: text || "پاسخ نامعتبر از سرور بک‌اند" };
        }

        return NextResponse.json(data, { status: response.status });
    } catch {
        return NextResponse.json(
            { message: "خطا در پروکسی درخواست اسکان" },
            { status: 500 },
        );
    }
}
