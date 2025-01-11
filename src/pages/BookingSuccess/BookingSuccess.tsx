import { Box, Divider } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import invoiceApi from 'src/apis/invoice.api'
import CheckIcon from 'src/assets/svg/check-green.svg'
import Loading from '../Loading/Loading'
import NotFound from '../NotFound/NotFound'
import ContentInvoice from './components/ContentInvoice'
import PassengerInfo from './components/PassengerInfo/PassengerInfo'
import { useTranslation } from 'react-i18next'

export default function BookingSuccess() {
  const { id: invoiceId } = useParams()
  const { t } = useTranslation()
  const { data: invoiceData, isPending } = useQuery({
    queryKey: [`Get invoice by ${invoiceId}`],
    queryFn: () => invoiceApi.getInvoice(invoiceId as string)
  })

  return (
    <>
      {isPending && <Loading />}
      {!isPending && invoiceData?.data.data && (
        <div className='container my-6 h-auto min-h-[100%] max-w-[800px]'>
          <Box className='my-3 rounded-lg' sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}>
            <div className='invoice__header relative p-4'>
              <div className='flex flex-col items-center gap-2'>
                <CheckIcon className='h-12 w-12' />
                <div className='text-2xl font-medium capitalize'>{t('pages.bookingSuccess.bookingSuccess')}</div>
                <span className='text-center text-gray-400'>{t('pages.bookingSuccess.moreInformation')}</span>
              </div>
              <div className='absolute bottom-[-0.75rem] left-[-0.75rem] h-6 w-6 rounded-full bg-white'></div>
              <div className='absolute bottom-[-0.75rem] right-[-0.75rem]  h-6 w-6 rounded-full bg-white'></div>
            </div>
            <Divider className='mx-3 rounded-full border-dashed' />
            <div className='invoice__content flex flex-col gap-4 px-4 py-5'>
              <div className='passenger-info'>
                <Box
                  sx={{ backgroundColor: (theme) => theme.palette.primary.light }}
                  className='mb-2 rounded-lg px-4 py-2 font-medium'
                >
                  {t('pages.bookingSuccess.passengerInformation')}
                </Box>
                <PassengerInfo
                  email={invoiceData.data.data.email}
                  fullName={invoiceData.data.data.fullName}
                  phone={invoiceData.data.data.phone}
                />
              </div>
              <div className='tours-info'>
                <Box
                  sx={{ backgroundColor: (theme) => theme.palette.primary.light }}
                  className='mb-2 rounded-lg px-4 py-2 font-medium'
                >
                  {t('pages.bookingSuccess.toursInformation')}
                </Box>
                <ContentInvoice bookings={invoiceData.data.data.tours} />
              </div>
              <div className='payment-info'>
                <Box
                  sx={{ backgroundColor: (theme) => theme.palette.primary.light }}
                  className='mb-2 rounded-lg px-4 py-2 font-medium'
                >
                  {t('pages.bookingSuccess.paymentInformation')}
                </Box>
                <div className='payment-info__content'>
                  <div className='total'>
                    <div className='ml-4 flex flex-col text-sm font-medium'>
                      <span> {t('pages.bookingSuccess.total')}</span>
                      <span className='text-xl font-light'>
                        {'$' + invoiceData.data.data.priceTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </div>
      )}
      {!isPending && !invoiceData?.data.data && <NotFound />}
    </>
  )
}
