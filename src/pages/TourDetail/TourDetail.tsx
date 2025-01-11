import { Box } from '@mui/material'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import reviewApi, { CommentFormData } from 'src/apis/review.api'
import tourApi from 'src/apis/tour.api'
import Comment from 'src/components/Comment/Comment'
import CommentBox from 'src/components/CommentBox/CommentBox'
import Map from 'src/components/Map/Map'
import OverallRating from 'src/components/OverallRating/OverallRating'
import ReviewTitle from 'src/components/ReviewTitle/ReviewTitle'
import { TourStatus } from 'src/enums/tour-status.enum'
import { UserRole } from 'src/enums/user-role.enum'
import Loading from 'src/pages/Loading/Loading'
import NotFound from 'src/pages/NotFound/NotFound'
import { ReviewParams } from 'src/types/review.type'
import { Tour } from 'src/types/tour.type'
import { formatDate } from 'src/utils/date-time'
import { BookingSchema } from 'src/utils/rules'
import MainStop from '../../components/MainStop/MainStop'
import ReviewSortFilter from '../../components/ReviewSortFilter/ReviewSortFilter'
import AboutActivity from './components/AboutActivity'
import BookingAssistant from './components/BookingAssistant'
import BookingConfirmation from './components/BookingConfirmation'
import SimpleSlider from './components/SimpleSlider'
import TourHeader from './components/TourHeader'
import { AppContext } from 'src/contexts/app.context'
import { useTranslation } from 'react-i18next'

export type BookingAssistantFormData = Pick<BookingSchema, 'numberTravelers' | 'startDate'>

