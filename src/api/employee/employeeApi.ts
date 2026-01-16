import axiosClient from '@/api/auth/axios.ts'
export const employeeApi = {
    async getEmloyeeData(){
        return await axiosClient.get('/api/employee/me')
    }
}