import { BusyDateEnum } from 'src/enums/busy-date.enum'

export type BusySchedule = {
  id: number
  busyDate: Date
}

export type DayInSchedule = {
  id: number
  busyDate: Date
  typeBusyDayEnum: BusyDateEnum
}

export type ScheduleList = {
  byDay: DayInSchedule[]
  byHour: DayInSchedule[]
  byGuide: DayInSchedule[]
}
