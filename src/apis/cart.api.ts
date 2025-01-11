import { Booking, BookingsInCart } from 'src/types/booking.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'
import { BookingUpdateFormData } from '../pages/Cart/components/CartBookingItem/CartBookingItem'
import { AddBookingForm } from './../pages/TourDetail/components/BookingConfirmation/BookingConfirmation'

export const URL_CARTS = 'carts'

const cartApi = {
  getBookingsInCart() {
    return http.get<SuccessResponse<BookingsInCart>>(URL_CARTS)
  },
  updateBookingInCart(body: BookingUpdateFormData) {
    return http.put<SuccessResponse<BookingsInCart>>(URL_CARTS, body)
  },
  deleteBookingInCart(id: number) {
    return http.delete<SuccessResponse<void>>(`${URL_CARTS}/${id}`)
  },
  createBookingInCart(body: AddBookingForm) {
    return http.post<SuccessResponse<{ bookings: Booking[] }>>(URL_CARTS, body)
  }
}

export default cartApi
