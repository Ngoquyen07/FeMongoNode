import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {auth} from "@/api/auth/auth.ts";
import router from "@/router";
import {useUserStore} from "@/stores/userStore.ts";

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const isLoggedIn = computed(() => !!accessToken.value)
  async function setToken(token: string) {
    accessToken.value = token
  }
  async function clearToken() {
    accessToken.value = null
  }
  async function refreshTokenFromInit() {
    try {
      const res = await auth.refresh_token()
      accessToken.value = res.data.accessToken

      // 1. Lấy thông tin route hiện tại
      const currentRoute = router.currentRoute.value

      // 2. Kiểm tra xem có tham số 'redirect' trên URL không
      const redirectTo = currentRoute.query.redirect as string
      console.log("Pre :",redirectTo)
      if (redirectTo) {
        // Nếu có trang cũ, quay lại trang đó
        await router.push(redirectTo)
      } else {
        // Nếu không có (ví dụ vào thẳng trang chủ), thì mới về home theo role
        const userStore = useUserStore()
        await router.push({name: `${userStore.role}.home`})
      }
    } catch (error) {
      // Nếu refresh thất bại (hết hạn hoàn toàn), đẩy về login
      if (router.currentRoute.value.name !== 'login') {
        await router.push('/login')
      }
    }
  }
  return {
    accessToken,
    isLoggedIn,
    refreshTokenFromInit,
    setToken,
    clearToken,
  }})
// },
//     {
//       persist: true,
//     })
