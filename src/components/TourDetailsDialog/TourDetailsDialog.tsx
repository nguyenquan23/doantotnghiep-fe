/* eslint-disable @typescript-eslint/no-explicit-any */
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ApartmentIcon from '@mui/icons-material/Apartment'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CategoryIcon from '@mui/icons-material/Category'
import CloseIcon from '@mui/icons-material/Close'
import DescriptionIcon from '@mui/icons-material/Description'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus'
import EventNoteIcon from '@mui/icons-material/EventNote'
import GroupsIcon from '@mui/icons-material/Groups'
import HikingIcon from '@mui/icons-material/Hiking'
import ImageIcon from '@mui/icons-material/Image'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LocalAtmIcon from '@mui/icons-material/LocalAtm'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import TimelapseIcon from '@mui/icons-material/Timelapse'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import tourApi from 'src/apis/tour.api'
import ConfirmPopper from 'src/components/ConfirmPopper/ConfirmPopper'
import MainStop from 'src/components/MainStop/MainStop'
import { Tour } from 'src/types/tour.type'
import { formatTime } from 'src/utils/date-time'

interface TourDetailsDialogProps {
  tourData: Tour
  isPendingTourDetail: boolean
  handleCloseTourDetailDialog: () => void
  refetch: any
  readonly?: boolean
}

