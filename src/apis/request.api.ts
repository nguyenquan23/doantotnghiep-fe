import { Request } from 'src/types/request.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'
import { RequestTourFormData } from '../pages/RequestTour/RequestTour'

const URL_TRAVELER_REQUEST = 'traveler-requests'

const requestApi = {
  createRequest(body: RequestTourFormData) {
    return http.post<SuccessResponse<Request>>(URL_TRAVELER_REQUEST, body)
  },
  getRequests() {
    return http.get<SuccessResponse<Request[]>>(URL_TRAVELER_REQUEST)
  },
  updateRequestStatus(id: number, body: { status: string }) {
    return http.patch<SuccessResponse<Request>>(`${URL_TRAVELER_REQUEST}/${id}`, body)
  }
}

export default requestApi
