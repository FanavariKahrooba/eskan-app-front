import { NextRequest, NextResponse } from "next/server";

type PagePreferencesValue = {
    activeTab?: string;
    search?: string;
    filters?: Record<string, unknown>;
    sort?: {
        field?: string;
        direction?: "asc" | "desc";
    };
    pageSize?: number;
    visibleColumns?: string[];
    density?: "comfortable" | "compact";
    custom?: Record<string, unknown>;
};

/**
 * نکته:
 * این map فقط برای نمونه است.
 * در production باید به دیتابیس وصل شود.
 */
const memoryStore = new Map<string, PagePreferencesValue>();

function getKey(pageKey: string, userId?: string) {
    return `${userId || "anonymous"}:${pageKey}`;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const pageKey = searchParams.get("pageKey");
    const userId = searchParams.get("userId") || undefined;

    if (!pageKey) {
        return NextResponse.json(
            { message: "pageKey is required" },
            { status: 400 }
        );
    }

    const key = getKey(pageKey, userId);
    const value = memoryStore.get(key);

    if (!value) {
        return NextResponse.json({ value: null }, { status: 404 });
    }

    return NextResponse.json({
        pageKey,
        userId,
        value,
    });
}

export async function PUT(request: NextRequest) {
    const body = await request.json();

    const pageKey = body.pageKey as string | undefined;
    const userId = body.userId as string | undefined;
    const value = body.value as PagePreferencesValue | undefined;

    if (!pageKey) {
        return NextResponse.json(
            { message: "pageKey is required" },
            { status: 400 }
        );
    }

    if (!value) {
        return NextResponse.json({ message: "value is required" }, { status: 400 });
    }

    const key = getKey(pageKey, userId);

    memoryStore.set(key, value);

    return NextResponse.json({
        ok: true,
        pageKey,
        userId,
        value,
        updatedAt: new Date().toISOString(),
    });
}

export async function DELETE(request: NextRequest) {
    const body = await request.json();

    const pageKey = body.pageKey as string | undefined;
    const userId = body.userId as string | undefined;

    if (!pageKey) {
        return NextResponse.json(
            { message: "pageKey is required" },
            { status: 400 }
        );
    }

    const key = getKey(pageKey, userId);

    memoryStore.delete(key);

    return NextResponse.json({
        ok: true,
    });
}
