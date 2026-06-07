import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {

  // const  id  = (await params).id
  const { id }:any = context.params;
  // const params = { id} as const;
    // const Cookies = await cookies();
    // const token = Cookies.get("access-token");

    const Cookies = cookies();
    const token =  (await Cookies).get("access-token")?.value || "";

  try {
    const { data } = await axios.get(
      `${process.env.BACKEND_URL}/api/v1/admin/user/report-location/${id}`,{
        headers: {
            "X-Requested-With": "XMLHttpRequest",
             Authorization: `Bearer ${token}`
        }
      }
    );
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch hall details" },
      { status: 500 }
    );
  }
}
