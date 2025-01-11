import { NotificationType } from 'src/enums/notification-type.enum'
import { User } from './user.type'

export type Notification = {
  id: number
  message: string
  notificationDate: Date
  isRead: boolean
  notificationType: NotificationType
  associateId: number
  sender: User
  receiver: User
}
