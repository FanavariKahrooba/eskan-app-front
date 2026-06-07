"use server";
import { cookies } from "next/headers";

interface Error {
  error: any;
}
export async function baseFetchData(
  url: string,
  dataForm: any = null,
  options: any = {
    Method: "GET",
    customHeader: {
      "X-Requested-With": "XMLHttpRequest"
    }
  }
) {
  const Cookies = await cookies();
  const token = Cookies.get("access-token-producer");
  try {
    let res = await fetch(process.env.BACKEND_URL + url, {
      method: options.Method,
      body: dataForm,
      cache: "no-store",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `Bearer ${token?.value}`
      }
    });
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    let data = await res.json();
    return data;
  } catch (e: any) {
    return {
      error: e.message
    };
  }
}

export async function getDataFetch(url: string) {
  const token = (await cookies()).get("access-token-producer");

  try {
    let res = await fetch(process.env.BACKEND_URL + url, {
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `Bearer ${token?.value}`
      },
      cache: "no-store"
    });
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    let data = await res.json();
    return data;
  } catch (e: any) {
    return {
      error: e.message
    };
  }
}

export async function sendDataFetch(
  url: string,
  formData: FormData,
  customHeader: any = []
) {
  try {
    const token = (await cookies()).get("access-token-producer");
    let res = await fetch(process.env.BACKEND_URL + url, {
      method: "POST",
      body: formData,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `Bearer ${token?.value}`,
        customHeader
      }
    });

    if (!res.ok) {
      return res.json();
      throw new Error("Failed to fetch data");
    }
    let data = await res.json();
    return data;
  } catch (e: any) {
    return {
      error: e.message
    };
  }
}

export async function getDataFetchByID(url: string, id: number) {
  const token = (await cookies()).get("access-token-producer");
  try {
    let res = await fetch(process.env.BACKEND_URL + url + id, {
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `Bearer ${token?.value}`
      },
      cache: "no-store"
    });
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    let data = await res.json();
    return data;
  } catch (e: any) {
    return {
      error: e.message
    };
  }
}

export async function updateDataFetch(
  url: string,
  formData: FormData,
  customHeader: any = []
) {
  const token = (await cookies()).get("access-token-producer");
  try {
    let res = await fetch(process.env.BACKEND_URL + url, {
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `Bearer ${token?.value}`,
        // "Content-Type": "multipart/form-data",
        Accept: "*/*"
      },
      cache: "no-store",
      body: formData
    });
    console.log(res);
    if (!res.ok) {
      const errorData = await res.json();
      if (res.status === 422) {
        return errorData;
      }
      // throw new Error("Failed to fetch data")

      throw new Error(JSON.stringify(errorData));
    }
    let data = await res.json();
    return data;
  } catch (e: any) {
    return {
      error: e.message
    };
  }
}

export async function deleteDataFetch(
  url: string,
  dataForm: any,
  customHeader: any = []
) {
  const token = (await cookies()).get("access-token-producer");

  try {
    let res = await fetch(process.env.BACKEND_URL + url, {
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `Bearer ${token?.value}`,
        customHeader
      },
      body: dataForm
    });
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    let data = await res.json();
    return data;
  } catch (e: any) {
    return {
      error: e.message
    };
  }
}

function headers(options: any) {
  options.map((item: any, key: number) => {
    return `${item.key} : ${item.value}`;
  });
}

export async function updateDataFetchWithOutAuth(
  url: string,
  formData: FormData,
  customHeader: any = []
) {
  try {
    let res = await fetch(process.env.BACKEND_URL + url, {
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        // "Content-Type": "multipart/form-data",
        Accept: "*/*"
      },
      cache: "no-store",
      body: formData
    });

    if (!res.ok) {
      const errorData = await res.json();
      if (res.status === 422) {
        return errorData;
      }
      // throw new Error("Failed to fetch data")

      throw new Error(JSON.stringify(errorData));
    }
    let data = await res.json();
    return data;
  } catch (e: any) {
    return {
      error: e.message
    };
  }
}
