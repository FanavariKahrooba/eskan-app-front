'use server'
import { cookies } from "next/headers";


export async function GateAccess() {
  const token = (await cookies()).get("access-token-producer");
  try {
    let res = await fetch(process.env.BACKEND_URL + "/api/v1/guard/me", {
      method: "GET",
      cache: "no-store",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `Bearer ${token?.value}`
      }
    });
    console.log(res);
    if (res.status == 403) {
      return {
        message: "Invalid Token",
        status: false
      }
    }
    if (res.status !== 401 && res.status !== 403) {
      let data = await res.json();
      return data;
    }

    return {
      message: "Invalid Token",
      status: false
    }
  } catch (e: any) {
    return {
      error: "UNAUTHORIZED"
    };
  }


}