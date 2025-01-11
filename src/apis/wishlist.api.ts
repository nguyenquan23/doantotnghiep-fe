import { Tour } from 'src/types/tour.type'
import { User } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL_WISHLIST = 'wishlist'

const wishlistApi = {
  getWishlist() {
    return http.get<SuccessResponse<Tour[]>>(URL_WISHLIST)
  },
  addTourToWishlistById(tourId: number) {
    return http.post<SuccessResponse<User>>(URL_WISHLIST + `/${tourId}`)
  },
  deleteTourFromWishlistById(tourId: number) {
    return http.delete<SuccessResponse<User>>(URL_WISHLIST + `/${tourId}`)
  }
}

export default wishlistApi
