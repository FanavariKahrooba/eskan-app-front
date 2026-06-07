import { updateDataFetchWithOutAuth } from "@/actions/index";

export async function sendOtpAgain(phone_number: string) {
  const formData = new FormData();

  formData.append("phone_number", phone_number);

  return updateDataFetchWithOutAuth("/api/v1/user/send-otp-request", formData);
}
