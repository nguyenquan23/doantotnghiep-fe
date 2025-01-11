import { User } from './user.type'

export type Review = {
  id: number
  comment: string
  rating: number
  createAt: string
  traveler: User
  childReview: Review[]
}
export interface ReviewParams {
  ratings?: string
  sortBy?: string
}
