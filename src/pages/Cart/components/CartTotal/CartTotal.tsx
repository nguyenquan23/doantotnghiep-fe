import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import AlertTitle from '@mui/material/AlertTitle'
import { Booking } from 'src/types/booking.type'
import { useNavigate } from 'react-router-dom'
import PATH from 'src/constants/path.constant'
import { totalBookingPrice as TotalBookingPriceFunction } from 'src/utils/sum'
import { useTranslation } from 'react-i18next'

interface CartTotalProps {
  bookings: Booking[]
}

export default function CartTotal({ bookings }: CartTotalProps) {
  const navigate = useNavigate()
  const totalBookingPrice = TotalBookingPriceFunction(bookings)
  const { t } = useTranslation()

  return (
    <Card className='rounded-lg border p-2'>
      <CardHeader
        title={
          <>
            <div className='item-card__header flex justify-between'>
              <div className='title whitespace-nowrap text-xl font-bold leading-5'>
                {t('pages.cart.total')} ({bookings.length} {t('pages.cart.items')}):
              </div>
              <div className='flex flex-col items-end gap-1'>
                <div className='title text-xl font-bold leading-5'>${totalBookingPrice!.toLocaleString()}</div>
                <div className='title text-right text-xs font-medium leading-5 text-emerald-700 lg:text-sm'>
                  {t('pages.cart.allTaxesFees')}
                </div>
              </div>
            </div>
          </>
        }
      />
      <CardActions className='relative mt-2'>
        <Button
          className='mr-2 w-[100%] rounded-full pr-7 font-semibold md:inline-block'
          variant='contained'
          size='large'
          onClick={() => navigate(PATH.checkout)}
        >
          {t('pages.cart.goToCheckout')}
        </Button>
      </CardActions>
      <CardContent>
        <Alert variant='standard' severity='success' className='text-sm'>
          <AlertTitle className='text-sm'> {t('pages.cart.freeCancellation')}</AlertTitle>
          <div className='text-sm'>{t('pages.cart.within')}</div>
        </Alert>
      </CardContent>
    </Card>
  )
}
