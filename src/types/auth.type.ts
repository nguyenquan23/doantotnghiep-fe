import { User } from './user.type'
import { SuccessResponse } from './utils.type'

export type AuthSuccessResponse = SuccessResponse<{
  accessToken: string
  user: User
}>

export type SubscribeTopicSuccessResponse = SuccessResponse<{
  message: string
}>
