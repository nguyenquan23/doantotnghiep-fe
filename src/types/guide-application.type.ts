import { GuideApplicationStatus } from 'src/enums/guide-application-status'

export type GuideApplicationType = {
  userId: number | null
  email: string
  password: string
  fullName: string
  dateOfBirth: Date | string
  phone: string
  address: string
  isLicensedGuide: boolean
  transportation: string
  yearsOfExperience: number
  licenseImages: string[]
}

export type GuideApplicationData = { status: GuideApplicationStatus; reasonDeny?: string }
