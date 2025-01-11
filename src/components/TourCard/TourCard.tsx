/* eslint-disable @typescript-eslint/no-explicit-any */
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Rating from '@mui/material/Rating'
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import classNames from 'classnames'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import wishlistApi from 'src/apis/wishlist.api'
import { AppContext } from 'src/contexts/app.context'
import { Tour } from 'src/types/tour.type'
import { SuccessResponse } from 'src/types/utils.type'

interface TourCardProps {
  tourData: Tour
  isTourInWishList?: boolean
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<AxiosResponse<SuccessResponse<Tour[]>, any>, Error>>
}

export default function TourCard({ tourData, isTourInWishList = false, refetch }: TourCardProps) {
  const { isAuthenticated } = useContext(AppContext)
  const [isCardHovered, setIsCardHovered] = useState<boolean>(false)
  const { t } = useTranslation()

  const addTourToWishlistMutation = useMutation({
    mutationFn: (tourId: number) => wishlistApi.addTourToWishlistById(tourId)
  })

  const deleteTourFromWishlistMutation = useMutation({
    mutationFn: (tourId: number) => wishlistApi.deleteTourFromWishlistById(tourId)
  })

  const handleAddToWishlist = () => {
    if (!isAuthenticated) return toast.info(t('components.tourCard.signInFirst'))

    if (isTourInWishList) {
      deleteTourFromWishlistMutation.mutate(tourData.id, {
        onSuccess: () => {
          toast.success(t('components.tourCard.removeWishlistSuccess'))
          refetch()
        },
        onError: (error) => {
          toast.error(error.message)
        }
      })
      return
    }

    addTourToWishlistMutation.mutate(tourData.id, {
      onSuccess: () => {
        toast.success(t('components.tourCard.addWishlistSuccess'))
        refetch()
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  }

  return (
    <Box className='tour-card__wrapper relative h-full'>
      <Box
        sx={{
          boxShadow: 'rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px',
          borderWidth: '1px'
        }}
        className='flex h-full flex-col justify-between overflow-hidden rounded'
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
      >
        <Link to={`/tours/${tourData.id}`} className='h-full'>
          <div className='tour-card__top-wrapper mx-0'>
            <div className='tour-card__top relative mx-0'>
              <div className='tour-card__photo mx-0 h-64 overflow-hidden'>
                <img
                  src={tourData.images[0]?.imageLink || '/assets/images/default-cover.jpg'}
                  alt='Tour img'
                  loading='lazy'
                  className={classNames('h-full w-full object-cover transition duration-700', {
                    'scale-125': isCardHovered
                  })}
                />
              </div>
              <div className='tour-card__header mb-2 mt-1 px-3'>
                <span className='activity-type mb-1 text-sm font-semibold uppercase leading-5 text-[var(--label-secondary)]'>
                  {tourData?.categories[0]?.name}
                </span>
                <h3 className='title capitalize text-[var(--label-primary)] lg:max-h-20 lg:overflow-hidden'>
                  {tourData?.name}
                </h3>
                <h5 className='text-[var(--label-secondary)]'>
                  {t('components.tourCard.by')} {tourData?.guide?.fullName || tourData?.guide?.email || 'N/A'}
                </h5>
              </div>
              <div className='tour-card__body mb-2 px-2 py-0 text-sm text-[var(--label-primary)] sm:px-3'>
                <ul className='flex flex-wrap gap-4'>
                  <li className='text-sm font-semibold'>
                    {tourData?.duration} {t(`components.tourCard.${tourData?.unit}`)}
                  </li>
                  <li className='relative flex items-center whitespace-nowrap text-sm font-semibold'>
                    <span className='absolute left-[-10px] top-1/2 -translate-y-1/2 transform'>•</span>
                    {tourData?.transportation}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='tour-card__details  float-left mb-2 px-3 lg:max-h-40 lg:overflow-hidden'>
            <div className='rating-overall-container flex items-center gap-1'>
              <Rating defaultValue={tourData?.overallRating} precision={0.1} size='small' readOnly />
              <span className='rating-overall__number text-sm font-semibold'>{tourData?.overallRating.toFixed(2)}</span>
              <span className='rating-overall__reviews text-sm font-semibold  text-[var(--label-secondary)]'>
                ({tourData.reviewDTOS?.length} {t(`components.tourCard.reviews`)})
              </span>
            </div>
            <div className='pricing-container font-semibold'>
              {t(`components.tourCard.fromPerPerson`, { price: tourData?.pricePerTraveler.toLocaleString() })}
            </div>
          </div>
        </Link>
      </Box>
      <IconButton className='wishlist-icon absolute right-1 top-1 z-[4] cursor-pointer' onClick={handleAddToWishlist}>
        {!isTourInWishList ? (
          <FavoriteTwoToneIcon style={{ color: 'var(--border-primary)' }} />
        ) : (
          <FavoriteIcon sx={{ fill: (theme) => theme.palette.secondary.main }} />
        )}
      </IconButton>
    </Box>
  )
}
