import { GuideApplicationStatus } from 'src/enums/guide-application-status'
import { ImageWithLink } from './tour.type'
import { User } from './user.type'

type LanguageSkill = {
  id: number
  language: string
  level: string
}

export type Guide = {
  id: number
  email: string
  fullName: string
  dateOfBirth: Date
  phone: string
  address: string
  biography: string
  credential: string
  overallRating: number
  avatar: string
  languageSkill: LanguageSkill[]
  numberOfReviews: number
}

export type GuideApplication = {
  id: number
  isLicensedGuide: boolean
  transportation: string
  yearsOfExperience: number
  howGuideHearAboutUs: string
  status: GuideApplicationStatus
  reasonDeny: string
  user: User
  images: ImageWithLink[]
  biography: string
}
