import { Guide } from './guide.type'
import { Tour } from './tour.type'

export type BookingsInCart = {
  id: number
  bookings: Booking[]
}

export type Booking = {
  id: number
  startDate: Date
  numberTravelers: number
  price: number
  status: string
  tour: Tour
  guide?: Guide
}

export type PopularCity = {
  name: string
  bookedQuantity: number
  image: string
}
