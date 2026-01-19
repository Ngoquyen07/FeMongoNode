import type { Role } from '@/interfaces/role.interface.ts'

export interface User {
  _id: string
  id: string
  username: string
  email: string
  role: Role
  manager?: User  | null
  employees?: User[]
  createdAt: string
  updatedAt: string
}
