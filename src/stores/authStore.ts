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
    try{
      const res = await auth.refresh_token()
      accessToken.value = res.data.accessToken
      await router.push({
        name: `${useUserStore().role}.home`
    })
    }
    catch(error){
      await router.push('/')
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
