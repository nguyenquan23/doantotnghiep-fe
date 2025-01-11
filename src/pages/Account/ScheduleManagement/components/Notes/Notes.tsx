import { useTranslation } from 'react-i18next'

const Notes: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className='schedule__notes flex flex-wrap gap-2 lg:gap-6'>
      <div className='flex items-center gap-1 lg:gap-3'>
        <div className='h-3 w-3 rounded-full border border-red-500 bg-[var(--highlight-error-background)] lg:h-5 lg:w-5'></div>
        <div className='text-sm lg:text-base'>{t('pages.scheduleManagement.dayOff')}</div>
      </div>
      <div className='flex items-center gap-1 lg:gap-3'>
        <div className='h-3 w-3 rounded-full border border-yellow-500 bg-[var(--highlight-warning-background)] lg:h-5 lg:w-5'></div>
        <div className='text-sm lg:text-base'>{t('pages.scheduleManagement.bookedByDay')}</div>
      </div>
      <div className='flex items-center gap-1  lg:gap-3'>
        <div className='h-3 w-3 rounded-full border border-green-500 bg-[var(--highlight-success-background)] lg:h-5 lg:w-5'></div>
        <div className='text-sm lg:text-base'>{t('pages.scheduleManagement.bookedByHour')}</div>
      </div>
    </div>
  )
}
export default Notes
