import { Booking } from './booking.type'
import { Tour } from './tour.type'

export type TourInInvoice = Pick<Tour, 'id' | 'images' | 'name' | 'overallRating' | 'locations'>

export type Invoice = {
  id: number
  priceTotal: number
  createAt: Date
  status: string
  tours: Booking[]
  email: string
  fullName: string
  phone: string
}

export type RefundInvoice = Invoice & { vndPrice: number; conversionRate: number }
