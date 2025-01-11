import { StatusRequest } from 'src/enums/status-request.enum'
import { Unit } from 'src/enums/unit.enum'
import { Guide } from './guide.type'
import { Tour } from './tour.type'
import { User } from './user.type'

export type Request = {
  id: number
  transportation: string[]
  duration: number
  unit: Unit
  maxPricePerPerson: number
  numberOfTravelers: number
  destination: string
  message: string
  guide: Guide
  traveler: User
  status: StatusRequest
  tour: Tour
  phone: string
}
