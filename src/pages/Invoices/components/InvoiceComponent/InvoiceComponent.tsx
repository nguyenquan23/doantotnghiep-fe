import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Box, Button, Chip, Dialog, DialogActions, DialogTitle, Typography } from '@mui/material'
import Collapse from '@mui/material/Collapse'
import { QueryObserverResult, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import paymentApi from 'src/apis/payment.api'
import ConfirmDialog from 'src/components/ConfirmDialog/ConfirmDialog'
import { useToggle } from 'src/hooks/useToggle'
import PassengerInfo from 'src/pages/BookingSuccess/components/PassengerInfo/PassengerInfo'
import { Invoice } from 'src/types/invoice.type'
import BookingContent from '../../../Bookings/components/BookingContent/BookingContent'
import { useTranslation } from 'react-i18next'

interface InvoiceComponentProps {
  invoice: Invoice
  refetchInvoicesData: () => Promise<QueryObserverResult>
}

const InvoiceComponent: React.FC<InvoiceComponentProps> = ({ invoice, refetchInvoicesData }: InvoiceComponentProps) => {
  const [openCollapse, toggleCollapse] = useToggle(false)
  const [isClicked, setIsClicked] = useState<{ confirmRefund: boolean; refund: boolean }>({
    confirmRefund: false,
    refund: false
  })
  const [refundSuccess, setRefundSuccess] = useState<boolean>(false)
  const { t } = useTranslation()

  const { data: refundData, isLoading } = useQuery({
    queryKey: [`refund ${invoice.id}`],
    queryFn: () => paymentApi.refundInvoice({ invoice_id: invoice.id }),
    enabled: isClicked.confirmRefund
  })

  useEffect(() => {
    if (isClicked.confirmRefund) {
      if (refundData?.data.data) {
        setRefundSuccess(true)
        refetchInvoicesData()
      }
      if (!isLoading && Number(refundData?.data.statusCode) !== 200) {
        toast.error(t('pages.invoices.refundFail'))
        setIsClicked((prevState) => ({
          ...prevState,
          confirmRefund: false
        }))
      }
    }
  }, [isLoading])

  return (
    <div className='mb-7 mt-3 rounded-lg border-2 '>
      <h2 className='pl-3 pt-3 text-2xl text-[var(--primary-color)]'>
        {t('pages.invoices.invoice')} #{invoice.id}
      </h2>
      <div className='flex flex-col justify-between p-3 sm:flex-row'>
        <div className='col-span-1'>
          <div className='pb-3 text-lg font-medium'>{t('pages.invoices.passengerInformation')}</div>
          <PassengerInfo email={invoice.email} fullName={invoice.fullName} phone={invoice.phone} />
        </div>
        <div className='col-span-1 flex flex-col items-end justify-between gap-4'>
          {invoice.status === 'REFUNDED' && (
            <Chip className='' label={t('pages.invoices.REFUNDED')} color='error' size='small' variant='filled' />
          )}
          <Typography
            className='text-2xl font-extrabold'
            sx={{ color: (theme) => theme.palette.secondary.main, marginTop: 'auto' }}
          >
            ${invoice.priceTotal.toLocaleString()}
          </Typography>
          <div className='flex justify-end gap-2 sm:flex-row'>
            <Box className='invoice-actions flex gap-2'>
              {invoice.status === 'PAID' && (
                <Button
                  variant='outlined'
                  onClick={() =>
                    setIsClicked((prevState) => ({
                      ...prevState,
                      refund: true
                    }))
                  }
                  className='w-fit'
                  color='error'
                  size='medium'
                >
                  {t('pages.invoices.refund')}
                </Button>
              )}
              <Button
                variant='outlined'
                endIcon={openCollapse ? <ExpandLess /> : <ExpandMore />}
                onClick={() => toggleCollapse()}
                className='ml-2'
              >
                {!openCollapse ? t('pages.invoices.viewDetails') : t('pages.invoices.hideDetails')}
              </Button>
            </Box>
          </div>
        </div>
      </div>
      <div className='invoice__tour-information'>
        <Collapse in={openCollapse} timeout='auto' unmountOnExit>
          <span className='px-3 text-lg font-medium'>{t('pages.invoices.toursInformation')}</span>

          <Box sx={{ padding: '0.75rem', background: 'var(--light-grey-background)' }}>
            <BookingContent bookingList={invoice.tours} />
          </Box>
        </Collapse>
      </div>
      {isClicked.refund && (
        <ConfirmDialog
          title={t('pages.invoices.confirmCancel')}
          content={t('pages.invoices.areYouSure')}
          handleClose={() =>
            setIsClicked((prevState) => ({
              ...prevState,
              refund: false
            }))
          }
          handleConfirm={() => {
            setIsClicked({ confirmRefund: true, refund: false })
          }}
        />
      )}
      {refundSuccess && (
        <Dialog open={true}>
          <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
            {t('pages.invoices.refundSuccessful')}
            <img src='/assets/images/refund.png' alt='Refund success img' />
            <p>Refund of {refundData?.data.data.vndPrice.toLocaleString()} VNĐ has been successfully processed.</p>
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => setRefundSuccess(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  )
}
export default InvoiceComponent
