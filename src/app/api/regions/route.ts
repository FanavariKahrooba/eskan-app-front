import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/front/district/list-region`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                cache: "no-store",
            }
        );

        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Regions API proxy error:", error);

        return NextResponse.json(
            { message: "خطا در دریافت لیست مناطق" },
            { status: 500 }
        );
    }
}
