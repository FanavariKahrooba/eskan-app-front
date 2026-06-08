import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.BACKEND_URL;

export async function GET(request: NextRequest) {
    try {
        if (!BACKEND_BASE_URL) {
            return NextResponse.json(
                { message: "BACKEND_BASE_URL is not configured" },
                { status: 500 }
            );
        }

        const { searchParams } = new URL(request.url);
        const targetUrl = new URL(`${BACKEND_BASE_URL}/v1/admin/shelter-explorer`);

        searchParams.forEach((value, key) => {
            targetUrl.searchParams.set(key, value);
        });

        const authHeader = request.headers.get("authorization");

        const response = await fetch(targetUrl.toString(), {
            method: "GET",
            headers: {
                Accept: "application/json",
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
            cache: "no-store",
        });

        const data = await response.json().catch(() => null);

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            {
                message: "Proxy error while fetching shelter overview",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}