import axiosClient from '@/api/auth/axios.ts'
export const managerApi = {
    async getManagerData(){
        return await axiosClient.get('/api/manager/me')
    }
}