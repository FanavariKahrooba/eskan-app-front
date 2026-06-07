import useSWR from "swr"
import axios from "@/lib/axios"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { deleteCookie, getCookie, setCookie } from "cookies-next"

interface UseAuthOptions {
  middleware?: string
  redirectIfAuthenticated?: any
}
interface LoginProps {
  setErrors: (errors: any[]) => void
  setStatus: (status: any | null) => void
}


export const useAuth = ({ middleware, redirectIfAuthenticated }: UseAuthOptions = {}) => {
  // const searchParams = useSearchParams();
  // eslint-disable-next-line react-hooks/immutability
  axios.defaults.withCredentials = true
  const router = useRouter()
  const params = useParams()

  const { data: user, error, mutate } = useSWR('/api/v1/user-side/user', () =>
    axios
      .get('/api/v1/user-side/user', { headers: { "Authorization": `Bearer ${getCookie("access-token-user")}` } })
      .then((res: { data: any }) => res.data)
      .catch((error: { response: { status: number } }) => {

        if (error.response.status !== 409) throw error
      }),
  )

  const csrf = () => axios.get("/sanctum/csrf-cookie")

  const register = async ({ setErrors, ...props }: any): Promise<{ success?: boolean; message?: string; errors?: boolean }> => {
    try {
      await csrf()
      setErrors([])

      const response = await axios.post("/api/v1/user/register", props)

      switch (response?.data?.message) {
        case "success": {
          setCookie("ct_ot", "")
          deleteCookie("ct_ot")
          deleteCookie("phone_number")
          const date = new Date()
          date.setTime(date.getTime() + 24 * 60 * 60 * 1000)
          // setCookie('access-token-user', response?.data?.access_token, { expires: date, sameSite: 'strict', path: '/' });
          setCookie("access-token-user", response.data?.access_token, {
            expires: date, sameSite: "lax",
            path: "/"
          })

          setCookie("toastType", "success")
          setCookie("toastMessage", "به سایت ما خوش آمدید")
          await mutate(response.data?.user, false)
          return { success: true, message: "done" }
          break
        }
        case "Invalid":
          setCookie("toastType", "fail")
          setCookie("toastMessage", "کد وارد شده اشتباه است، لطفا دوباره سعی کنید.")
          return { success: false, message: "Invalid" }
          break
        case "Expired":
          setCookie("toastType", "fail")
          setCookie("toastMessage", "کد مورد نظر منقضی شده است.")
          return { success: false, message: "Expired" }
          break
        case "fail":
          if (response?.data?.send_otp == true) {
            setCookie("toastType", "fail")
            setCookie("toastMessage", "کد تایید منقضی شد.")
            // setErrors({ send_code: true })
            return { success: false, message: "Expired" }
          } else {
            setCookie("toastType", "fail")
            setCookie("toastMessage", response?.data?.message)
            return { success: false, message: "Expired" }
          }
        default:
          setCookie("toastType", "fail")
          setCookie("toastMessage", "خطای ناشناخته.")
          return { success: false, message: "login" }
      }
    } catch (error: any) {
      if (error?.message === "Network Error") {
        setCookie("toastType", "fail")
        setCookie("toastMessage", "ارتباط با سرور برقرار نشد.")
        return { success: false, message: "login" }
      } else if (error?.response?.status === 500) {
        setCookie("toastType", "fail")
        setCookie("toastMessage", "خطای داخلی سرور.")
        return { success: false, message: "login" }
      } else {
        setCookie("toastType", "fail")
        setCookie("toastMessage", error?.response?.data?.message)
        return { success: false, errors: true, message: error?.response?.data?.message }
      }
    }
  }

  const registerOtp = async ({ setErrors, ...props }: any): Promise<{ success: boolean; sendCode?: boolean; reg?: boolean }> => {
    try {
      await csrf()
      setErrors([])

      const response = await axios.post("/api/v1/user/otp-request", props)
      mutate()

      if (response.data.status === "otp_sent") {
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 5);
        setCookie("ct_ot", response.data?.user, {
          expires: expirationDate,
        })
        setCookie("ExpTime", expirationDate.toISOString(), {
          expires: expirationDate
        });
        return { success: true }
      } else if (response.data.status == "user not found") {
        const expirationDate = new Date()
        setCookie("phone_number", props.phone_number)
        expirationDate.setMinutes(expirationDate.getMinutes() + 5)
        setCookie("ct_ot", response.data?.user, {
          expires: expirationDate,
        })
        setCookie("ExpTime", expirationDate.toISOString(), {
          expires: expirationDate
        });
        setCookie("toastType", "fail")

        setCookie("toastMessage", "کاربر گرامی شماره شما ثبت نشده است لطفا در سایت ثبت نام کنید.")
        return { success: false, sendCode: true, reg: true }
      } else if (response?.data?.status === "403") {
        setCookie("toastType", "fail")
        setCookie("toastMessage", "کاربر گرامی شما به این بخش دسترسی ندارید.")
        return { success: false }
      } else if (response?.data?.status === "500") {
        setCookie("toastType", "fail")
        setCookie("toastMessage", "ارتباط با سرور برقرار نشد.")
        return { success: false }
      } else {
        setCookie("toastType", "fail")
        setCookie("toastMessage", "ارتباط با سرور برقرار نشد.")
        return { success: false }
      }
    } catch (error: any) {
      if (error?.message === "Network Error") {
        setCookie("toastType", "fail")
        setCookie("toastMessage", "ارتباط با سرور برقرار نشد.")
        return { success: false }
      } else if (error?.response?.status === 500) {
        setCookie("toastType", "fail")

        setCookie("toastMessage", "خطای داخلی سرور.")
        return { success: false }
      } else {
        setCookie("toastType", "fail")
        setCookie("toastMessage", "خطای نامشخص در ارتباط با سرور.")
        return { success: false }
      }
    }
  }

  const VerifyOtp = async ({ setErrors, ...props }: any): Promise<{ success?: boolean; message?: string }> => {
    try {
      await csrf()
      setErrors([])
      const response = await axios.post("/api/v1/user/verify", props)
      const { message, access_token, user: userData } = response.data

      switch (response?.data?.message) {
        case "success":
          setCookie("ct_ot", "")
          const date = new Date()
          date.setTime(date.getTime() + 24 * 60 * 60 * 1000)
          setCookie("access-token-user", response.data?.access_token, {
            expires: date, sameSite: "lax",
            path: "/"
          })
          await mutate(userData, false)
          setCookie("toastType", "success")
          setCookie("toastMessage", "به سایت ما خوش آمدید")

          return { success: true, message: "done" }
          break
        case "Invalid":
          setCookie("toastType", "fail")
          setCookie("toastMessage", "کد وارد شده اشتباه است، لطفا دوباره سعی کنید.")
          return { success: false, message: "Invalid" }
          break
        case "Expired":
          setCookie("toastType", "fail")
          setCookie("toastMessage", "کد مورد نظر منقضی شده است.")
          return { success: false, message: "Expired" }
          break
        default:
          setCookie("toastType", "fail")
          setCookie("toastMessage", "خطای ناشناخته.")
          return { success: false, message: "login" }
      }

      // })
      // .catch((error: { response: { status: number; data: { errors: any } } }) => {
      //     if (error.response.status !== 422) throw error
      //     setCookie("toastType", "fail");
      //     setCookie("toastMessage", error.response.data.errors);
      //     setErrors(error.response.data.errors)
      //     return { success: false, message: 'login' }
      // })
    } catch (error: any) {
      // console.log(error)
      if (error?.message === "Network Error") {
        setCookie("toastType", "fail")
        setCookie("toastMessage", "ارتباط با سرور برقرار نشد.")
        return { success: false, message: "login" }
      } else if (error?.response?.status === 500) {
        setCookie("toastType", "fail")
        setCookie("toastMessage", "خطای داخلی سرور.")
        return { success: false, message: "login" }
      } else {
        setCookie("toastType", "fail")
        setCookie("toastMessage", "خطای نامشخص در ارتباط با سرور.")
        return { success: false, message: "login" }
      }
    }
  }

  const logout = async () => {
    if (!error) {
      await axios.post("/api/v1/user/logout").then(() => mutate())
    }

    window.location.pathname = "/login-otp"
  }

  useEffect(() => {
    if (middleware === 'guest' && redirectIfAuthenticated && user)
      router.push(redirectIfAuthenticated)
    if (
      window.location.pathname === '/api/v1/user/verify-email' &&
      user?.email_verified_at
    )
      router.push(redirectIfAuthenticated)
    if (middleware === 'auth' && error) logout()
  }, [user, error, middleware, router, redirectIfAuthenticated, logout])

  return {
    user,
    isAuthenticated: !!user,
    register,
    logout,
    registerOtp,
    VerifyOtp
  }
}
