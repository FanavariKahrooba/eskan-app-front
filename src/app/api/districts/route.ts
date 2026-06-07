import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        const { searchParams } = new URL(req.url);
        const regionId = searchParams.get("regionId");

        if (!regionId) {
            return NextResponse.json(
                { message: "regionId ارسال نشده است." },
                { status: 400 }
            );
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/front/district/${regionId}/list-district`,
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
        console.error("Districts API proxy error:", error);

        return NextResponse.json(
            { message: "خطا در دریافت لیست نواحی" },
            { status: 500 }
        );
    }
}
