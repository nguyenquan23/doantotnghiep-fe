import { TourCategory } from 'src/types/tour.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL_CATEGORIES = 'categories'

const categoryApi = {
  getCategories() {
    return http.get<SuccessResponse<TourCategory[]>>(URL_CATEGORIES)
  }
}

export default categoryApi
