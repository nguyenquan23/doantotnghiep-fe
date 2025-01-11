import { yupResolver } from '@hookform/resolvers/yup'
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import FormHelperText from '@mui/material/FormHelperText'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select from '@mui/material/Select'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Dispatch, SetStateAction, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tourApi from 'src/apis/tour.api'
import ClockIcon from 'src/assets/svg/clock.svg'
import UsersIcon from 'src/assets/svg/users.svg'
import { Booking } from 'src/types/booking.type'
import { formatDate, formatTime } from 'src/utils/date-time'
import { BookingSchema, bookingSchema } from 'src/utils/rules'

type BookingFormData = Pick<BookingSchema, 'numberTravelers' | 'startDate' | 'startTime'>
const bookingFormSchema = bookingSchema.pick(['numberTravelers', 'startDate', 'startTime'])

interface Props {
  setEditMode?: Dispatch<SetStateAction<boolean>>
  onSubmit: (data: BookingFormData) => void
  booking?: Booking
}

export default function CartBookingForm({ setEditMode, booking, onSubmit }: Props) {
  const initialStartTime = formatTime(booking?.startDate.toString().split('T')[1] as string, 'HH:mm:ss', 'HH:mm')
  const { t } = useTranslation()
  const {
    trigger,
    control,
    handleSubmit,
    getValues,
    resetField,
    formState: { errors }
  } = useForm<BookingFormData>({
    defaultValues: {
      numberTravelers: booking?.numberTravelers,
      startDate: booking?.startDate,
      startTime: initialStartTime
    },
    resolver: yupResolver(bookingFormSchema)
  })
  const { data: startTimeData } = useQuery({
    queryKey: ['startTimeData', getValues('startDate')],
    queryFn: () =>
      tourApi.getStartTimeOfTour(booking?.tour.id as number, {
        localDate: formatDate(getValues('startDate'), 'YYYY-MM-DD')
      })
  })
  const [isStartDateChange, setIsStartTimeChange] = useState<boolean>(false)

  const handleCancel = () => {
    if (setEditMode) {
      setEditMode(false)
    }
  }

  return (
    <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
      <div className='flex flex-col gap-1 font-normal'>
        <div className='flex items-center'>
          <UsersIcon className='mb-[2px] mr-2 h-5 w-5' />
          <Controller
            control={control}
            name='numberTravelers'
            render={({ field }) => (
              <OutlinedInput
                {...field}
                placeholder='Participant(s)'
                className='rounded-md'
                type='number'
                onChange={(event) => {
                  field.onChange(event)
                  trigger('numberTravelers')
                }}
                sx={{
                  bgcolor: 'white',
                  width: '200px'
                }}
              />
            )}
          />
        </div>
        {errors.numberTravelers && (
          <div className='pb-3 pl-7 text-xs text-red-500'>{errors.numberTravelers?.message}</div>
        )}
        <div className='flex items-center'>
          <ClockIcon className='mb-[2px] mr-2 h-5 w-5' />
          <div className='flex gap-2'>
            <Controller
              control={control}
              name='startDate'
              render={({ field }) => (
                <DatePicker
                  disablePast
                  defaultValue={dayjs(booking?.startDate)}
                  onChange={(event) => {
                    field.onChange(event)
                    trigger('startDate')
                    setIsStartTimeChange(true)
                    resetField('startTime', { defaultValue: '' })
                  }}
                  sx={{
                    bgcolor: 'white',
                    border: '8px',
                    minWidth: '200px'
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name='startTime'
              render={({ field }) => (
                <Box className='flex flex-col'>
                  <Select
                    {...field}
                    MenuProps={{ disableScrollLock: true }}
                    sx={{ minWidth: '160px' }}
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('startTime')
                    }}
                  >
                    {!isStartDateChange && <MenuItem value={initialStartTime}>{initialStartTime}</MenuItem>}
                    {startTimeData?.data.data.map((time, index) => (
                      <MenuItem value={time} key={index}>
                        {formatTime(time, 'HH:mm:ss', 'HH:mm')}
                      </MenuItem>
                    ))}
                  </Select>
                  {!!errors.startTime && <FormHelperText error>{errors.startTime.message}</FormHelperText>}{' '}
                </Box>
              )}
            />
          </div>
        </div>
        {errors.startDate && <div className='pl-7 text-xs text-red-500'>{errors.startDate.message}</div>}
      </div>
      {setEditMode && (
        <div className='flex gap-2'>
          <Button
            type='submit'
            className='flex h-10 w-10 cursor-pointer gap-1 rounded-full border-none'
            variant='contained'
          >
            <span className='text-sm font-medium'>{t('pages.cart.save')}</span>
          </Button>
          <Button
            onClick={handleCancel}
            className='flex h-10 w-10 cursor-pointer gap-1 rounded-full'
            variant='outlined'
          >
            <span className='text-sm font-medium'>{t('pages.cart.cancel')}</span>
          </Button>
        </div>
      )}
    </form>
  )
}
