import { Box } from '@mui/material'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useQuery } from '@tanstack/react-query'
import { SyntheticEvent, useContext, useEffect, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'
import bookingApi from 'src/apis/booking.api'
import TabPanel from 'src/components/TabPanel/TabPanel'
import { AppContext } from 'src/contexts/app.context'
import theme from 'src/theme'
import { Booking } from 'src/types/booking.type'
import { compareDate } from 'src/utils/date-time'
import { a11yProps } from 'src/utils/tab-panel'
import Loading from '../Loading/Loading'
import BookingContent from './components/BookingContent/BookingContent'
import { useTranslation } from 'react-i18next'

const Bookings: React.FC = () => {
  const { isAuthenticated, profile } = useContext(AppContext)
  const [value, setValue] = useState<number>(0)
  const { t } = useTranslation()
  const { data: bookingsHistoryData } = useQuery({
    queryKey: [`get bookings history of user ${profile?.email}`],
    queryFn: () => bookingApi.getBookingsHistory(),
    staleTime: 10 * 1000
  })
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([])
  const [pastBookings, setPastBookings] = useState<Booking[]>([])

  useEffect(() => {
    if (bookingsHistoryData?.data.data) {
      setUpcomingBookings(
        bookingsHistoryData?.data.data.filter((booking) => {
          return compareDate(booking.startDate, new Date()) > 0
        })
      )
      setPastBookings(
        bookingsHistoryData?.data.data.filter((booking) => {
          return compareDate(booking.startDate, new Date()) < 0
        })
      )
    }
  }, [bookingsHistoryData])

  const handleChange = (_: SyntheticEvent, newValue: number) => setValue(newValue)

  const handleChangeIndex = (index: number) => setValue(index)

  if (!isAuthenticated)
    return (
      <div className='flex h-full flex-col items-center justify-center'>
        <img
          loading='lazy'
          src='/assets/images/empty-booking.png'
          alt='Empty booking'
          className='h-52 w-52 object-cover'
        />
        <h3>{t('pages.bookings.signInFirst')}</h3>
      </div>
    )

  return (
    <Box className='container flex h-full flex-col'>
      {!bookingsHistoryData?.data.data && <Loading />}
      {bookingsHistoryData?.data.data && bookingsHistoryData.data.data.length > 0 && (
        <>
          <h2 className='my-bookings__title pt-5'>{t('pages.bookings.myBookings')}</h2>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor='secondary'
            textColor='inherit'
            className='mt-3 rounded-xl border shadow-none'
            sx={{
              color: (theme) => theme.palette.primary.main,
              backgroundColor: (theme) => theme.palette.common.white,
              borderColor: (theme) => theme.palette.primary.main
            }}
            centered
          >
            <Tab className='w-1/3' label={t('pages.bookings.all')} {...a11yProps(1)} />
            <Tab className='w-1/3' label={t('pages.bookings.upcomingBookings')} {...a11yProps(2)} />
            <Tab className='w-1/3' label={t('pages.bookings.pastBookings')} {...a11yProps(3)} />
          </Tabs>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={1} index={1} direction={theme.direction}>
              <BookingContent bookingList={bookingsHistoryData?.data.data} />
            </TabPanel>
            <TabPanel value={2} index={2} direction={theme.direction}>
              <BookingContent bookingList={upcomingBookings} />
            </TabPanel>
            <TabPanel value={3} index={3} direction={theme.direction}>
              <BookingContent bookingList={pastBookings} />
            </TabPanel>
          </SwipeableViews>
        </>
      )}
      {bookingsHistoryData?.data.data && bookingsHistoryData.data.data.length === 0 && (
        <div className='mt-48 flex h-full flex-col items-center justify-center'>
          <img
            loading='lazy'
            src='/assets/images/empty-booking.png'
            alt='Empty booking'
            className='h-52 w-52 object-cover'
          />
          <h3>{t('pages.bookingManagement.noBooking')}</h3>
        </div>
      )}
    </Box>
  )
}

export default Bookings
