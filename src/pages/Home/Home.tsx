import { Box, Pagination } from '@mui/material'
import Skeleton from '@mui/material/Skeleton'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useState } from 'react'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import bookingApi from 'src/apis/booking.api'
import tourApi from 'src/apis/tour.api'
import wishlistApi from 'src/apis/wishlist.api'
import LocationCard from 'src/components/LocationCard/LocationCard'
import { headerHeight } from 'src/constants/width-height.constant'
import { AppContext } from 'src/contexts/app.context'
import { PaginationParams } from 'src/types/pagination-params.type'
import { Tour } from 'src/types/tour.type'
import { isTourInWishlist } from 'src/utils/wishlist'
import TourCard from '../../components/TourCard/TourCard'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'
import { useTheme } from '@mui/material/styles'
import { Location } from 'src/types/location.type'
import { toast } from 'react-toastify'
import Slider from 'react-slick'
import { useTranslation } from 'react-i18next'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews)
const images = [
  {
    label: 'homepage-cover-1',
    imgPath: '/assets/images/homepage-cover4.jpg'
  },
  {
    label: 'homepage-cover-2',
    imgPath: '/assets/images/homepage-cover5.jpg'
  },
  {
    label: 'homepage-cover-3',
    imgPath: '/assets/images/homepage-cover6.jpg'
  }
]
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
}
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
}

