import { GuideApplicationType } from 'src/types/guide-application.type'
import { User } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

export const URL_GUIDE_APPLICATION = 'guide-applications'

const guideApplicationApi = {
  createGuideApplication(body: GuideApplicationType) {
    return http.post<SuccessResponse<User>>(`${URL_GUIDE_APPLICATION}`, body)
  }
}

export default guideApplicationApi
