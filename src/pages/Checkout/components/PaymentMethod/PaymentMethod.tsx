import LoadingButton from '@mui/lab/LoadingButton'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import cartApi from 'src/apis/cart.api'
import paymentApi from 'src/apis/payment.api'
import PATH from 'src/constants/path.constant'
import { AppContext } from 'src/contexts/app.context'
import { BookingsInCart } from 'src/types/booking.type'
import { PassengerInformationSchema } from 'src/utils/rules'
import { totalBookingPrice as totalBookingPriceFunction } from 'src/utils/sum'
import { ethers } from "ethers"
import MetaMaskOnboarding from '@metamask/onboarding'
import config from 'src/constants/config.constant'
import { Backdrop, CircularProgress } from '@mui/material'
import { admimMetaMaskWalletAddress } from 'src/constants/wallet-address.constant'

interface Props {
  passengerInfo: PassengerInformationSchema
  isDisplaySaveButton: boolean
  bookingId?: number
}

declare global {
  interface Window {
    ethereum?: any
  }
}

const PaymentMethod: React.FC<Props> = ({ passengerInfo, isDisplaySaveButton, bookingId }: Props) => {
  const { profile } = useContext(AppContext)
  const navigate = useNavigate()
  const { data: bookingsCartData } = useQuery({
    queryKey: [`booking in cart by ${profile?.id}`],
    queryFn: () => cartApi.getBookingsInCart(),
    placeholderData: keepPreviousData,
    staleTime: 6 * 1000
  })
  const totalBookingPrice = totalBookingPriceFunction(bookingsCartData?.data.data.bookings)
  const [isProceedPaymentClicked, setIsProceedPaymentClicked] = useState<boolean>(false)
  const [isTransferMoney, setIsTransferMoney] = useState<boolean>(false)
  const [isTransferEthCoin, setIsTransferEthCoin] = useState<boolean>(false)
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);

  const getFormattedBookingIds = useCallback(() => {
    return (bookingsCartData?.data.data as BookingsInCart).bookings!.map((booking) => booking.id).join(',') as string
  }, [bookingsCartData?.data.data])

  const { data: paymentUrl, isLoading: VNPaymentLoading } = useQuery({
    queryKey: [`Get payment url for bookings with id ${getFormattedBookingIds}`],
    queryFn: () =>
      paymentApi.getPaymentUrl({
        price: !bookingId
          ? (totalBookingPrice as number)
          : bookingsCartData
            ? bookingsCartData.data.data.bookings.slice(-1)[0].price
            : 0,
        bookingIds: bookingId ? bookingId.toString() : getFormattedBookingIds(),
        fullName: passengerInfo.fullName,
        email: passengerInfo.email,
        phone: passengerInfo.phone
      }),
    enabled: !!isProceedPaymentClicked
  })

  const { data: metaMaskData, isLoading: metaMaskPaymentLoading } = useQuery({
    queryKey: [`Convert ${totalBookingPrice} dollars to seth coins `],
    queryFn: () => paymentApi.transferDollarToEth({ totalPrice: (totalBookingPrice as number) }),
    enabled: !!isTransferEthCoin
  })

  const makeInvoiceByMetaMask = useMutation({
    mutationFn: (body: any) => paymentApi.makeInvoiceByMetamask(body)
  })

  useEffect(() => {
    if (isTransferMoney) setIsTransferMoney(false)
  }, [])

  useEffect(() => {
    if (paymentUrl?.data.data) {
      window.location.href = paymentUrl.data.data
    }
  }, [navigate, paymentUrl])

  const handlePayment = () => {
    if (!isDisplaySaveButton) setIsProceedPaymentClicked(true)
    else toast.error('Please fill in the complete Passenger Information and save.')
  }

  const handleMetaMaskPayment = () => {
    setIsTransferEthCoin(true)
    setOpenBackdrop(true)
  }

  const installMetaMask = () => {
    const onboarding = new MetaMaskOnboarding({ forwarderOrigin: config.frontEndUrl });
    onboarding.startOnboarding();
  }

  const startPayment = async (metaMaskData: any) => {
    try {
      if (!window?.ethereum) {
        installMetaMask()
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const amount = metaMaskData.sepoliaEthPrice
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      ethers.utils.getAddress(admimMetaMaskWalletAddress);
      const tx = await signer.sendTransaction({
        to: admimMetaMaskWalletAddress,
        value: ethers.utils.parseEther(amount)
      });
      // Make invoice
      const cryptoPayData = {
        priceTotal: totalBookingPrice,
        txHash: tx.hash,
        sepoliaEthPrice: amount,
        usdRate: metaMaskData.usdRate,
        senderAddress: accounts[0],
        bookingIds: getFormattedBookingIds().split(',').map(num => num.trim()),
        travelerEmail: profile?.email,
        email: passengerInfo.fullName,
        fullName: passengerInfo.email,
        phone: passengerInfo.phone
      };

      makeInvoiceByMetaMask.mutate(cryptoPayData,
        {
          onSuccess: (data) => {
            setOpenBackdrop(false)
            navigate(`${PATH.bookingSuccess.replace(':id', data.data.data.toString())}`)
          },
          onError: () => {
            setOpenBackdrop(false)
            navigate(PATH.bookingFail)
          }
        }
      )
    } catch (err: any) {
      const errorMessage = err.message
      setOpenBackdrop(false)
      setIsTransferEthCoin(false)
      toast.error(errorMessage.substring(0, errorMessage.indexOf(" (")))
    }
  };

  useEffect(() => {
    if (isTransferEthCoin && metaMaskData?.data.data) {
      startPayment(metaMaskData?.data.data)
    }
  }, [metaMaskData])

  return (
    <>
      <div className='mt-4 rounded-lg border-2 p-4 shadow-none'>
        <h3 className='pb-4'>Payment method</h3>
        <div className='grid grid-cols-2  justify-items-center gap-3'>
          <div className='col-span-1'>
            <img
              loading='lazy'
              src='/assets/images/vnpay.png'
              alt='coin-payment'
              className='h-9 w-auto object-contain'
            />
            <LoadingButton
              loading={VNPaymentLoading}
              variant='outlined'
              className='mt-4'
              size='large'
              onClick={handlePayment}
            >
              Pay with VNPay
            </LoadingButton>
          </div>
          <div className='col-span-1'>
            <img
              loading='lazy'
              src='/assets/images/meta-mask-fox.png'
              alt='coin-payment'
              className='h-9 w-auto object-contain'
            />
            <LoadingButton
              loading={metaMaskPaymentLoading}
              variant='outlined'
              className='mt-4'
              size='large'
              onClick={handleMetaMaskPayment}
            >
              Pay with Meta Mask
            </LoadingButton>
          </div>
        </div>
      </div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <div style={{ marginRight: '10px' }}>Please verify transaction</div>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}
export default PaymentMethod
