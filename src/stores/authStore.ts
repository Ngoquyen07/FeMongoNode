import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const isLoggedIn = computed(() => !!accessToken.value)
  async function setToken(token: string) {
    accessToken.value = token
  }
  async function clearToken() {
    accessToken.value = null
  }
  return {
    accessToken,
    isLoggedIn,
    setToken,
    clearToken,
  }
},
    {
      persist: true,
    })
