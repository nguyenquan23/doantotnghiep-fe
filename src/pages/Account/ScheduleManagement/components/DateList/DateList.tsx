import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, IconButton } from '@mui/material'
import List from '@mui/material/List'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DateObject } from 'react-multi-date-picker'
import { DayStateEnum } from 'src/enums/day-state.enum'
import { EventState } from 'src/enums/event-state.enum'
import { SortOrder } from 'src/enums/sort-order.enum'
import { ScheduleList } from 'src/types/schedule.type'
import {
  ConvertDateArrayToDateObjectArray,
  compareDate,
  compareDateForDateList,
  formatDate,
  isInArr
} from 'src/utils/date-time'

interface DateListProps {
  schedule: ScheduleList
  handleDateChange: (date: DateObject[]) => void
}

const DateList: React.FC<DateListProps> = ({ schedule, handleDateChange }: DateListProps) => {
  const [pastBusyDates, setPastBusyDates] = useState<Date[]>([])
  const [futureBusyDates, setFutureBusyDates] = useState<Date[]>([])
  const [pastBookedByDay, setPastBookedByDay] = useState<Date[]>([])
  const [futureBookedByDay, setFutureBookedByDay] = useState<Date[]>([])
  const [pastBookedByHour, setPastBookedByHour] = useState<Date[]>([])
  const [futureBookedByHour, setFutureBookedByHour] = useState<Date[]>([])
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [dayState, setDayState] = useState<DayStateEnum>(DayStateEnum.DaysOff)
  const [temporaryState, setTemporaryState] = useState<EventState>(EventState.Upcoming)
  const [displayDates, setDisplayDates] = useState<Date[]>([])
  const { t } = useTranslation()

  const confirmDelete = () => {
    if (selectedDates.length < 1) return
    const oldDayOff = schedule.byGuide.map((d) => d.busyDate)
    handleDateChange(ConvertDateArrayToDateObjectArray(oldDayOff.filter((date) => !isInArr(date, selectedDates))))
    setSelectedDates([])
  }

  const handleDeleteDay = (date: Date) => () => {
    const newBusyDates = schedule.byGuide.filter((d) => d.busyDate !== date)
    handleDateChange(newBusyDates.map((d) => new DateObject(d.busyDate)))
  }

  const formattedData = (dateArr: Date[], type: SortOrder) => {
    const data = [...new Set(dateArr)]
    if (type === SortOrder.DESC) return data.sort((a, b) => compareDate(b, a))
    return data.sort((a, b) => compareDate(a, b))
  }

  const handleDayClick = (day: Date) => {
    const isDelete = selectedDates.includes(day)
    if (isDelete) {
      const newSelectedDates = selectedDates.filter((item) => item !== day)
      setSelectedDates(newSelectedDates)
      return
    }
    const newSelectedDates = [...selectedDates, day]
    setSelectedDates(newSelectedDates)
  }

  useEffect(() => {
    setPastBusyDates([])
    setFutureBusyDates([])
    setPastBookedByDay([])
    setFutureBookedByDay([])
    setPastBookedByHour([])
    setFutureBookedByHour([])

    schedule.byGuide.forEach((item) => {
      const busyDate = item.busyDate
      if (compareDateForDateList(busyDate, new Date())) {
        pastBusyDates.push(busyDate)
      } else {
        futureBusyDates.push(busyDate)
      }
    })

    schedule.byDay.forEach((item) => {
      const busyDate = item.busyDate
      if (compareDateForDateList(busyDate, new Date())) {
        pastBookedByDay.push(busyDate)
      } else {
        futureBookedByDay.push(busyDate)
      }
    })

    schedule.byHour.forEach((item) => {
      const busyDate = item.busyDate
      if (compareDateForDateList(busyDate, new Date())) {
        pastBookedByHour.push(busyDate)
      } else {
        futureBookedByHour.push(busyDate)
      }
    })

    if (dayState.toString() === DayStateEnum.DaysOff) {
      if (temporaryState.toString() === EventState.Upcoming) {
        setDisplayDates(formattedData(futureBusyDates, SortOrder.ASC))
        return
      }
      setDisplayDates(formattedData(pastBusyDates, SortOrder.DESC))
      return
    }

    if (dayState.toString() === DayStateEnum.BookedByHour) {
      if (temporaryState.toString() === EventState.Upcoming) {
        setDisplayDates(formattedData(futureBookedByHour, SortOrder.ASC))
        return
      }
      setDisplayDates(formattedData(pastBookedByHour, SortOrder.DESC))
      return
    }

    if (temporaryState.toString() === EventState.Upcoming) {
      setDisplayDates(formattedData(futureBookedByDay, SortOrder.ASC))
      return
    }

    setDisplayDates(formattedData(pastBookedByDay, SortOrder.DESC))
    setSelectedDates([])
  }, [schedule, temporaryState, dayState])

  const handleBookedByDayButton = () => setDayState(DayStateEnum.BookedByDay)

  const handleBookedByHourButton = () => setDayState(DayStateEnum.BookedByHour)

  const handleDaysOffButton = () => setDayState(DayStateEnum.DaysOff)

  const handleUpcomingButton = () => setTemporaryState(EventState.Upcoming)

  const handlePastButton = () => setTemporaryState(EventState.Past)

  const shouldDisableButton = () => {
    if (selectedDates.length > 0) return false
    return true
  }

  return (
    <Box className='relative h-[380px] rounded-md border' sx={{ bgcolor: 'background.paper' }}>
      <Box className='flex flex-col items-center justify-center rounded-t-md'>
        <Box
          sx={{
            color: (theme) => theme.palette.primary.main,
            borderColor: (theme) => theme.palette.common.white,
            display: 'flex',
            flexWrap: 'wrap'
          }}
          className='w-full text-sm font-medium text-white'
        >
          <Button
            variant='outlined'
            size='small'
            onClick={handleDaysOffButton}
            className={classNames('w-[33.33%] rounded-none rounded-tl-md border-none uppercase', {
              'bg-[var(--highlight-error-background)]': dayState.toString() === DayStateEnum.DaysOff
            })}
            sx={{
              flex: '1 1 auto'
            }}
          >
            {t('pages.scheduleManagement.dayOff')}
          </Button>
          <Button
            onClick={handleBookedByDayButton}
            variant='outlined'
            size='small'
            className={classNames('w-[33.33%] rounded-none border-none uppercase', {
              'bg-[var(--highlight-warning-background)]': dayState.toString() === DayStateEnum.BookedByDay
            })}
            sx={{
              flex: '1 1 auto'
            }}
          >
            {t('pages.scheduleManagement.bookedByDay')}
          </Button>
          <Button
            onClick={handleBookedByHourButton}
            variant='outlined'
            size='small'
            className={classNames('w-[33.33%] rounded-none rounded-tr-md border-none uppercase', {
              'bg-[var(--highlight-success-background)]': dayState.toString() === DayStateEnum.BookedByHour
            })}
            sx={{
              flex: '1 1 auto'
            }}
          >
            {t('pages.scheduleManagement.bookedByHour')}
          </Button>
        </Box>
        <Box
          className={classNames('flex w-full border-y', {
            'border-t-yellow-500': dayState.toString() === DayStateEnum.BookedByDay,
            'border-t-green-500': dayState.toString() === DayStateEnum.BookedByHour,
            'border-t-red-500': dayState.toString() === DayStateEnum.DaysOff
          })}
        >
          <Button
            className={classNames('w-[50%] rounded-none border-none font-normal', {
              'bg-[var(--highlight-warning-background)]': dayState.toString() === DayStateEnum.BookedByDay,
              'bg-transparent':
                (dayState.toString() === DayStateEnum.BookedByDay ||
                  dayState.toString() === DayStateEnum.BookedByHour ||
                  dayState.toString() === DayStateEnum.DaysOff) &&
                temporaryState.toString() === EventState.Past,
              'bg-[var(--highlight-success-background)]':
                dayState.toString() === DayStateEnum.BookedByHour && temporaryState.toString() === EventState.Upcoming,
              'bg-[var(--highlight-error-background)]': dayState.toString() === DayStateEnum.DaysOff
            })}
            variant='outlined'
            size='small'
            onClick={handleUpcomingButton}
          >
            {t('pages.scheduleManagement.upcoming')}
          </Button>
          <Button
            onClick={handlePastButton}
            className={classNames('w-[50%]', 'rounded-none', 'border-none', 'font-normal', {
              'bg-[var(--highlight-error-background)]': dayState.toString() === DayStateEnum.DaysOff,
              'bg-[var(--highlight-warning-background)]': dayState.toString() === DayStateEnum.BookedByDay,
              'bg-transparent':
                (dayState.toString() === DayStateEnum.BookedByDay ||
                  dayState.toString() === DayStateEnum.BookedByHour ||
                  dayState.toString() === DayStateEnum.DaysOff) &&
                temporaryState.toString() === EventState.Upcoming,
              'bg-[var(--highlight-success-background)]':
                dayState.toString() === DayStateEnum.BookedByHour && temporaryState.toString() === EventState.Past
            })}
            variant='outlined'
            size='small'
          >
            {t('pages.scheduleManagement.past')}
          </Button>
        </Box>
      </Box>
      <List
        style={{ maxHeight: '75%', overflow: 'auto' }}
        disablePadding
        className='rounded-b-md px-2 pt-2'
        subheader={<li />}
      >
        {displayDates.map((item, index) => (
          <Box
            sx={{ borderColor: (theme) => theme.palette.primary.main }}
            key={index}
            className={classNames('mx-4 my-1 rounded-md border py-1 md:mx-0 lg:mx-4', {
              'bg-[var(--highlight-error-background)]': isInArr(item, selectedDates)
            })}
          >
            <Box
              sx={{ color: (theme) => theme.palette.primary.main }}
              className={classNames('grid items-center  px-3', {
                'grid-flow-col justify-items-end':
                  dayState.toString() === DayStateEnum.DaysOff && temporaryState.toString() === EventState.Upcoming,
                'justify-items-center': dayState.toString() === 'bookedDays'
              })}
              onClick={(event) => {
                if (dayState === DayStateEnum.DaysOff && temporaryState == EventState.Upcoming)
                  event.stopPropagation(), handleDayClick(item)
              }}
            >
              {dayState.toString() === DayStateEnum.BookedByHour ? (
                <div className='grid justify-center'>{formatDate(new Date(item), ' HH:mm - MM/DD/YYYY')}</div>
              ) : (
                <div className='grid justify-center'>{formatDate(new Date(item), 'MM/DD/YYYY')}</div>
              )}
              {dayState.toString() === DayStateEnum.DaysOff && temporaryState.toString() === EventState.Upcoming && (
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation(), handleDeleteDay(item)()
                  }}
                  className='p-0'
                >
                  <CloseIcon
                    className='h-4 w-4'
                    sx={{
                      color: (theme) => theme.palette.primary.main
                    }}
                  />
                </IconButton>
              )}
            </Box>
          </Box>
        ))}
      </List>
      {dayState === DayStateEnum.DaysOff && temporaryState == EventState.Upcoming && (
        <Button
          disabled={shouldDisableButton()}
          variant='contained'
          className='absolute bottom-0 w-full rounded-none rounded-b-md'
          onClick={confirmDelete}
        >
          {t('pages.scheduleManagement.delete')}
        </Button>
      )}
    </Box>
  )
}
export default DateList
