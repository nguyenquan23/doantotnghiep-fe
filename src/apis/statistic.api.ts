import { PaginationParams } from 'src/types/pagination-params.type'
import {
  GuideStatisticResult,
  PopularGuideResult,
  TourStatisticResult,
  ToursOfGuideStatisticResult,
  YearStatisticResult
} from 'src/types/statistic.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL_STATISTIC = 'statistic'

const statisticApi = {
  getStatisticOfTour(params: PaginationParams) {
    return http.get<SuccessResponse<TourStatisticResult>>(`${URL_STATISTIC}/tours`, { params })
  },
  getStatisticOfTourByGuide(params: PaginationParams) {
    return http.get<SuccessResponse<ToursOfGuideStatisticResult>>(`${URL_STATISTIC}/guide/tours`, { params })
  },
  getStatisticOfGuide(params: PaginationParams) {
    return http.get<SuccessResponse<GuideStatisticResult>>(`${URL_STATISTIC}/guides`, { params })
  },
  getYearStatisticOfTourByAdmin(year: number) {
    return http.get<SuccessResponse<YearStatisticResult>>(`${URL_STATISTIC}/month/admin/${year}`)
  },
  getYearStatisticOfTourByGuide(year: number) {
    return http.get<SuccessResponse<YearStatisticResult>>(`${URL_STATISTIC}/month/guide/${year}`)
  },
  getStatisticOfPopularGuide() {
    return http.get<SuccessResponse<PopularGuideResult[]>>(`${URL_STATISTIC}/popular`)
  }
}

export default statisticApi
