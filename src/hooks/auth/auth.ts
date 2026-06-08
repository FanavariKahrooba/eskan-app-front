'use client'

import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { setCookie, getCookie, deleteCookie } from 'cookies-next'

interface UseAuthOptions {
  middleware?: string
  redirectIfAuthenticated?: any
}

interface LoginOtpProps {
  setErrors: (errors: any[]) => void
  setStatus: (status: any | null) => void
}

export const useAuth = ({ middleware, redirectIfAuthenticated }: UseAuthOptions = {}) => {
  const router = useRouter()

  const accessToken = getCookie('access-token') as string | undefined

  const { data: user, error, mutate } = useSWR(
    accessToken ? '/api/user' : null,
    async () => {
      const token = getCookie('access-token') as string | undefined

      if (!token) {
        throw new Error('No token')
      }

      const res = await axios.get('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return res.data
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  )

  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const registerOtp = async ({
    setErrors,
    ...props
  }: any): Promise<{ success: boolean; sendCode?: boolean; reg?: boolean }> => {
    try {
      await csrf()
      setErrors([])

      const response = await axios.post('/api/v1/admin/otp-request', props)

      mutate()

      if (response.data.status === 'success') {
        const expirationDate = new Date()
        expirationDate.setMinutes(expirationDate.getMinutes() + 2)

        setCookie('ct_ot', response.data?.user ?? '', {
          expires: expirationDate,
        })

        setCookie('ExpTime', expirationDate.toISOString(), {
          expires: expirationDate,
        })

        return { success: true }
      }

      if (response.data.status === 'user not found') {
        deleteCookie('phone_number')
        setCookie('phone_number', props.phone_number)
        setCookie('toastType', 'fail')
        setCookie('toastMessage', 'کاربر گرامی شماره شما ثبت نشده است.')

        return { success: false }
      }

      if (response.data.status === '403') {
        setCookie('toastType', 'fail')
        setCookie('toastMessage', 'کاربر گرامی شما به این بخش دسترسی ندارید.')

        return { success: false }
      }

      if (response?.data?.status === '500') {
        setCookie('toastType', 'fail')
        setCookie('toastMessage', 'ارتباط با سرور برقرار نشد.')

        return { success: false }
      }

      setCookie('toastType', 'fail')
      setCookie('toastMessage', 'ارتباط با سرور برقرار نشد.')

      return { success: false }
    } catch (error: any) {
      if (error?.message === 'Network Error') {
        setCookie('toastType', 'fail')
        setCookie('toastMessage', 'ارتباط با سرور برقرار نشد.')

        return { success: false }
      }

      if (error?.response?.status === 500) {
        setCookie('toastType', 'fail')
        setCookie('toastMessage', 'خطای داخلی سرور.')

        return { success: false }
      }

      setCookie('toastType', 'fail')
      setCookie('toastMessage', 'خطای نامشخص در ارتباط با سرور.')

      return { success: false }
    }
  }

  const VerifyOtp = async ({
    setErrors,
    ...props
  }: any): Promise<{ success?: boolean; message?: string }> => {
    try {
      await csrf()
      setErrors([])

      const response = await axios.post('/api/v1/admin/verify', props)
      const { user: userData } = response.data

      switch (response?.data?.message) {
        case 'success': {
          const expirationDate = new Date()
          expirationDate.setTime(expirationDate.getTime() + 4 * 60 * 60 * 1000)

          setCookie('ct_ot', '', {
            expires: new Date(0),
          })

          setCookie('access-token', response.data?.access_token, {
            expires: expirationDate,
          })

          await mutate(userData, false)

          setCookie('toastType', 'success')
          setCookie('toastMessage', 'به سامانه جامع محلات خوش آمدید')

          return { success: true, message: 'done' }
        }

        case 'Invalid':
          setCookie('toastType', 'fail')
          setCookie('toastMessage', 'کد وارد شده اشتباه است، لطفا دوباره سعی کنید.')

          return { success: false, message: 'Invalid' }

        case 'Expired':
          setCookie('toastType', 'fail')
          setCookie('toastMessage', 'کد مورد نظر منقضی شده است.')

          return { success: false, message: 'Expired' }

        default:
          setCookie('toastType', 'fail')
          setCookie('toastMessage', 'خطای ناشناخته.')

          return { success: false, message: 'login' }
      }
    } catch (error: any) {
      if (error?.message === 'Network Error') {
        setCookie('toastType', 'fail')
        setCookie('toastMessage', 'ارتباط با سرور برقرار نشد.')

        return { success: false, message: 'login' }
      }

      if (error?.response?.status === 500) {
        setCookie('toastType', 'fail')
        setCookie('toastMessage', 'خطای داخلی سرور.')

        return { success: false, message: 'login' }
      }

      setCookie('toastType', 'fail')
      setCookie('toastMessage', 'خطای نامشخص در ارتباط با سرور.')

      return { success: false, message: 'login' }
    }
  }

  const loginOtp = async ({
    setErrors,
    setStatus,
    ...props
  }: LoginOtpProps): Promise<void> => {
    await csrf()

    setErrors([])
    setStatus(null)

    await axios
      .post('/api/v1/admin/otp-request', props)
      .then(() => mutate())
      .catch((error: { response: { status: number; data: { errors: any[] } } }) => {
        if (error.response.status !== 422) {
          throw error
        }

        setErrors(error.response.data.errors)
      })

    router.push('/v1/admin/dashboard')
  }

  // const logout = useCallback(async () => {
  //   const token = getCookie('access-token') as string | undefined

  //   if (token) {
  //     await axios.post('/api/logout').catch(() => null)
  //   }

  //   deleteCookie('access-token')
  //   deleteCookie('ct_ot')
  //   deleteCookie('ExpTime')

  //   await mutate(null, false)

  //   router.push('/login-otp')
  // })

  useEffect(() => {
    if (middleware === 'guest' && redirectIfAuthenticated && user) {
      router.push(redirectIfAuthenticated)
    }

    // if (middleware === 'auth' && error && !user) {
    //   logout()
    // }
  }, [middleware, redirectIfAuthenticated, user, error, router])

  return {
    isAuthenticated: !!user,
    user,
    loginOtp,
    registerOtp,
    VerifyOtp,
    // logout,
    loading: !!accessToken && !user && !error,
  }
}
