import { PassengerInformationSchema } from 'src/utils/rules'

export type CryptoPaymentData = {
  amount: number
  buyer_email: string
  bookingIds: string
  passengerInfo: PassengerInformationSchema
}
