import axios from 'axios'
import { useAuthStore } from '@/stores/authStore.ts'
import {useAuthActions} from "@/composables/useAuthActions.ts";
import router from "@/router";
const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true
})
axiosClient.interceptors.request.use((config) =>{
  const authStore = useAuthStore()
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }
  return config ;
})

let isRefreshing = false
let queue: any[] = []

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const authStore = useAuthStore()
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(axiosClient(originalRequest))
          })
        })
      }
      isRefreshing = true
      try {
        const res = await axiosClient.post('/refreshToken')
        const newToken = res.data.accessToken
        await authStore.setToken(newToken)
        queue.forEach((cb) => cb(newToken))
        queue = []
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return axiosClient(originalRequest)
      } catch(error) {

        await useAuthActions().logout()
        await router.push('/login')
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  },
)
export default axiosClient