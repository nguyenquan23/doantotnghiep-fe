import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import cartApi from 'src/apis/cart.api'
import BookingSummaryCard from 'src/components/BookingSummaryCard/BookingSummaryCard'
import { AppContext } from 'src/contexts/app.context'
import Loading from 'src/pages/Loading/Loading'
import { BookingsInCart } from 'src/types/booking.type'
import { totalBookingPrice as totalBookingPriceFunction } from 'src/utils/sum'

interface OrderSummaryProps {
  bookingId?: number
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ bookingId }: OrderSummaryProps) => {
  const { profile } = useContext(AppContext)
  const { t } = useTranslation()
  const { data: bookingsCartData } = useQuery({
    queryKey: [`booking in cart by ${profile?.id}`],
    queryFn: () => cartApi.getBookingsInCart(),
    placeholderData: keepPreviousData,
    staleTime: 6 * 1000
  })
  const totalBookingPrice = totalBookingPriceFunction(bookingsCartData?.data.data.bookings)
  const totalBookingLength = bookingsCartData?.data.data.bookings.length

  return (
    <>
      <h2 className='pb-3'>Order summary</h2>
      <Box>
        {bookingsCartData ? (
          bookingId ? (
            <BookingSummaryCard
              booking={(bookingsCartData.data.data as BookingsInCart).bookings.slice(-1)[0]}
              autoOpenDetails
            />
          ) : (
            (bookingsCartData.data.data as BookingsInCart).bookings!.map((bookingCartData, index) => (
              <BookingSummaryCard key={index} booking={bookingCartData} autoOpenDetails />
            ))
          )
        ) : (
          <Loading />
        )}
      </Box>
      <Box className='mt-4 flex justify-between rounded-b-md  bg-slate-100 px-4 py-2'>
        <div className='t text-lg font-extrabold'>
          {t('pages.checkout.total')} ({bookingId ? 1 : totalBookingLength} {t('pages.checkout.items')})
        </div>
        <div className='flex flex-col items-end'>
          <Typography
            className='text-lg font-semibold sm:text-xl md:text-2xl'
            sx={{ color: (theme) => theme.palette.secondary.main }}
          >
            $
            {!bookingId
              ? totalBookingPrice?.toLocaleString()
              : bookingsCartData
                ? (bookingsCartData.data.data as BookingsInCart).bookings.slice(-1)[0].price
                : 0}
          </Typography>
          <div className='text-xs font-medium text-emerald-700'>{t('pages.checkout.allTaxesFees')}</div>
        </div>
      </Box>
    </>
  )
}

export default OrderSummary
