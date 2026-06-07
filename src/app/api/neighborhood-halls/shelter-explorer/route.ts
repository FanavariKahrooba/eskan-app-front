import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region");
  const district = searchParams.get("district");
  const q = searchParams.get("q");

  const cookieStore = await cookies();
  const token = cookieStore.get("access-token")?.value || "";

  try {
    const { data } = await axios.get(
      `${process.env.BACKEND_URL}/api/v1/admin/shelter-explorer`,
      {
        params: { region, district, q },
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
