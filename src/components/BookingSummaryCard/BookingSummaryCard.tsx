import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Box, Divider } from '@mui/material'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import Collapse from '@mui/material/Collapse'
import Rating from '@mui/material/Rating'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import ClockIcon from 'src/assets/svg/clock.svg'
import UsersIcon from 'src/assets/svg/users.svg'
import MainStop from 'src/components/MainStop/MainStop'
import { useToggle } from 'src/hooks/useToggle'
import { Booking } from 'src/types/booking.type'
import { formatDateLocaleString, formatTime } from 'src/utils/date-time'

interface BookingSummaryCardProps {
  booking: Booking
  autoOpenDetails?: boolean
}

const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
  booking,
  autoOpenDetails = false
}: BookingSummaryCardProps) => {
  const [openCollapse, toggleCollapse] = useToggle(autoOpenDetails)
  const { t } = useTranslation()

  return (
    <Card className='mb-4 rounded-lg border-2 shadow-none'>
      <Box className='flex items-end justify-between'>
        <CardHeader
          avatar={
            <CardMedia
              className='h-16 w-16 rounded-lg object-cover'
              component='img'
              alt='Tour image'
              src={booking.tour.images[0]?.imageLink || '/assets/images/default-cover.jpg'}
              loading='lazy'
            />
          }
          title={
            <div className='item-card__header'>
              <div className='title text-lg font-medium'>{booking.tour.name}</div>
              <div className='text-sm'>
                {t('components.bookingSummaryCard.providedBy')}{' '}
                <span className='text-sm underline'>{booking.guide?.fullName || booking.guide?.email}</span>
              </div>
              <div className='rating flex'>
                <div className='activity-rating flex items-center gap-1 '>
                  <Rating max={5} precision={0.1} value={booking.tour.overallRating} size='large' readOnly />
                  <div className='text-sm font-medium'>{booking.tour.overallRating.toFixed(2)}</div>
                </div>
              </div>
            </div>
          }
        />
        <Typography
          className='hidden p-4 text-lg font-extrabold sm:block sm:text-xl md:text-2xl'
          sx={{ color: (theme) => theme.palette.secondary.main }}
        >
          ${booking.price.toLocaleString()}
        </Typography>
      </Box>
      <CardContent className='flex flex-col gap-2 md:flex-row'>
        <div className='flex flex-wrap gap-2'>
          <div className='mr-4 flex items-center font-normal'>
            <ClockIcon className='mb-[2px] mr-2 h-4 w-4' />
            <div className='text-sm font-medium capitalize'>
              {formatDateLocaleString(booking.startDate)} -{' '}
              {formatTime(booking.startDate.toString().split('T')[1], 'HH:mm:ss', 'HH:mm')}
            </div>
          </div>
          <div className='mr-4 flex items-center font-normal'>
            <UsersIcon className='mb-[2px] mr-2 h-4 w-4' />
            <div className='text-sm font-medium'>
              {booking.numberTravelers} {t('components.bookingSummaryCard.persons')}
            </div>
          </div>
        </div>
        <Button
          variant='outlined'
          endIcon={openCollapse ? <ExpandLess /> : <ExpandMore />}
          onClick={() => toggleCollapse()}
          className='ml-auto'
        >
          {!openCollapse
            ? t('components.bookingSummaryCard.viewDetails')
            : t('components.bookingSummaryCard.hideDetails')}
        </Button>
      </CardContent>
      <Collapse in={openCollapse} timeout='auto' unmountOnExit>
        <Box className='border-t-[1px] p-4'>
          <MainStop
            locations={booking.tour.locations}
            orientation='vertical'
            isShowAddress={true}
            titleClassName='text-lg font-semibold'
          />
        </Box>
      </Collapse>
      <Divider />
      <div className='flex justify-between px-4 py-2 sm:hidden'>
        <div className='text-lg font-extrabold'>Price</div>
        <div className='flex flex-col items-end'>
          <Typography className='text-lg font-extrabold' sx={{ color: (theme) => theme.palette.secondary.main }}>
            ${booking.price.toLocaleString()}
          </Typography>
        </div>
      </div>
    </Card>
  )
}

export default BookingSummaryCard
