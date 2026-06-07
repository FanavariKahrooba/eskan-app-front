import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region");
  const district = searchParams.get("district");
  const q = searchParams.get("q");
  const Cookies = await cookies();
  const token = Cookies.get("access-token");
  
  try {
    const {
        data
    }
     = await axios.get(`${process.env.BACKEND_URL}/api/v1/admin/user/report-location`, {
      params: { region, district,q  },
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `Bearer ${token?.value}`
      }
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
   
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
