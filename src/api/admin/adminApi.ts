import axiosClient from '@/api/auth/axios.ts'
export const adminApi = {
   async register(data: any) {
        return await axiosClient.post('/api/admin/register', data);
    },
    async getAllStaffs() {
        return await axiosClient.get('/api/admin/staffs/getAll');
    },
    async updateUserRole(userId: string, roleName: string) {
        return await axiosClient.put('/api/admin/staffs/update_role', { userId, roleName });
    },
    async getOrphanEmployees() {
        return await axiosClient.get('/api/admin/staffs/orphan_employees');
    },
    async assignEmployees(managerId: string, employeeIds: string[]) {
        return await axiosClient.put('/api/admin/staffs/assign_employees_to_manager', { managerId, employeeIds });
    },
    async getManagers() {
        return await axiosClient.get('/api/admin/staffs/managers');
    },
    async deleteStaff(userId: string) {
        return await axiosClient.delete('/api/admin/staffs/delete_user', { data: { userId } });
    }
}