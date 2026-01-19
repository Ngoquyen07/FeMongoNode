import axiosClient from '@/api/auth/axios.ts'
export const employeeApi = {
    async getEmployeeData(){
        return await axiosClient.get('/api/employee/me')
    }
}