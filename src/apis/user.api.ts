import { User } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'
import { UserSchema } from 'src/utils/rules'

type FormData = Pick<UserSchema, 'fullName' | 'address' | 'phone' | 'dateOfBirth'>
type PasswordFormData = Pick<UserSchema, 'password' | 'newPassword'>

const URL_USERS = 'users'

const userApi = {
  getMe() {
    return http.get<SuccessResponse<User>>(`${URL_USERS}/me`)
  },
  updateMe(body: FormData) {
    return http.put<SuccessResponse<User>>(`${URL_USERS}`, body)
  },
  changePassword(body: PasswordFormData) {
    return http.patch<SuccessResponse<User>>(`${URL_USERS}`, body)
  },
  deleteAccount(id: number) {
    return http.delete<SuccessResponse<void>>(`${URL_USERS}/${id}`)
  }
}

export default userApi
