import { Tour } from 'src/types/tour.type'

export const isTourInWishlist = (wishListData: Tour[], tourId: number) =>
  wishListData?.find((tour) => tour.id === tourId)
