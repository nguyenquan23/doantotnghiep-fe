import { Booking } from 'src/types/booking.type'

export const totalBookingPrice = (bookings: Booking[] | undefined) =>
  bookings?.reduce((total, booking) => total + booking.price, 0)
