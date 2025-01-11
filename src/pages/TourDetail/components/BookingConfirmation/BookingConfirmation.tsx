/* eslint-disable @typescript-eslint/no-explicit-any */
import AlarmOnIcon from '@mui/icons-material/AlarmOn'
import TimelapseIcon from '@mui/icons-material/Timelapse'
import LoadingButton from '@mui/lab/LoadingButton'
import { Divider } from '@mui/material'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import cartApi from 'src/apis/cart.api'
import CalendarCheckIcon from 'src/assets/svg/calendar-check.svg'
import GuideIcon from 'src/assets/svg/guide.svg'
import LocationIcon from 'src/assets/svg/location.svg'
import PATH from 'src/constants/path.constant'
import { AppContext } from 'src/contexts/app.context'
import { BookingConfirmationAction } from 'src/enums/booking-confirmation.enum'
import { Unit } from 'src/enums/unit.enum'
import { Booking } from 'src/types/booking.type'
import { Tour } from 'src/types/tour.type'
import { convertHourToUTC7, formatDate, formatTime } from 'src/utils/date-time'
import { BookingAssistantFormData } from '../../TourDetail'
import { useTranslation } from 'react-i18next'

interface Props {
  timeOptions?: string[]
  formData: BookingAssistantFormData
  tour: Tour
}

export type AddBookingForm = Omit<Booking, 'status' | 'tour'>