const Home: React.FC = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { profile, isAuthenticated } = useContext(AppContext)
  const [activeStep, setActiveStep] = useState<number>(0)
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({ page: 0, limit: 12 })
  const [geoLocation, setGeoLocation] = useState<Location | null>(null)
  const { data: toursData, isPending } = useQuery({
    queryKey: [`tours in page ${paginationParams.page}`, paginationParams],
    queryFn: () => tourApi.getTours(paginationParams),
    placeholderData: keepPreviousData,
    staleTime: 5 * 1000
  })
  const { data: popularCitiesData, isPending: isPendingCities } = useQuery({
    queryKey: ['popular cities'],
    queryFn: () => bookingApi.getPopularCities(),
    placeholderData: keepPreviousData,
    staleTime: 5 * 1000
  })
  const { data: nearestToursData, isPending: isPendingNearestTours } = useQuery({
    queryKey: [`nearest tours`, geoLocation],
    queryFn: () =>
      tourApi.getNearestTours({
        page: 0,
        limit: 8,
        ...(geoLocation as Location)
      }),
    placeholderData: keepPreviousData,
    staleTime: 5 * 1000,
    enabled: geoLocation != null
  })
  const {
    data: wishListData,
    refetch,
    isPending: isWishlistDataPending
  } = useQuery({
    queryKey: [`wishlist of user with id ${profile?.id}`],
    queryFn: () => wishlistApi.getWishlist(),
    staleTime: 5 * 1000,
    enabled: isAuthenticated
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.warn('Geolocation is not supported by this browser.')
      return
    }

    navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
      if (result.state === 'granted' || result.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(getGeoLocationSuccess, errors, options)
        return
      }
      if (result.state === 'denied') {
        // toast.warn('Geolocation is denied.')
      }
    })
  }, [])

  const getGeoLocationSuccess = (pos: GeolocationPosition) => {
    const crd = pos.coords
    setGeoLocation({ latitude: crd.latitude, longitude: crd.longitude })
  }

  const errors = (err: { code: number; message: string }) => toast.warn(`ERROR(${err.code}): ${err.message}`)

  const handleStepChange = (step: number) => setActiveStep(step)

  const renderSkeletons = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <Box key={index} className='flex flex-col'>
          <Skeleton variant='rounded' width='100%' height='320px' key={index} />
          <Box sx={{ pt: 0.5 }}>
            <Skeleton />
            <Skeleton width='60%' />
          </Box>
        </Box>
      ))
  }

  return (
    <div className='homepage__container'>
      <Box
        className='hero-section'
        sx={{
          height: `calc(600px - ${headerHeight.sm})`,
          '@media (min-width: 768px)': {
            height: `calc(600px - ${headerHeight.md})`
          }
        }}
      >
        <Box className='hero-section__image-container absolute left-0 top-0 z-[-1] h-[600px] w-full'>
          <AutoPlaySwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
          >
            {images.map((step, index) => (
              <div key={step.label} className='h-[600px] w-full'>
                {Math.abs(activeStep - index) <= 2 ? (
                  <img
                    loading='lazy'
                    src={step.imgPath}
                    alt={step.label}
                    className='h-full w-full object-cover brightness-90'
                  />
                ) : null}
              </div>
            ))}
          </AutoPlaySwipeableViews>
        </Box>
        <Box className='hero-section__content m-auto flex max-w-[1400px] flex-col items-center justify-start px-4 py-4 md:py-8 lg:px-24 '>
          <h1 className='hero-section__header mb-10 mt-32 w-1/2 self-start text-4xl leading-none text-white drop-shadow-2xl md:text-5xl lg:text-6xl'>
            {t('pages.homepage.title')}
          </h1>
        </Box>
      </Box>
      {/* Tours */}
      <div className='tour-container container relative mx-0 my-10 max-w-full lg:mx-auto lg:max-w-[1400px]'>
        <div className='collection-header mb-4'>
          <h2 className='text-4xl	leading-10'>{t('pages.homepage.allTours')}</h2>
        </div>
        <div className='collection-body grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {isPending
            ? renderSkeletons()
            : isAuthenticated
              ? isWishlistDataPending
                ? renderSkeletons()
                : toursData?.data.data.tourDTOS.map((tourData: Tour) => (
                    <TourCard
                      key={tourData.id}
                      tourData={tourData}
                      isTourInWishList={!!isTourInWishlist(wishListData?.data.data as Tour[], tourData.id)}
                      refetch={refetch}
                    />
                  ))
              : toursData?.data.data.tourDTOS.map((tourData: Tour) => (
                  <TourCard key={tourData.id} tourData={tourData} refetch={refetch} />
                ))}
        </div>
        {toursData && (
          <Pagination
            onChange={(_, page) => {
              setPaginationParams((prevPagination) => ({
                ...prevPagination,
                page: page - 1
              }))
            }}
            count={toursData?.data.data.totalOfPage as unknown as number}
            className='my-6 flex justify-center'
            size='large'
            variant='outlined'
            color='primary'
          />
        )}
      </div>
      {/* Nearest Tours */}
      {geoLocation && (
        <div className='nearest-tour-container container relative mx-0 my-10 max-w-full lg:mx-auto lg:max-w-[1400px]'>
          <div className='collection-header mb-4'>
            <h2 className='text-4xl	leading-10'>{t('pages.homepage.nearestTours')}</h2>
          </div>
          <Slider {...settings}>
            {isPendingNearestTours
              ? renderSkeletons()
              : isAuthenticated
                ? isWishlistDataPending
                  ? renderSkeletons()
                  : nearestToursData?.data.data.tourDTOS.map((tourData: Tour) => (
                      <TourCard
                        key={tourData.id}
                        tourData={tourData}
                        isTourInWishList={!!isTourInWishlist(wishListData?.data.data as Tour[], tourData.id)}
                        refetch={refetch}
                      />
                    ))
                : nearestToursData?.data.data.tourDTOS.map((tourData: Tour) => (
                    <TourCard key={tourData.id} tourData={tourData} refetch={refetch} />
                  ))}
          </Slider>
        </div>
      )}
      {!isPendingCities && popularCitiesData?.data.data && popularCitiesData?.data.data.length > 0 && (
        <div className='collection-container container relative mx-auto my-10 max-w-[94%] lg:mx-auto lg:max-w-[1400px]'>
          <div className='collection-header mb-4'>
            <h2 className='text-4xl	leading-10'>{t('pages.homepage.popularLocations')}</h2>
          </div>
          <div className='scroll flex flex-nowrap gap-4 overflow-x-auto'>
            {popularCitiesData?.data.data.map((city, index) => (
              <div key={index} className='col-span-1'>
                <LocationCard city={city} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
