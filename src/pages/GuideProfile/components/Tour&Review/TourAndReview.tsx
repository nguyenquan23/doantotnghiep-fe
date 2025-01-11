import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useTheme } from '@mui/material/styles'
import { useMutation, useQuery } from '@tanstack/react-query'
import { SyntheticEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SwipeableViews from 'react-swipeable-views'
import { toast } from 'react-toastify'
import reviewApi, { CommentFormData } from 'src/apis/review.api'
import Comment from 'src/components/Comment/Comment'
import CommentBox from 'src/components/CommentBox/CommentBox'
import OverallRating from 'src/components/OverallRating/OverallRating'
import ReviewSortFilter from 'src/components/ReviewSortFilter/ReviewSortFilter'
import ReviewTitle from 'src/components/ReviewTitle/ReviewTitle'
import TabPanel from 'src/components/TabPanel/TabPanel'
import TourManagement from 'src/pages/Account/TourManagement'
import { ReviewParams } from 'src/types/review.type'
import { a11yProps } from 'src/utils/tab-panel'
interface TourAndReviewProps {
  guideId?: string
}

export default function TourAndReview({ guideId }: TourAndReviewProps) {
  const theme = useTheme()
  const [value, setValue] = useState(0)
  const [editReviewId, setEditReviewId] = useState<number | null>(null)
  const [reviewParams, setReviewParams] = useState<ReviewParams>({})
  const { t } = useTranslation()

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleChangeIndex = (index: number) => {
    setValue(index)
  }

  const { data: reviewsData, refetch: refetchReviewsData } = useQuery({
    queryKey: [`Get reviews of guide ${guideId}`, guideId, reviewParams],
    queryFn: () => reviewApi.getReviewsOfGuide(Number(guideId), reviewParams),
    enabled: guideId !== undefined,
    staleTime: 0
  })

  const { data: isCanReview } = useQuery({
    queryKey: [`Check user can review for tour of ${guideId}`, guideId, reviewsData],
    queryFn: () => reviewApi.checkCanReviewOfGuide(Number(guideId)),
    enabled: guideId !== undefined
  })

  const addReviewOfGuideMutation = useMutation({
    mutationFn: (body: CommentFormData) => reviewApi.addReviewsOfGuideById(Number(guideId), body)
  })

  const handleCreateReviewOfGuide = useCallback((data: CommentFormData) => {
    addReviewOfGuideMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Add review of guide successfully.')
        refetchReviewsData()
        window.scrollTo({
          top: 800,
          behavior: 'smooth'
        })
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  }, [])

  const deleteReviewOfGuideMutation = useMutation({
    mutationFn: (guideId: number) => reviewApi.deleteReviewsOfGuideById(guideId)
  })

  const handleDeleteReviewOfGuide = useCallback((id: number) => {
    deleteReviewOfGuideMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Delete review of guide successfully.')
        refetchReviewsData()
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  }, [])

  const updateReviewOfGuideMutation = useMutation({
    mutationFn: (body: CommentFormData) => reviewApi.updateReviewsOfGuideById(editReviewId as number, body)
  })

  const handleUpdateReviewOfGuide = useCallback(
    (data: CommentFormData) => {
      if (editReviewId) {
        updateReviewOfGuideMutation.mutate(data, {
          onSuccess: async () => {
            setEditReviewId(null)
            refetchReviewsData()
            toast.success('Update review of guide successfully.')
          },
          onError: (error) => {
            toast.error(error.message)
          }
        })
      }
    },
    [editReviewId]
  )

  const getReviewById = useCallback(
    () => reviewsData?.data.data.filter((review) => review.id === editReviewId)[0],
    [editReviewId, reviewsData?.data.data]
  )

  const handleSortFilterChange = useCallback((params: ReviewParams) => {
    setReviewParams(params)
  }, [])

  const totalReviews = useMemo(() => reviewsData?.data.data.length || 0, [reviewsData?.data.data])

  const getRatingReviewsAverage = useCallback(
    () =>
      Number(
        ((reviewsData?.data.data.reduce((total, review) => total + review.rating, 0) as number) / totalReviews).toFixed(
          2
        )
      ) || 0,
    [reviewsData?.data.data, totalReviews]
  )

  return (
    <Box
      sx={{
        borderRadius: '12px'
      }}
    >
      <AppBar
        position='static'
        sx={{
          backgroundColor: (theme) => theme.palette.common.white,
          color: (theme) => theme.palette.primary.main,
          borderRadius: '12px',
          borderWidth: '1px',
          borderColor: (theme) => theme.palette.primary.main,
          boxShadow: 'none'
        }}
        className='w-fit'
      >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor='secondary'
          textColor='inherit'
          sx={{
            borderRadius: '12px'
          }}
        >
          <Tab label={t('pages.guideDetails.tours')} {...a11yProps(1)} />
          <Tab label={t('pages.guideDetails.reviews')} {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={1} index={1} direction={theme.direction}>
          <TourManagement guideId={guideId} />
        </TabPanel>
        <TabPanel value={2} index={2} direction={theme.direction}>
          <Divider className='mb-4' />
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={4} sm={2} md={3}>
              <ReviewTitle />
            </Grid>
            <Grid item xs={4} sm={6} md={9}>
              <OverallRating totalReviews={totalReviews} ratingReviewsAverage={getRatingReviewsAverage()} />
            </Grid>
          </Grid>
          <Grid className='py-6' container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 4, md: 12 }}>
            <Grid item xs={4} sm={4} md={3}>
              <ReviewSortFilter onChange={handleSortFilterChange} />
            </Grid>
            <Grid item xs={4} sm={4} md={9}>
              {(editReviewId || isCanReview?.data.data.isCanReview) && (
                <CommentBox
                  onSubmit={editReviewId ? handleUpdateReviewOfGuide : handleCreateReviewOfGuide}
                  review={getReviewById()}
                  isMutating={addReviewOfGuideMutation.isPending}
                />
              )}
              {reviewsData?.data.data.map((review, index) => (
                <Comment
                  index={index}
                  key={review.id}
                  setEditReviewId={(id: number) => setEditReviewId(id)}
                  onDelete={(id: number) => handleDeleteReviewOfGuide(id)}
                  comment={review}
                />
              ))}
              {!reviewsData?.data.data ||
                (totalReviews < 1 && (
                  <>
                    <img
                      src='/assets/images/not-found.png'
                      alt='Not Found Page'
                      loading='lazy'
                      className='mx-auto h-36 w-36 object-cover'
                    />
                    <h2 className='my-4 text-center'>{t('pages.tourDetails.noGuideReviews')}</h2>
                  </>
                ))}
            </Grid>
          </Grid>
        </TabPanel>
      </SwipeableViews>
    </Box>
  )
}
