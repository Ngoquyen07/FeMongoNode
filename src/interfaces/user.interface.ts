import type { IRole } from '@/interfaces/role.interface.ts'

export interface User {
  _id: string
  id: string
  username: string
  email: string
  role: IRole
  manager?: User  | null
  employees?: User[]
  createdAt: string
  updatedAt: string
}
