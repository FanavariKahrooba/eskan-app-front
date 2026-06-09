import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const TRACK_PATH = "/api/v1/front/shelter-requests/track";

export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ trackingCode: string }> },
) {
    try {
        if (!BACKEND_URL) {
            return NextResponse.json(
                { message: "NEXT_PUBLIC_API_BASE_URL تنظیم نشده است." },
                { status: 500 },
            );
        }

        const { trackingCode } = await context.params;
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

        const response = await fetch(
            `${BACKEND_URL}${TRACK_PATH}/${encodeURIComponent(trackingCode)}`,
            {
                method: "GET",
                headers,
                cache: "no-store",
            },
        );

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
            { message: "خطا در پروکسی پیگیری درخواست" },
            { status: 500 },
        );
    }
}
