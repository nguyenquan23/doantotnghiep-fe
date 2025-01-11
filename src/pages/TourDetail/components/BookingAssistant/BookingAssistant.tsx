/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from '@hookform/resolvers/yup'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import Button from '@mui/material/Button'
import OutlinedInput from '@mui/material/OutlinedInput'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { Controller, useForm } from 'react-hook-form'
import scheduleApi from 'src/apis/schedule.api'
import { bookingSchema } from 'src/utils/rules'
import { BookingAssistantFormData } from '../../TourDetail'
import { useTranslation } from 'react-i18next'

dayjs.extend(isSameOrBefore)

const bookingFormSchema = bookingSchema.pick(['numberTravelers', 'startDate'])

interface BookingAssistantProps {
  id: number
  onSubmit: (data: BookingAssistantFormData) => void
  limitTraveler: number
}

const BookingAssistant: React.FC<BookingAssistantProps> = ({ onSubmit, id, limitTraveler }: BookingAssistantProps) => {
  const { t } = useTranslation()
  const {
    trigger,
    control,
    formState: { errors },
    handleSubmit
  } = useForm<BookingAssistantFormData>({
    defaultValues: {
      numberTravelers: 1
    },
    resolver: yupResolver(bookingFormSchema)
  })

  const { data: busySchedulesQuery } = useQuery({
    queryKey: [`Get busy schedules of tour ${id}`, id],
    queryFn: () => scheduleApi.getBusySchedulesOfTour(id),
    enabled: id !== 0
  })

  const checkBusyDate = (date: Date) => {
    if (busySchedulesQuery?.data.data) {
      return busySchedulesQuery.data.data.some((busyDate) => dayjs(date).isSame(busyDate, 'day'))
    }
    return false
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-4 rounded-3xl bg-[var(--decorative-midnight-blue)] px-3 py-5 text-white'
    >
      <div className='font-semibold'>{t('pages.tourDetails.selectParticipantsDate')}</div>
      <div className='flex flex-col gap-4'>
        <Controller
          control={control}
          name='numberTravelers'
          render={({ field }) => (
            <OutlinedInput
              {...field}
              placeholder='Participant(s)'
              className='rounded-sm'
              type='number'
              endAdornment={<PersonOutlineOutlinedIcon sx={{ color: '#757575', marginRight: '-5px' }} />}
              sx={{
                bgcolor: 'white',
                '.MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                }
              }}
              inputProps={{
                min: 1,
                max: limitTraveler
              }}
              onChange={(event) => {
                field.onChange(event)
                trigger('numberTravelers')
              }}
            />
          )}
        />
        {errors.numberTravelers && <div className='pb-3 text-xs text-red-500'>{errors.numberTravelers?.message}</div>}
        <Controller
          control={control}
          name='startDate'
          render={({ field }) => (
            <DatePicker
              className='rounded-sm'
              disablePast={true}
              shouldDisableDate={checkBusyDate}
              onChange={(date) => {
                field.onChange(date)
                trigger('startDate')
              }}
              sx={{
                bgcolor: 'white',
                width: '100%',
                '.MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: 'black'
                }
              }}
              slotProps={{
                textField: {
                  disabled: true
                }
              }}
            />
          )}
        />
        {errors.startDate && <div className='text-xs text-red-500'>{errors.startDate.message}</div>}
      </div>
      <Button
        type='submit'
        className='mr-2 w-[100%] rounded-full pr-7 font-semibold md:inline-block'
        variant='contained'
        size='large'
      >
        {t('pages.tourDetails.checkAvailability')}
      </Button>
    </form>
  )
}

export default BookingAssistant
