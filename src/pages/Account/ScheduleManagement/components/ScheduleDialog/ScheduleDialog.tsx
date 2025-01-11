/* eslint-disable react/prop-types */
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List } from '@mui/material'
import React, { useState } from 'react'
import { Calendar, DateObject } from 'react-multi-date-picker'
import { months } from 'src/constants/months.constant'
import { DayInSchedule, ScheduleList } from 'src/types/schedule.type'
import { ConvertDateArrayToDateObjectArray } from 'src/utils/date-time'
import '../../schedule-management.style.scss'
import Notes from '../Notes/Notes'
import { useTranslation } from 'react-i18next'

interface ScheduleDialogProps {
  schedule: ScheduleList
  setAddMode: React.Dispatch<React.SetStateAction<boolean>>
  handleDateChange: (value: DateObject[]) => void
}

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  schedule,
  setAddMode,
  handleDateChange
}: ScheduleDialogProps) => {
  const [selectedDates, setSelectedDates] = useState<DateObject[]>([])
  const { t } = useTranslation()

  const confirmAdd = () => {
    const oldDayOff = schedule.byGuide.map((d) => d.busyDate)
    handleDateChange(ConvertDateArrayToDateObjectArray(oldDayOff).concat(selectedDates))
    setSelectedDates([])
  }

  const handleAddBusyDates = () => {
    confirmAdd()
    setAddMode(false)
  }

  return (
    <Dialog open={true} fullWidth maxWidth='md'>
      <DialogTitle sx={{ m: 0, p: 2 }} className='flex items-center justify-between'>
        <div className='text-lg font-semibold'>{t('pages.scheduleManagement.selectYourBusyDay')}</div>
        <Notes />
        <IconButton
          onClick={() => {
            setAddMode(false)
            setSelectedDates([])
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
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
                props.disabled =
                  date < new DateObject() ||
                  schedule.byHour.some((item: DayInSchedule) => isSameDate(new DateObject(item.busyDate), date)) ||
                  schedule.byDay.some((item: DayInSchedule) => isSameDate(new DateObject(item.busyDate), date)) ||
                  schedule.byGuide.some((item: DayInSchedule) => isSameDate(new DateObject(item.busyDate), date))
                return props
              }}
              multiple
              value={selectedDates}
              onChange={(data: DateObject[]) => setSelectedDates(data)}
              months={months}
              className='mx-auto flex h-[380px] w-full flex-col rounded-lg border shadow-none'
            />
          </div>
          <Box className='col-span-3 md:col-span-2'>
            <Box
              className='relative h-[380px] rounded-md border'
              sx={{ bgcolor: 'background.paper', overflowY: 'auto' }}
            >
              <Box
                sx={{
                  color: (theme) => theme.palette.primary.main
                }}
                className='my-3 grid items-center justify-center font-medium'
              >
                {t('pages.scheduleManagement.selectedDays')}
              </Box>
              <List disablePadding className='rounded-b-md p-2' subheader={<li />}>
                {selectedDates.map((item, index) => (
                  <Box
                    sx={{
                      color: (theme) => theme.palette.primary.main,
                      borderColor: (theme) => theme.palette.primary.main
                    }}
                    className='mx-4 my-1 grid items-center justify-center rounded-md border py-1 md:mx-0 lg:mx-4'
                    key={index}
                  >
                    <div>{item.format('MM/DD/YYYY')}</div>
                  </Box>
                ))}
              </List>
            </Box>
          </Box>
        </div>
      </DialogContent>
      <DialogActions>
        <div className='mb-2 mr-4 flex gap-4'>
          <Button variant='outlined' onClick={() => setSelectedDates([])}>
            {t('pages.scheduleManagement.clearAll')}
          </Button>
          <Button variant='contained' onClick={handleAddBusyDates}>
            {t('pages.scheduleManagement.add')}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default ScheduleDialog
