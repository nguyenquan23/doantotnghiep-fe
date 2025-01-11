import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { Badge } from '@mui/material'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useState } from 'react'
import cartApi from 'src/apis/cart.api'
import { AppContext } from 'src/contexts/app.context'

const CartBadge: React.FC = () => {
  const { profile } = useContext(AppContext)
  const { data: cartData } = useQuery({
    queryKey: [`bookings in cart by ${profile?.id}`],
    queryFn: () => cartApi.getBookingsInCart(),
    placeholderData: keepPreviousData,
    staleTime: 6 * 1000
  })

  const [quantity, setQuantity] = useState<number>(0)

  useEffect(() => {
    if (cartData?.data.data.bookings) setQuantity(cartData?.data.data.bookings?.length)
  }, [cartData])

  return (
    <>
      {quantity > 0 && (
        <Badge badgeContent={cartData?.data.data.bookings?.length} color='error'>
          <ShoppingCartOutlinedIcon sx={{ fontSize: 24 }} />
        </Badge>
      )}
      {quantity <= 0 && <ShoppingCartOutlinedIcon sx={{ fontSize: 24 }} />}
    </>
  )
}

export default CartBadge
