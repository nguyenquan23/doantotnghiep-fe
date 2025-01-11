import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import LockIcon from 'src/assets/svg/lock.svg'
import CheckIcon from 'src/assets/svg/check.svg'
import MessageIcon from 'src/assets/svg/message.svg'
import { useTranslation } from 'react-i18next'

export default function CartInfo() {
  const { t } = useTranslation()

  return (
    <Card className='rounded-lg border p-2'>
      <CardHeader
        title={<div className='item-card__header text-base font-bold leading-5'>{t('pages.cart.whyBook')}</div>}
      />
      <CardContent className='flex flex-col gap-2 px-4'>
        <div className='flex items-center font-normal'>
          <LockIcon className='mb-[2px] mr-2 h-6 w-6' />
          <div className='text-sm font-medium'>{t('pages.cart.securePayment')}</div>
        </div>
        <div className='flex items-center font-normal'>
          <CheckIcon className='mb-[2px] mr-2 h-6 w-6' />
          <div className='text-sm font-medium'>{t('pages.cart.noHiddenCosts')}</div>
        </div>
        <div className='flex items-center font-normal'>
          <MessageIcon className='mb-[2px] mr-2 h-6 w-6' />
          <div className='text-sm font-medium'>{t('pages.cart.support247')}</div>
        </div>
      </CardContent>
    </Card>
  )
}
