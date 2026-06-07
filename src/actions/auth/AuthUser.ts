
import { cookies } from "next/headers";

export default async function AuthUserService() {
  const token = (await cookies()).get("access-token-producer");

  try {
    let res = await fetch(process.env.BACKEND_URL + "/api/v1/admin/user-admin", {
      method: "GET",
      cache: "no-store",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `Bearer ${token?.value}`
      }
    });
    if (res.status !== 401) {
      let data = await res.json();
      return data;
    }
    throw new Error("Failed to fetch data");
  } catch (e:any) {
    return {
      // error: e.message
      error: "UNAUTHORIZED"
    };
  }
}
