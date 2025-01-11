import { Omit } from 'lodash'
import { Guide } from './guide.type'
import { Tour } from './tour.type'
import { PageResult } from './page-result.type'
import { User } from './user.type'

export type TourInStatistic = Pick<Tour, 'id' | 'name' | 'pricePerTraveler' | 'limitTraveler' | 'overallRating'> & {
  overallRating: number
  totalTravelerNumber: number
  totalRevenue: number
  totalBooking: number
}

export type GuideInStatistic = Omit<
  Guide,
  'biography' | 'credential' | 'avatar' | 'languageSkill' | 'numberOfReviews'
> & { totalTravelerNumber: number; totalRevenue: number; totalBooking: number }

export type TourStatisticResult = {
  tourDTOS: TourInStatistic[]
} & PageResult

export type ToursOfGuideStatisticResult = {
  statisticalTourDTOS: TourInStatistic[]
} & PageResult

export type GuideStatisticResult = {
  statisticalGuideDTOS: GuideInStatistic[]
} & PageResult

export type YearStatisticResult = {
  year: number
  monthDTOS: MonthStatisticResult[]
}

export type MonthStatisticResult = {
  revenue: number
  bookingOfNumber: number
  month: number
}

export type PopularGuideResult = Omit<User, 'role'> & {
  overallRating: number
  totalTravelerNumber: number
  totalRevenue: number
  totalBooking: number
}