export default function BookingConfirmation({ timeOptions, formData, tour }: Props) {
  const { isAuthenticated } = useContext(AppContext)
  const [selectedTimeOption, setSelectedTimeOption] = useState<string | undefined>(undefined)
  const [totalPrice, setTotalPrice] = useState(0)
  const [stateButton, setStateButton] = useState<'bookNow' | 'addCart'>()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleOptionClick = (option: string) => setSelectedTimeOption(option)

  const [bookingFormData, setBookingFormData] = useState<AddBookingForm>({
    id: tour.id,
    startDate: formData.startDate,
    numberTravelers: formData.numberTravelers,
    price: totalPrice
  })

  useEffect(() => {
    const data = {
      ...bookingFormData,
      startDate: selectedTimeOption
        ? new Date(
            new Date(dayjs(formData.startDate).format('YYYY-MM-DD') + 'T' + convertHourToUTC7(selectedTimeOption))
          )
        : bookingFormData.startDate,
      price: totalPrice
    }
    setBookingFormData(data)
  }, [selectedTimeOption, totalPrice])

  useEffect(() => {
    setTotalPrice(tour.pricePerTraveler * formData.numberTravelers)
  }, [formData])

  const addBookingMutation = useMutation({
    mutationFn: (body: AddBookingForm) => cartApi.createBookingInCart(body)
  })

  useEffect(() => {
    if (stateButton === BookingConfirmationAction.addCart || stateButton === BookingConfirmationAction.BookNow)
      handleAddBooking()
  }, [stateButton])

  const handleAddBooking = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in before adding tour to your cart.')
      return
    }
    if (selectedTimeOption === undefined) return

    addBookingMutation.mutate(bookingFormData, {
      onSuccess: (data) => {
        if (stateButton === BookingConfirmationAction.addCart) {
          toast.success('Add booking in cart successfully.')
          navigate(PATH.cart)
          return
        }
        navigate(PATH.checkout, { state: { bookingId: data.data.data.bookings.slice(-1)[0].id } })
      },
      onError: (error: any) => {
        toast.error(error.response.data.message)
      }
    })
  }

  return (
    <Card className='rounded-xl border-2 border-blue-500'>
      <div className='flex flex-col gap-3 p-4'>
        <div className='booking-info flex flex-col gap-2'>
          <div className='title font-medium'>{tour.name}</div>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center text-base font-normal'>
              <TimelapseIcon className='mb-[2px] mr-2 h-6 w-6' />
              <div className='text-sm font-medium text-gray-500'>
                {tour.duration} {t(`pages.tourDetails.${tour.unit}`)}
              </div>
            </div>
            {!(tour.unit === Unit.HOURS && tour.duration < 5) && (
              <div className='flex items-center text-base font-normal'>
                <AlarmOnIcon className='mb-[2px] mr-2 h-6 w-6' />
                <div className='text-sm font-medium text-gray-500'>
                  {t('pages.tourDetails.startFrom')} {formatTime(tour.startTimes[0], 'HH:mm:ss', 'HH:mm')}
                </div>
              </div>
            )}
            <div className='flex items-center font-normal'>
              <GuideIcon className='mb-[2px] mr-2 h-6 w-6' />
              <div className='text-sm font-medium text-gray-500'>
                {t('pages.tourDetails.guide')}: {tour.guide['fullName'] || 'N/A'}
              </div>
            </div>
            <div className='flex items-center font-normal'>
              <LocationIcon className='mb-[2px] mr-2 h-6 w-6' />
              <p className='text-sm font-medium  underline'>
                {t('pages.tourDetails.meetAt')} {tour.locations[0].name} ({tour.locations[0].address})
              </p>
            </div>
          </div>
        </div>
        <Divider />
        {timeOptions && (
          <>
            <div className='starting-times flex flex-col gap-2'>
              <div className='font-medium'>
                {t('pages.tourDetails.selectTime')} {formatDate(formData.startDate, 'MM/DD/YYYY')}
              </div>
              <div className='flex flex-wrap gap-2'>
                {timeOptions.map((option) => (
                  <Button
                    key={option}
                    variant='outlined'
                    className={`${option === selectedTimeOption ? 'bg-[#1a2b49] text-white' : 'border-2 border-gray-300 text-black '} `}
                    onClick={() => handleOptionClick(option)}
                  >
                    {formatTime(option, 'HH:mm:ss', 'HH:mm')}
                  </Button>
                ))}
              </div>
            </div>
            {!selectedTimeOption && <div className='text-xs text-red-500'>{t('pages.tourDetails.selectATime')}</div>}
            <Divider />
          </>
        )}
        <div className='participants flex flex-col gap-2'>
          <div className='relative flex'>
            <div className='text-sm font-medium text-gray-500'>
              {t('pages.tourDetails.person')} {bookingFormData.numberTravelers}x $
              {tour.pricePerTraveler.toLocaleString()}
            </div>
            <div className='absolute right-2 text-sm font-medium text-gray-500'>${totalPrice.toLocaleString()}</div>
          </div>
          <div className='flex items-center font-normal'>
            <CalendarCheckIcon className='mb-[2px] mr-2 h-6 w-6' />
            <div className='text-sm font-medium'>{t('pages.tourDetails.cancelUp')}</div>
          </div>
        </div>
      </div>
      <div className='bg-slate-100 p-4 md:grid md:grid-cols-2 md:items-center'>
        <div className='md:col-span-1'>
          <div className='text-sm font-medium text-gray-600'>{t('pages.tourDetails.totalPrice')}</div>
          <div className='text-xl font-extrabold'>${totalPrice.toLocaleString()}</div>
          <div className='text-xs font-medium'>{t('pages.tourDetails.allTaxesAndFees')}</div>
        </div>
        <div className='flex flex-col gap-2 pt-2 md:col-span-1 md:flex-row md:justify-self-end '>
          <LoadingButton
            type='submit'
            className='mr-2 rounded-full pr-7 font-semibold md:inline-block'
            variant='outlined'
            size='large'
            loading={stateButton === BookingConfirmationAction.BookNow && addBookingMutation.isPending}
            onClick={() => setStateButton(BookingConfirmationAction.BookNow)}
          >
            {t('pages.tourDetails.bookNow')}
          </LoadingButton>
          <LoadingButton
            type='submit'
            loading={stateButton === BookingConfirmationAction.addCart && addBookingMutation.isPending}
            className='mr-2 rounded-full pr-7 font-semibold md:inline-block'
            variant='contained'
            size='large'
            onClick={() => setStateButton(BookingConfirmationAction.addCart)}
          >
            {t('pages.tourDetails.addToCart')}
          </LoadingButton>
        </div>
      </div>
    </Card>
  )
}
