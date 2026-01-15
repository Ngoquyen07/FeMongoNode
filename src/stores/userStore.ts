import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/interfaces/user.interface'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);

  // @ts-ignore
  const role = computed(() => user.value.role)
  const isAuthenticated = computed(() => !!user.value) ;
  const isAdmin = computed(() => {
    // @ts-ignore
    return user.value.role === 'admin'
  }) ;
  const isManager = computed(() => {
    // @ts-ignore
    return user.value.role === 'manager'
  })
  const isEmployee = computed(() => {
    // @ts-ignore
    return user.value.role === 'employee'
  })
  async function setUserValue(data: Partial<User>) {
    if (!user.value) {
      user.value = data as User
    } else {
      user.value = {
        ...user.value,
        ...data,
      }
    }
  }
  async function clearUser() {
    user.value = null
  }
  return {
    user,
    isAuthenticated ,
    isAdmin ,
    isManager,
    isEmployee ,
    setUserValue,
    clearUser,
    role
  }
},{
  persist: true,
})
