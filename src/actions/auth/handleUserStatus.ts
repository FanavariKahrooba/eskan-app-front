"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export async function handleLogout(): Promise<void> {
  const cookieStore = await cookies();
  try {
    const token = cookieStore.get("access-token-producer");
    let res = await fetch(process.env.BACKEND_URL + '/api/v1/producer/logout', {
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `Bearer ${token?.value}`,
      }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    let data = await res.json();
    if (data.message === "success") {
      cookieStore.delete("access-token-producer");
      cookieStore.delete("ct_ot")
      cookieStore.set("toastType", "success");
      cookieStore.set("toastMessage", "با موفقیت از پنل خارج شدید.");
    }

  } catch (e: any) {
    // return {
    //   error: e.message
    // };
  }

  
  redirect(`/`);
}
