import { Review, ReviewParams } from 'src/types/review.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'
import { CommentSchema } from 'src/utils/rules'

export type CommentFormData = CommentSchema

export const URL_TOUR_REVIEW = '/reviews/tour-reviews'
export const URL_GUIDE_REVIEW = '/reviews/guide-reviews'
export const URL_USERS = '/users'

const reviewApi = {
  searchReviewsOfTour(tourId: number, params: ReviewParams) {
    return http.get<SuccessResponse<Review[]>>(`${URL_TOUR_REVIEW}/filter/${tourId}`, { params })
  },
  addReviewsOfTourById(tourId: number, body: CommentFormData) {
    return http.post<SuccessResponse<Review[]>>(`${URL_TOUR_REVIEW}/${tourId}`, body)
  },
  updateReviewsOfTourById(reviewId: number, body: CommentFormData) {
    return http.put<SuccessResponse<Review[]>>(`${URL_TOUR_REVIEW}/${reviewId}`, body)
  },
  deleteReviewsOfTourById(reviewId: number) {
    return http.delete<SuccessResponse<void>>(`${URL_TOUR_REVIEW}/${reviewId}`)
  },
  checkCanReviewOfTour(tourId: number) {
    return http.get<SuccessResponse<{ isCanReview: boolean }>>(`${URL_USERS}/is-can-review-tour/${tourId}`)
  },
  getReviewsOfGuide(guideId: number, params: ReviewParams) {
    return http.get<SuccessResponse<Review[]>>(`${URL_GUIDE_REVIEW}/filter/${guideId}`, { params })
  },
  checkCanReviewOfGuide(guideId: number) {
    return http.get<SuccessResponse<{ isCanReview: boolean }>>(`${URL_USERS}/is-can-review-guide/${guideId}`)
  },
  addReviewsOfGuideById(guideId: number, body: CommentFormData) {
    return http.post<SuccessResponse<Review[]>>(`${URL_GUIDE_REVIEW}/${guideId}`, body)
  },
  updateReviewsOfGuideById(reviewId: number, body: CommentFormData) {
    return http.put<SuccessResponse<Review[]>>(`${URL_GUIDE_REVIEW}/${reviewId}`, body)
  },
  deleteReviewsOfGuideById(reviewId: number) {
    return http.delete<SuccessResponse<void>>(`${URL_GUIDE_REVIEW}/${reviewId}`)
  }
}

export default reviewApi
