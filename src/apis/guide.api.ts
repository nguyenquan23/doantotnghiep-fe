import { QueryConfig } from 'src/hooks/useQueryConfig'
import { Guide, GuideApplication } from 'src/types/guide.type'
import { SuccessResponse, SuccessResponseWithPagination } from 'src/types/utils.type'
import http from 'src/utils/http'
import { GuideApplicationData } from './../types/guide-application.type'
import { Booking } from 'src/types/booking.type'

const URL_SEARCH_GUIDES = 'guides/search'
const GUIDE = 'guides'
const GUIDE_APPLICATIONS = 'guide-applications'
const GUIDE_BOOKINGS = 'guides/bookings'

const guideApi = {
  searchGuides(params: QueryConfig) {
    return http.get<SuccessResponseWithPagination<Guide[]>>(URL_SEARCH_GUIDES, { params })
  },
  getProfile(id: string) {
    return http.get<SuccessResponse<Guide>>(`${GUIDE}/${id}`)
  },
  getGuideApplications() {
    return http.get<SuccessResponse<GuideApplication[]>>(GUIDE_APPLICATIONS)
  },
  getGuideApplicationById(applicationId: number) {
    return http.get<SuccessResponse<GuideApplication>>(`${GUIDE_APPLICATIONS}/${applicationId}`)
  },
  updateStatusApplication(applicationId: number, body: GuideApplicationData) {
    return http.patch<SuccessResponse<[]>>(`${GUIDE_APPLICATIONS}/${applicationId}`, body)
  },
  getBookings() {
    return http.get<SuccessResponse<Booking[]>>(GUIDE_BOOKINGS)
  }
}

export default guideApi
