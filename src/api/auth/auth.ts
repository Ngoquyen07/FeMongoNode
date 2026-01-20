import axiosClient from '@/api/auth/axios.ts'
export const auth = {
  async login (data: any) {
    return await axiosClient.post('/login', data)
  },
  async logout () {
    return await axiosClient.post('/logout')
  },
  async refresh_token(){
    return await axiosClient.post('/refreshToken')
  }

}