const TourDetail: React.FC = () => {
  const { profile } = useContext(AppContext)
  const { t } = useTranslation()
  const [tour, setTour] = useState<Tour>({
    id: 0,
    name: '',
    description: '',
    transportation: '',
    includeService: '',
    duration: 0,
    unit: '',
    locations: [],
    estimatedLocalCashNeeded: '',
    pricePerTraveler: 0,
    limitTraveler: 0,
    overallRating: 0,
    province: '',
    itinerary: '',
    categories: [{ id: 0, name: '' }],
    images: [{ id: 0, imageLink: '' }],
    guide: { id: '', email: '', role: UserRole.GUIDER },
    startTimes: [],
    status: TourStatus.PENDING
  })
  const [checkAvailability, setCheckAvailability] = useState<boolean>(false)
  const [formData, setFormData] = useState<BookingAssistantFormData>({
    startDate: new Date(),
    numberTravelers: 0
  })
  const [reviewParams, setReviewParams] = useState<ReviewParams>({})
  const [editReviewId, setEditReviewId] = useState<number | null>(null)
  const { id } = useParams()
  const {
    isPending: isLoadingTour,
    error: errorTour,
    data: tourData
  } = useQuery({
    queryKey: [`Get tour by ${id}`, id],
    queryFn: () => tourApi.getTourById(id as string),
    enabled: id !== undefined
  })
  const { data: reviewsData, refetch: refetchReviewsData } = useQuery({
    queryKey: [`Get reviews of tour by ${id}`, id, reviewParams],
    queryFn: () => reviewApi.searchReviewsOfTour(Number(id), reviewParams),
    placeholderData: keepPreviousData,
    enabled: id !== undefined
  })
  const { data: startTimeData } = useQuery({
    queryKey: [`Start time of id ${id} in ${formData.startDate}`, formData],
    queryFn: () => tourApi.getStartTimeOfTour(Number(id), { localDate: formatDate(formData.startDate, 'YYYY-MM-DD') }),
    enabled: checkAvailability
  })
  const { data: isCanReview } = useQuery({
    queryKey: [`Check user can review for tour of ${id}`, id, profile],
    queryFn: () => reviewApi.checkCanReviewOfTour(Number(id)),
    enabled: id !== undefined && profile != null
  })
  const totalReviews = useMemo(() => reviewsData?.data.data.length || 0, [reviewsData?.data.data])

  useEffect(() => {
    if (tourData?.data) {
      setTour(tourData.data.data)
    }
  }, [tourData?.data])

  const addReviewOfTourMutation = useMutation({
    mutationFn: (body: CommentFormData) => reviewApi.addReviewsOfTourById(Number(id), body)
  })

  const updateReviewOfTourMutation = useMutation({
    mutationFn: (body: CommentFormData) => reviewApi.updateReviewsOfTourById(editReviewId as number, body)
  })

  const deleteReviewOfTourMutation = useMutation({
    mutationFn: (id: number) => reviewApi.deleteReviewsOfTourById(id)
  })

  const handleCreateReviewOfTour = useCallback(
    (data: CommentFormData) => {
      addReviewOfTourMutation.mutate(data, {
        onSuccess: () => {
          refetchReviewsData()
          toast.success(t('pages.tourDetails.addReviewSuccess'))
        },
        onError: (error) => {
          toast.error(error.message)
        }
      })
    },
    [addReviewOfTourMutation, refetchReviewsData]
  )

  const handleUpdateReviewOfTour = useCallback(
    (data: CommentFormData) => {
      if (editReviewId) {
        updateReviewOfTourMutation.mutate(data, {
          onSuccess: () => {
            setEditReviewId(null)
            refetchReviewsData()
            toast.success(t('pages.tourDetails.updateReviewSuccess'))
          },
          onError: (error) => {
            toast.error(error.message)
          }
        })
      }
    },
    [editReviewId, refetchReviewsData, updateReviewOfTourMutation]
  )

  const handleDeleteReviewOfTour = useCallback(
    (id: number) => {
      deleteReviewOfTourMutation.mutate(id, {
        onSuccess: () => {
          refetchReviewsData()
          toast.success(t('pages.tourDetails.deleteReviewSuccess'))
        },
        onError: (error) => {
          toast.error(error.message)
        }
      })
    },
    [deleteReviewOfTourMutation, refetchReviewsData]
  )

  const handleSubmitBookingAssistant = useCallback((body: BookingAssistantFormData) => {
    setFormData(body)
    setCheckAvailability(true)
    window.scrollTo({
      top: 1250,
      behavior: 'smooth'
    })
  }, [])

  const getRatingReviewsAverage = useCallback(
    () =>
      Number(
        ((reviewsData?.data.data.reduce((total, review) => total + review.rating, 0) as number) / totalReviews).toFixed(
          2
        )
      ) || 0,
    [reviewsData?.data.data, totalReviews]
  )

  const getReviewById = useCallback(
    () => reviewsData?.data.data.filter((review) => review.id === editReviewId)[0],
    [editReviewId, reviewsData?.data.data]
  )

  const handleSortFilterChange = useCallback((x: ReviewParams) => {
    setReviewParams(x)
  }, [])

  if (isLoadingTour) return <Loading />

  if (errorTour) return <NotFound />

  return (
    <div className='px-4 py-2 text-sm md:mx-auto md:px-8 md:py-3 lg:w-full lg:max-w-[1400px] lg:px-8 xl:px-24'>
      <div className='activity__container flex flex-col'>
        <TourHeader totalReviews={totalReviews} tour={tour} />
        <div className='activity__photo-gallery pb-2 pt-2'>
          <SimpleSlider itemsData={tour.images} />
        </div>
        <div className='activity__content pt-5'>
          <div className='grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-4'>
            <div className='col-span-1 flex flex-col gap-6 md:col-span-2 lg:col-span-3'>
              <div className='overview-activity text-sm md:text-[16px]'>{tour.description}</div>
              <div className='about-activity flex flex-col gap-2'></div>
              <AboutActivity tour={tour} />
              <div className='check-availability'></div>
            </div>
            <div className='col-span-1 flex flex-col gap-2'>
              <Box className='check-availability-box flex flex-col gap-4'>
                <span className='font-bold'>
                  {t('pages.tourDetails.from')}{' '}
                  <span className='text-2xl font-extrabold text-[var(--decorative-orange)]'>
                    ${tour.pricePerTraveler.toLocaleString()}
                  </span>{' '}
                  {t('pages.tourDetails.perPerson')}
                </span>
                <BookingAssistant
                  id={tour.id}
                  onSubmit={handleSubmitBookingAssistant}
                  limitTraveler={tour.limitTraveler}
                />
              </Box>
            </div>
          </div>
        </div>
        {checkAvailability && (
          <div className='pt-5'>
            <div className='col-span-1 gap-6 md:col-span-2 lg:col-span-3'>
              <BookingConfirmation tour={tour} formData={formData} timeOptions={startTimeData?.data.data} />
            </div>
          </div>
        )}
        <div className='activity__itinerary mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-10'>
          <div className='main-stop col-span-1'>
            <MainStop locations={tour.locations} orientation='vertical' isShowAddress={false} />
          </div>
          <div className='map col-span-2'>
            <div className='text-[18px] font-semibold md:text-2xl'>{t('pages.tourDetails.itinerary')}</div>
            <Map onMarkersUpdate={() => {}} locations={tour.locations} selectMode={false} />
          </div>
        </div>
        <Box className='activity__customer-reviews flex flex-col pb-6'>
          <Divider className='my-4' />
          <ReviewTitle />
          {reviewsData?.data.data && (
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid item xs={4} sm={8} md={12}>
                <OverallRating totalReviews={totalReviews} ratingReviewsAverage={getRatingReviewsAverage()} />
              </Grid>
              <Grid item xs={4} sm={8} md={3}>
                <ReviewSortFilter onChange={handleSortFilterChange} />
              </Grid>
              <Grid item xs={4} sm={8} md={9}>
                {(editReviewId || isCanReview?.data.data.isCanReview) && (
                  <CommentBox
                    review={getReviewById()}
                    onSubmit={editReviewId ? handleUpdateReviewOfTour : handleCreateReviewOfTour}
                    isMutating={updateReviewOfTourMutation.isPending || addReviewOfTourMutation.isPending}
                  />
                )}
                {totalReviews > 0 &&
                  reviewsData?.data.data.map((review, index) => (
                    <Comment
                      key={index}
                      index={index}
                      comment={review}
                      setEditReviewId={(id: number) => setEditReviewId(id)}
                      onDelete={(id: number) => handleDeleteReviewOfTour(id)}
                    />
                  ))}
                {totalReviews === 0 && (
                  <Box className='my-20'>
                    <img
                      src='/assets/images/not-found.png'
                      alt='Not Found Page'
                      className='mx-auto h-36 w-36 object-cover'
                    />
                    <h2 className='my-4 text-center'>No tour reviews available.</h2>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </Box>
      </div>
    </div>
  )
}

export default TourDetail
