import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import BookingSummaryCard from 'src/components/BookingSummaryCard/BookingSummaryCard'
import Loading from 'src/pages/Loading/Loading'
import { Booking } from 'src/types/booking.type'

interface BookingContentProps {
  bookingList?: Booking[]
}

const BookingContent: React.FC<BookingContentProps> = ({ bookingList }: BookingContentProps) => {
  const { t } = useTranslation()
  return (
    <Box>
      {!bookingList ? (
        <Loading />
      ) : bookingList.length > 0 ? (
        bookingList.map((bookingCartData, index) => <BookingSummaryCard key={index} booking={bookingCartData} />)
      ) : (
        <div className='flex h-[400px] flex-col items-center justify-center'>
          <img
            src='/assets/images/empty-booking.png'
            alt='Empty booking'
            loading='lazy'
            className='h-52 w-52 object-cover'
          />
          <h3>{t('pages.bookingManagement.noBooking')}</h3>
        </div>
      )}
    </Box>
  )
}
export default BookingContent