const TourDetailsDialog: React.FC<TourDetailsDialogProps> = ({
  tourData,
  isPendingTourDetail,
  handleCloseTourDetailDialog,
  refetch,
  readonly = false
}: TourDetailsDialogProps) => {
  const [openPopper, setOpenPopper] = useState<boolean>(false)
  const [currentAction, setCurrentAction] = useState<'deny' | 'accept' | undefined>(undefined)
  const { t } = useTranslation()

  const denyPendingTourMutation = useMutation({
    mutationFn: (tourId: number) => tourApi.denyPendingTour(tourId)
  })

  const acceptPendingTourMutation = useMutation({
    mutationFn: (tourId: number) => tourApi.acceptPendingTour(tourId)
  })

  const handleAction = (action: 'accept' | 'deny') => {
    setOpenPopper((prev) => !prev)
    setCurrentAction(action)
  }

  const handleSubmitAccept = () => {
    acceptPendingTourMutation.mutate(tourData.id, {
      onSuccess: () => {
        handleCancel()
        toast.success('Accept tour successfully.')
        refetch()
        handleCloseTourDetailDialog()
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  }

  const handleSubmitDeny = () => {
    denyPendingTourMutation.mutate(tourData.id, {
      onSuccess: () => {
        handleCancel()
        toast.success('Deny tour successfully.')
        refetch()
        handleCloseTourDetailDialog()
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  }

  const handleCancel = () => {
    setOpenPopper(false)
  }

  return (
    <Dialog fullWidth maxWidth='md' open={true} aria-labelledby='dialog'>
      <DialogTitle
        style={{ cursor: 'move', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        id='dialog-title'
      >
        <Typography sx={{ fontWeight: '800', fontSize: '1.2rem' }}>
          {t('components.tourDetailsDialog.tourDetails')}
        </Typography>
        <IconButton onClick={handleCloseTourDetailDialog}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          {isPendingTourDetail ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box className='flex flex-col gap-4'>
              <Box className='tour-details__row flex justify-center gap-4'>
                <Typography variant='body1' className='text-center text-2xl font-bold'>
                  {tourData.name}
                </Typography>
              </Box>
              <Box className='tour-details__row flex justify-center gap-4'>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className='tour-details__row-grid'
                >
                  <Grid item xs={4} sm={8} md={6} className='tour-details__description flex items-center gap-2'>
                    <ApartmentIcon />
                    <Typography variant='body1' className='font-semibold'>
                      {t('components.tourDetailsDialog.address')}:
                    </Typography>
                    <span>{tourData.locations.length > 0 ? tourData.locations[0]?.name : 'N/A'}</span>
                  </Grid>
                  <Grid item xs={4} sm={8} md={6} className='tour-details__description flex items-center gap-2'>
                    <HikingIcon />
                    <Typography variant='body1' className='font-semibold'>
                      {t('components.tourDetailsDialog.guide')}:
                    </Typography>
                    <span>
                      {tourData.guide.fullName
                        ? `${tourData.guide.fullName} (${tourData.guide.email})`
                        : tourData.guide.email}
                    </span>
                  </Grid>
                  <Grid item xs={4} sm={8} md={6} className='tour-details__description flex items-center gap-2'>
                    <TimelapseIcon />
                    <Typography variant='body1' className='font-semibold'>
                      {t('components.tourDetailsDialog.duration')}:
                    </Typography>
                    <span>
                      {tourData.duration} {tourData.unit}
                    </span>
                  </Grid>
                  <Grid item xs={4} sm={8} md={6} className='tour-details__description flex items-center gap-2'>
                    <AccessTimeIcon />
                    <Typography variant='body1' className='font-semibold'>
                      {t('components.tourDetailsDialog.startTimes')}:
                    </Typography>
                    <Stack direction='row' spacing={1}>
                      {tourData.startTimes.map((startTime) => (
                        <Chip key={startTime} label={formatTime(startTime, 'HH:mm:ss', 'HH:mm')} color='primary' />
                      ))}
                    </Stack>
                  </Grid>
                  <Grid item xs={4} sm={8} md={6} className='tour-details__description flex items-center gap-2'>
                    <AttachMoneyIcon />
                    <Typography variant='body1' className='font-semibold'>
                      {t('components.tourDetailsDialog.pricePerTraveler')}:
                    </Typography>
                    <span>${tourData.pricePerTraveler.toLocaleString()}</span>
                  </Grid>
                  <Grid item xs={4} sm={8} md={6} className='tour-details__description flex items-center gap-2'>
                    <LocalAtmIcon />
                    <Typography variant='body1' className='font-semibold'>
                      {t('components.tourDetailsDialog.estimatedLocalCashNeeded')}:
                    </Typography>
                    <span>{tourData.estimatedLocalCashNeeded.toLocaleString()}</span>
                  </Grid>
                  <Grid item xs={4} sm={8} md={6} className='tour-details__description flex items-center gap-2'>
                    <GroupsIcon />
                    <Typography variant='body1' className='font-semibold'>
                      {t('components.tourDetailsDialog.limitTravelers')}:
                    </Typography>
                    <span>{tourData.limitTraveler}</span>
                  </Grid>
                  <Grid item xs={4} sm={8} md={6} className='tour-details__description flex items-center gap-2'>
                    <CategoryIcon />
                    <Typography variant='body1' className='font-semibold'>
                      {t('components.tourDetailsDialog.categories')}: :
                    </Typography>
                    <Box className='flex w-full flex-nowrap items-center gap-1'>
                      {tourData.categories.length === 0
                        ? 'N/A'
                        : tourData.categories.map((category, index) => (
                            <Box className='w-fit' key={index}>
                              <span>{category.name}</span>
                              {index !== tourData.categories.length - 1 && <span> - </span>}
                            </Box>
                          ))}
                    </Box>
                  </Grid>
                  <Grid item xs={4} sm={8} md={6} className='tour-details__description flex items-center gap-2'>
                    <DirectionsBusIcon />
                    <Typography variant='body1' className='font-semibold'>
                      {t('components.tourDetailsDialog.transportation')}:
                    </Typography>
                    <span>{tourData.transportation}</span>
                  </Grid>
                  <Grid item xs={4} sm={8} md={12} className='tour-details__description flex items-center gap-2'>
                    <SupportAgentIcon />
                    <Typography variant='body1' className='font-semibold'>
                      {t('components.tourDetailsDialog.includeServices')}:
                    </Typography>
                    <span>{tourData.includeService}</span>
                  </Grid>
                  <Grid item xs={4} sm={8} md={12} className='tour-details__description flex items-center gap-2'>
                    <EventNoteIcon />
                    <Typography variant='body1' className='font-semibold'>
                      {t('components.tourDetailsDialog.itinerary')}:
                    </Typography>
                    <span>{tourData.itinerary}</span>
                  </Grid>
                  <Grid item xs={4} sm={8} md={12} className='tour-details__description flex items-center gap-2'>
                    <DescriptionIcon />
                    <Typography variant='body1' className='font-semibold'>
                      {t('components.tourDetailsDialog.description')}:
                    </Typography>
                    <span>{tourData.description}</span>
                  </Grid>
                  <Grid item xs={4} sm={8} md={12} className='tour-details__description flex flex-col gap-2'>
                    {tourData.images.length > 0 && (
                      <Box className='flex gap-2'>
                        <ImageIcon />
                        <Typography variant='body1' className='font-semibold'>
                          {t('components.tourDetailsDialog.images')}
                        </Typography>
                      </Box>
                    )}
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 8, sm: 12, md: 12 }}>
                      {tourData.images.map((image, i) => (
                        <Grid
                          item
                          xs={2}
                          sm={2}
                          md={2}
                          key={i}
                          sx={{
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'center',
                            position: 'relative'
                          }}
                        >
                          <img
                            src={image.imageLink}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              aspectRatio: '1 / 1'
                            }}
                            alt=''
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  {tourData.locations.length > 0 && (
                    <Grid item xs={4} sm={8} md={12} className='tour-details__description flex items-center gap-2'>
                      <MainStop locations={tourData.locations} orientation='vertical' isShowAddress={true} />
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContentText>
      </DialogContent>
      {!readonly && (
        <>
          <DialogActions>
            <LoadingButton
              loading={denyPendingTourMutation.isPending}
              onClick={() => handleAction('deny')}
              variant='contained'
              size='large'
              color='error'
            >
              {t('components.tourDetailsDialog.deny')}
            </LoadingButton>
            <LoadingButton
              loading={acceptPendingTourMutation.isPending}
              onClick={() => handleAction('accept')}
              variant='contained'
              size='large'
            >
              {t('components.tourDetailsDialog.accept')}
            </LoadingButton>
          </DialogActions>
          <ConfirmPopper
            icon={currentAction === 'accept' ? <InfoOutlinedIcon /> : <WarningAmberIcon />}
            title={
              currentAction === 'accept'
                ? `${t('components.tourDetailsDialog.accept')} tour`
                : `${t('components.tourDetailsDialog.deny')} tour`
            }
            content={t('components.tourDetailsDialog.areYouSure', {
              action: t(`components.tourDetailsDialog.${currentAction}`).toLowerCase()
            })}
            openDialog={openPopper}
            handleClickYes={currentAction === 'accept' ? handleSubmitAccept : handleSubmitDeny}
            handleClickNo={handleCancel}
            loading={
              currentAction === 'accept' ? acceptPendingTourMutation.isPending : denyPendingTourMutation.isPending
            }
          />
        </>
      )}
    </Dialog>
  )
}

export default TourDetailsDialog
