import { QueryConfig } from 'src/hooks/useQueryConfig'
import { TourUpdateFormData } from 'src/pages/Account/components/TourForm/UpdateTourForm/UpdateTourForm'
import { StartTimeParams } from 'src/types/start-time-params.type'
import { SuccessResponse, SuccessResponseWithPagination } from 'src/types/utils.type'
import http from 'src/utils/http'
import { TourSchema } from 'src/utils/rules'
import { PaginationParamWithCoordinates, PaginationParams } from './../types/pagination-params.type'
import { Tour, TourSuccessResponse, ToursResult } from './../types/tour.type'

type TourFormData = TourSchema
const URL_TOURS = 'tours'

const tourApi = {
  getTours(params: PaginationParams) {
    return http.get<SuccessResponse<ToursResult>>(URL_TOURS, { params })
  },
  getNearestTours(params: PaginationParamWithCoordinates) {
    return http.get<SuccessResponse<ToursResult>>(URL_TOURS, { params })
  },
  getTourById(id: string | number) {
    return http.get<TourSuccessResponse>(`${URL_TOURS}/${id as string}`)
  },
  createTour(body: TourFormData) {
    return http.post<SuccessResponse<Tour>>(URL_TOURS, body)
  },
  updateTour(body: TourUpdateFormData) {
    return http.put<SuccessResponse<Tour>>(URL_TOURS, body)
  },
  deleteTour(id: string) {
    return http.delete<SuccessResponse<void>>(`${URL_TOURS}/${id}`)
  },
  searchTours(params: QueryConfig) {
    return http.get<SuccessResponseWithPagination<Tour[]>>(URL_TOURS + '/search', { params })
  },
  getToursOfGuide(id: string) {
    return http.get<SuccessResponse<Tour[]>>(`${URL_TOURS}/guide/${id}`)
  },
  getStartTimeOfTour(tourId: number, params: StartTimeParams) {
    return http.get<SuccessResponse<string[]>>(`${URL_TOURS}/${tourId}/tour-start-time-available`, { params })
  },
  createRequestTour(requestId: number, body: TourFormData) {
    return http.post<SuccessResponse<Tour>>(`${URL_TOURS}/${requestId}`, body)
  },
  getPendingTours() {
    return http.get<SuccessResponse<Tour[]>>(`${URL_TOURS}/pending`)
  },
  acceptPendingTour(tourId: number) {
    return http.put<SuccessResponse<Tour>>(`${URL_TOURS}/accept/${tourId}`)
  },
  denyPendingTour(tourId: number) {
    return http.put<SuccessResponse<Tour>>(`${URL_TOURS}/deny/${tourId}`)
  },
  getToursWithStatus(params: PaginationParams) {
    return http.get<SuccessResponse<ToursResult>>(`${URL_TOURS}/admin`, { params })
  }
}

export default tourApi
