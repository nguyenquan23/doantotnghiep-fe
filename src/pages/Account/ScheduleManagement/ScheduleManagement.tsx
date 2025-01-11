/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
import { Box, Button } from '@mui/material'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import React, { useContext, useEffect, useState } from 'react'
import { Calendar, DateObject } from 'react-multi-date-picker'
import scheduleApi from 'src/apis/schedule.api'
import { months } from 'src/constants/months.constant'
import { AppContext } from 'src/contexts/app.context'
import { BusyDateEnum } from 'src/enums/busy-date.enum'
import { DayInSchedule, ScheduleList } from 'src/types/schedule.type'
import DateList from './components/DateList/DateList'
import Notes from './components/Notes/Notes'
import ScheduleDialog from './components/ScheduleDialog/ScheduleDialog'
import './schedule-management.style.scss'
import { AxiosResponse } from 'axios'
import { SuccessResponse } from 'src/types/utils.type'
import { useTranslation } from 'react-i18next'

const ScheduleManagement: React.FC = () => {
  const { profile } = useContext(AppContext)
  const [schedule, setSchedule] = useState<ScheduleList>({ byDay: [], byHour: [], byGuide: [] })
  const [addMode, setAddMode] = useState<boolean>(false)
  const { t } = useTranslation()
  const { data: busySchedulesData } = useQuery({
    queryKey: [`busy schedules of ${profile?.id}`],
    queryFn: () => scheduleApi.getBusySchedulesOfGuide(),
    placeholderData: keepPreviousData,
    staleTime: 5 * 1000
  })

  useEffect(() => {
    if (busySchedulesData?.data?.data) updateSchedule(busySchedulesData.data.data)
  }, [busySchedulesData])

  const updateSchedule = (busySchedulesData: any) => {
    setSchedule({
      byDay: busySchedulesData.filter((day: any) => day.typeBusyDayEnum === BusyDateEnum.BOOKED_DAY_BY_DAYS),
      byHour: busySchedulesData.filter((day: any) => day.typeBusyDayEnum === BusyDateEnum.BOOKED_DAY_BY_HOURS),
      byGuide: busySchedulesData.filter((day: any) => day.typeBusyDayEnum === BusyDateEnum.DATE_SELECTED_BY_GUIDE)
    })
  }

  const updateBusyScheduleMutation = useMutation({
    mutationFn: (body: string[]) => scheduleApi.updateBusyScheduleOfGuide(body)
  })

  const handleDateChange = (value: DateObject[]) => {
    const formattedBody = value.map((date) => {
      const dateObject = new Date(date.format('MM/DD/YYYY'))
      dateObject.setDate(dateObject.getDate() + 1)
      return dateObject.toISOString()
    })

    updateBusyScheduleMutation.mutate(formattedBody, {
      onSuccess: (res: AxiosResponse<SuccessResponse<DayInSchedule[]>, any>) => {
        updateSchedule(res.data.data)
      }
    })
  }

  return (
    <>
      {addMode && <ScheduleDialog schedule={schedule} setAddMode={setAddMode} handleDateChange={handleDateChange} />}
      <h2 className='account-profile__header border-b-1 mb-6 border-b-[0.5px] border-solid border-[var(--border-primary)] pb-1'>
        {t('pages.scheduleManagement.scheduleManagement')}
      </h2>
      <div className='mb-3 flex items-center justify-between gap-6'>
        <Button variant='outlined' onClick={() => setAddMode(true)}>
          {t('pages.scheduleManagement.addBusyDay')}
        </Button>
        <Notes />
      </div>
      <div className='grid grid-cols-7 gap-2'>
        <div className='col-span-4 md:col-span-5'>
          <Calendar
            mapDays={({ date, isSameDate }) => {
              const props: { style: object; disabled: boolean } = { style: {}, disabled: false }
              props.style = {
                boxShadow: 'none'
              }
              if (isSameDate(date, new DateObject()))
                props.style = {
                  color: '#000',
                  fontWeight: 'bold',
                  textDecoration: 'underline'
                }
              if (schedule.byGuide.some((item: DayInSchedule) => isSameDate(new DateObject(item.busyDate), date)))
                props.style = {
                  ...props.style,
                  color: 'var(--highlight-error-text)',
                  backgroundColor: 'var(--highlight-error-background)',
                  fontWeight: 'bold'
                }
              if (schedule.byHour.some((item: DayInSchedule) => isSameDate(new DateObject(item.busyDate), date)))
                props.style = {
                  ...props.style,
                  color: 'var(--highlight-success-text)',
                  backgroundColor: 'var(--highlight-success-background)',
                  fontWeight: 'bold'
                }
              if (schedule.byDay.some((item: DayInSchedule) => isSameDate(new DateObject(item.busyDate), date)))
                props.style = {
                  ...props.style,
                  color: 'var(--highlight-warning-text)',
                  backgroundColor: 'var(--highlight-warning-background)',
                  fontWeight: 'bold'
                }
              props.disabled = true
              return props
            }}
            multiple
            months={months}
            className='mx-auto flex h-[380px] w-full flex-col rounded-lg border shadow-none'
          />
        </div>
        <Box className='col-span-3 md:col-span-2'>
          <DateList schedule={schedule} handleDateChange={handleDateChange} />
        </Box>
      </div>
    </>
  )
}
export default ScheduleManagement
