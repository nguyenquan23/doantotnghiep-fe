import { TourStatus } from 'src/enums/tour-status.enum'
import { Location } from './location.type'
import { PageResult } from './page-result.type'
import { Review } from './review.type'
import { User } from './user.type'
import { SuccessResponse } from './utils.type'

export type TourCategory = {
  id: number
  name: string
}

export type ImageWithLink = {
  id: number
  imageLink: string
}

export type Tour = {
  id: number
  name: string
  description: string
  transportation: string
  includeService: string
  duration: number
  unit: string
  startTimes: string[]
  overallRating: number
  estimatedLocalCashNeeded: string
  pricePerTraveler: number
  limitTraveler: number
  province: string
  itinerary: string
  categories: TourCategory[]
  guide: User
  images: ImageWithLink[]
  locations: Location[]
  status: TourStatus
  reviewDTOS?: Review[]
}

export interface TourGuideParams {
  page?: number | string
  limit?: number | string
  sortBy?: 'rating' | 'price'
  order?: 'asc' | 'desc'
  overallRating?: number | string
  minPrice?: number | string
  maxPrice?: number | string
  searchValue?: string
  categoryId?: number[]
}

export type TourSuccessResponse = SuccessResponse<Tour>

export type ToursResult = {
  tourDTOS: Tour[]
} & PageResult
