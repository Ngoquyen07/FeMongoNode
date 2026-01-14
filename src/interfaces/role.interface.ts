export interface IRole {
  _id: string
  name: 'admin'|'manager' | 'employee' | string // Có thể để string hoặc liệt kê cụ thể các role
}
