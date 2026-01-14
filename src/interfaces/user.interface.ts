import type { IRole } from '@/interfaces/role.interface.ts'

export interface User {
  _id: string
  id: string
  username: string
  email: string
  role: IRole | string
  manager?: User | string | null
  employees?: User[]
  createdAt: string
  updatedAt: string
  __v?: number
}
