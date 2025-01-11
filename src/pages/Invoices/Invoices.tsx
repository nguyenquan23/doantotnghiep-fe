import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import invoiceApi from 'src/apis/invoice.api'
import InvoiceComponent from './components/InvoiceComponent/InvoiceComponent'
import { AppContext } from 'src/contexts/app.context'
import Box from '@mui/material/Box'
import Loading from '../Loading/Loading'
import { useTranslation } from 'react-i18next'

const Invoices: React.FC = () => {
  const { isAuthenticated, profile } = useContext(AppContext)
  const { t } = useTranslation()
  const { data: invoicesData, refetch: refetchInvoicesData } = useQuery({
    queryKey: [`Get invoices by user with id ${profile?.id}`],
    queryFn: () => invoiceApi.getInvoices()
  })

  if (!isAuthenticated)
    return (
      <div className='flex h-full flex-col items-center justify-center'>
        <img
          loading='lazy'
          src='/assets/images/empty-booking.png'
          alt='Empty booking'
          className='h-52 w-52 object-cover'
        />
        <h3>{t('pages.invoices.signInFirst')}</h3>
      </div>
    )

  return (
    <Box className='container flex h-full flex-col'>
      {!invoicesData?.data.data && <Loading />}
      {invoicesData?.data.data && invoicesData.data.data.length > 0 && (
        <Box className='max-h-[1000px] overflow-auto'>
          <h2 className='my-invoices mt-6'>{t('pages.invoices.myInvoices')}</h2>
          {invoicesData?.data.data.map((invoice, index) => (
            <InvoiceComponent key={index} invoice={invoice} refetchInvoicesData={refetchInvoicesData} />
          ))}
        </Box>
      )}
      {invoicesData?.data.data && invoicesData.data.data.length === 0 && (
        <div className='mt-48 flex h-full flex-col items-center justify-center'>
          <img
            loading='lazy'
            src='/assets/images/empty-booking.png'
            alt='Empty booking'
            className='h-52 w-52 object-cover'
          />
          <h3>{t('pages.invoices.noData')}</h3>
        </div>
      )}
    </Box>
  )
}

export default Invoices
