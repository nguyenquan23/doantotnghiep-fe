import { yupResolver } from '@hookform/resolvers/yup'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import PersonIcon from '@mui/icons-material/Person'
import LoadingButton from '@mui/lab/LoadingButton'
import { Box, Divider, Grid, IconButton } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import paymentApi from 'src/apis/payment.api'
import ControlledTextField from 'src/components/ControlledTextField'
import PATH from 'src/constants/path.constant'
import { AppContext } from 'src/contexts/app.context'
import { CryptoPaymentData } from 'src/types/payment.type'
import { PassengerInformationSchema, passengerInformationSchema } from 'src/utils/rules'

const CryptoPayment: React.FC = () => {
  const { profile } = useContext(AppContext)
  const location = useLocation()
  const navigate = useNavigate()

  const { control, handleSubmit } = useForm<PassengerInformationSchema>({
    defaultValues: {
      fullName: profile?.fullName,
      phone: profile?.phone,
      email: profile?.email
    },
    resolver: yupResolver(passengerInformationSchema)
  })

  const cryptoTransactionMutation = useMutation({
    mutationFn: (body: CryptoPaymentData) => paymentApi.cryptoTransaction(body)
  })

  const handleCryptoPayment = (body: PassengerInformationSchema) => {
    cryptoTransactionMutation.mutate(
      {
        amount: location.state.coin as number,
        buyer_email: body.email,
        bookingIds: location.state.bookingIds,
        passengerInfo: location.state.passengerInfo
      },
      {
        onSuccess: (data) => {
          navigate(`${PATH.bookingSuccess.replace(':id', data.data.data.toString())}`)
        },
        onError: () => {
          navigate(PATH.bookingFail)
        }
      }
    )
  }

  return (
    <div className='container mb-12'>
      <Grid container spacing={{ xs: 5, sm: 5, md: 5 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item xs={4} sm={8} md={12}>
          <div>
            <img src='/assets/images/coin-payment.png' alt='coin-payment' />
            <Box
              sx={{
                color: (theme) => theme.palette.primary.main,
                '&:hover': {
                  textDecoration: 'underline',
                  color: (theme) => theme.palette.primary.dark
                }
              }}
            >
              <Link to='https://www.coinpayments.net/'>Securely processed by CoinPayments.net</Link>
            </Box>
          </div>
        </Grid>
        <Grid item xs={4} sm={8} md={12}>
          <Box sx={{}} className='flex items-center justify-between rounded-md bg-gray-100 p-4 '>
            <div className='text-2xl font-semibold'>{'nguyenquan09'}</div>
            <IconButton
              className='rounded-md'
              sx={{
                bgcolor: (theme) => theme.palette.primary.main,
                color: (theme) => theme.palette.common.white,
                '&:hover': {
                  bgcolor: (theme) => theme.palette.primary.dark
                }
              }}
              onClick={() => {}}
            >
              <PersonIcon />
              <div>Seller profile</div>
            </IconButton>
          </Box>
        </Grid>
        <Grid item xs={4} sm={8} md={7}>
          <Box sx={{}}>
            <div className='mb-3 text-2xl font-medium'>Billing Information</div>
            <form onSubmit={handleSubmit(handleCryptoPayment)}>
              <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs={4} sm={8} md={12}>
                  <ControlledTextField
                    required
                    className='w-full'
                    control={control}
                    name={'fullName'}
                    label={'Full name'}
                  />
                </Grid>
                <Grid item xs={4} sm={8} md={6}>
                  <ControlledTextField required className='w-full' control={control} name={'email'} label={'Email'} />
                </Grid>
                <Grid item xs={4} sm={8} md={6}>
                  <ControlledTextField
                    required
                    className='w-full'
                    control={control}
                    name={'phone'}
                    label={'Phone number'}
                  />
                </Grid>
              </Grid>
              <Divider className='mb-8 mt-6' />
              <LoadingButton
                loading={cryptoTransactionMutation.isPending}
                type='submit'
                variant='contained'
                size='large'
                className='w-full'
              >
                Complete checkout
              </LoadingButton>
            </form>
          </Box>
        </Grid>
        <Grid item xs={4} sm={8} md={5}>
          <div className='mb-2.5 text-2xl font-medium'> Total:</div>

          <Grid
            container
            className='rounded-md border-2 p-3'
            spacing={{ xs: 0, sm: 0, md: 0 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={4} sm={8} md={12}>
              <Box className='flex items-center justify-between rounded-md  border p-4'>
                ${location.state.priceTotal} <CompareArrowsIcon /> {location.state.coin.toFixed(2)} LTCT
              </Box>
            </Grid>
            <Grid item xs={4} sm={8} md={12}>
              <Box
                sx={{ bgcolor: (theme) => theme.palette.primary.main }}
                className='mt-6 flex items-center justify-between rounded-md p-2 text-white'
              >
                <div className='flex items-center gap-2'>
                  <img src='/assets/images/coin.png' alt='coin-payment' className='h-10 w-10' />
                  <div>Litecoin Testnet</div>
                </div>
                <div>{location.state.coin.toFixed(2)} LTCT</div>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}
export default CryptoPayment
