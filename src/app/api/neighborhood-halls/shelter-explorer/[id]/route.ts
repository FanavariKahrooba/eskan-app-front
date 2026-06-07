import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const cookieStore = await cookies();
  const token = cookieStore.get("access-token")?.value || "";

  try {
    const { data } = await axios.get(
      `${process.env.BACKEND_URL}/api/v1/admin/shelter-explorer/${id}`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch hall details" },
      { status: 500 }
    );
  }
}
