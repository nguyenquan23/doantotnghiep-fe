import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { DateObject } from 'react-multi-date-picker'
import 'dayjs/locale/vi'

dayjs.extend(relativeTime)

export const formatDate = (date: Date | string, format: string) => dayjs(date).format(format)

export const formatTime = (timeString: string, currentFormat: string, desiredFormat: string) =>
  dayjs(timeString, currentFormat).format(desiredFormat)

export const formatDateLocaleString = (dateTime: Date | string) => {
  const language = localStorage.getItem('language') || 'en'
  const locale = language === 'vi' ? 'vi-VN' : language

  return dayjs(dateTime)
    .locale(locale)
    .format(locale === 'vi-VN' ? 'dddd, D MMMM YYYY' : 'dddd, MMMM D, YYYY')
}

export const convertHourToUTC7 = (hour: string) => {
  return parseInt(hour.substring(0, 2)) + 7 + hour.substring(2)
}

export const convertDateToUTC7 = (date: Date) => {
  return new Date(date.getTime() + 25200000)
}

export const getRelativeTime = (specificTime: Date | string) => {
  return dayjs().to(dayjs(specificTime))
}

export const convertNormalDate = (date: DateObject) => {
  return new Date(date.year, date.monthIndex, date.day + 1).toISOString().replace('.000Z', '')
}

export const compareDate = (a: Date, b: Date) => {
  return new Date(a).getTime() - new Date(b).getTime()
}

export const ConvertDateArrayToDateObjectArray = (dateArr: Date[]) => dateArr.map((item: Date) => new DateObject(item))

export const isInArr = (date: Date, arr: Date[]) => {
  return arr.map((item) => new Date(item).getTime()).includes(new Date(date).getTime())
}

export const compareDateForDateList = (a: Date, b: Date) => {
  return new Date(a).getTime() - new Date(b).getTime() > 0 ? false : true
}
