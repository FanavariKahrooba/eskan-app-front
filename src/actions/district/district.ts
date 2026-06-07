"use server";

import { getDataFetch, baseFetchData, updateDataFetch } from "@/actions/index";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getDataDistrict(q: string | number = "", page: string) {
  let paramsUrl = () => {
    if (q !== "" && page !== "" && page !== undefined) {
      return q == "" ? "" : `?q=${q}` + `&page=${page}`;
    } else if (q === "" && page !== "" && page !== undefined) {
      return `?page=${page}`;
    } else if (page === undefined && q !== "") {
      return q == "" ? "" : `?q=${q}`;
    } else {
      return "";
    }
  };
  return baseFetchData(`/api/v1/admin/district${paramsUrl()}`);
}


export async function getRegionList() {

  return baseFetchData(`/api/v1/admin/district/list-region`);
}


export async function getDistrictList($id:string) {

  return baseFetchData(`/api/v1/admin/district/${$id}/list-district`);
}


export async function getEditData(id: string) {
  return baseFetchData(`/api/v1/admin/district/${id}/edit`);
}


export async function updateDistrict(formData: FormData) {
  const cookieStore = await cookies();
    const res = await updateDataFetch(
      `/api/v1/admin/district/update`,
      formData
    );
    if (res.status == "success") {
      cookieStore.set("toastType", "success");
      cookieStore.set("toastMessage", "با موفقیت بروزرسانی شد.");
      redirect(`/v1/admin/district`); 
    }else{
      cookieStore.set("toastType", "fail");
      cookieStore.set("toastMessage",  "عملیات با خطا مواجه شد.");
    }
    if (res?.errors) {
      cookieStore.set("toastType", "fail");
      cookieStore.set("toastMessage",  "عملیات با خطا مواجه شد.");
      return res;
    }

}