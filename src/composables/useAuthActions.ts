import { auth } from "@/api/auth/auth"
import { useUserStore } from "@/stores/userStore"
import { useAuthStore } from "@/stores/authStore"
import { useRouter } from "vue-router"
import axiosClient from "@/api/auth/axios.ts";
import router from "@/router";

export function useAuthActions() {
    const userStore = useUserStore()
    const authStore = useAuthStore()
    const router = useRouter()
    const login = async (data: any) => {
        try {
            const res = await auth.login(data)
            console.log("res", res)
            const user = res.data.user
            const token = res.data.accessToken
            await authStore.setToken(token)
            await userStore.setUserValue(user)
            if (user.isAdmin) {
                await router.push({ name: 'admin.home' })
            } else if (user.isManager) {
                await router.push({ name: 'manager.home' })
            } else {
                await router.push({ name: 'employee.home' })
            }
            return {
                success:true,
                errors:null
            }
        } catch (error: any) {
            return {
                success: false,
                errors: error.response.data.errors
            }
        }
    }

    const logout = async () => {
        try {
            await auth.logout()
        } catch (error) {
            console.log(error)
        } finally {
            await userStore.clearUser()
            await authStore.clearToken()
            await router.push('/login')
        }
    }
    return {
        login , logout
    }
}