import { Box, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import PATH from 'src/constants/path.constant'

export default function BookingFail() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Box className='container flex h-auto min-h-[100%] flex-col justify-center'>
      <div className='flex h-full flex-col items-center justify-center gap-2'>
        <img src='/assets/images/payment-failure.png' alt='Payment failure' className='h-52 w-52 object-cover' />
        <div className='text-2xl font-medium'>{t('pages.bookingFail.yourPaymentFailed')}</div>
        <span className='text-center text-gray-400'>{t('pages.bookingFail.tryLater')}</span>
        <Button onClick={() => navigate(PATH.home)} variant='outlined' size='large' className='mt-4 uppercase'>
          {t('pages.bookingFail.goHome')}
        </Button>
      </div>
    </Box>
  )
}
