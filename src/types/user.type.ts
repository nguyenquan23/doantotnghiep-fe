import { UserRole } from 'src/enums/user-role.enum'

export interface User {
  id: string
  fullName?: string
  email: string
  dateOfBirth?: string
  phone?: string
  address?: string
  role: UserRole
}
