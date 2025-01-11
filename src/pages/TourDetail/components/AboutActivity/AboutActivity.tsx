import ActivityInfo from './ActivityInfo'
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined'
import TimelapseIcon from '@mui/icons-material/Timelapse'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import AirportShuttleOutlinedIcon from '@mui/icons-material/AirportShuttleOutlined'
import FastfoodOutlinedIcon from '@mui/icons-material/FastfoodOutlined'
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { Tour } from 'src/types/tour.type'
import { useTranslation } from 'react-i18next'

interface AboutActivityProps {
  tour: Tour
}
export default function AboutActivity({ tour }: AboutActivityProps) {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col gap-4'>
      <div className='text-[18px] font-semibold md:text-2xl'>{t('pages.tourDetails.aboutThisActivity')}</div>
      <ActivityInfo
        icon={<CurrencyExchangeOutlinedIcon />}
        title={t('pages.tourDetails.cancellation')}
        content={
          <>
            <p className='mb-1 text-sm text-[var(--label-secondary)]'>{t('pages.tourDetails.cancel7daysBefore')}</p>
            <p className='mb-1 text-sm text-[var(--label-secondary)]'>{t('pages.tourDetails.cancel1daysBefore')}</p>
            <p className='mb-1 text-sm text-[var(--label-secondary)]'>{t('pages.tourDetails.cancel24hours')}</p>
          </>
        }
      />
      <ActivityInfo
        icon={<GroupsOutlinedIcon />}
        title={t('pages.tourDetails.group')}
        content={t('pages.tourDetails.limitParticipants', {
          limitTraveler: tour.limitTraveler
        })}
      />
      <ActivityInfo
        icon={<AttachMoneyIcon />}
        title={'Price per traveler'}
        content={`$${tour.pricePerTraveler.toLocaleString()}`}
      />
      <ActivityInfo
        icon={<TimelapseIcon />}
        title={t('pages.tourDetails.duration')}
        content={`${tour.duration} ${t(`pages.tourDetails.${tour.unit}`)}`}
      />
      <ActivityInfo
        icon={<AirportShuttleOutlinedIcon />}
        title={t('pages.tourDetails.transportation')}
        content={`${tour.transportation}`}
      />
      <ActivityInfo
        icon={<FastfoodOutlinedIcon />}
        title={t('pages.tourDetails.service')}
        content={`${tour.includeService}`}
      />
      <ActivityInfo
        icon={<LocalAtmOutlinedIcon />}
        title={t('pages.tourDetails.localCashNeeded')}
        content={`${tour.estimatedLocalCashNeeded}`}
      />
      <ActivityInfo
        icon={<CalendarMonthOutlinedIcon />}
        title={t('pages.tourDetails.itinerary')}
        content={`${tour.itinerary}`}
      />
    </div>
  )
}
