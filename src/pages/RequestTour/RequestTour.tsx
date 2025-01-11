/* eslint-disable react-hooks/rules-of-hooks */
import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import { Box, Button, FormHelperText, MenuItem, TextField, Typography } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useMutation } from '@tanstack/react-query'
import { useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import requestApi from 'src/apis/request.api'
import ControlledTextField from 'src/components/ControlledTextField'
import PATH from 'src/constants/path.constant'
import { AppContext } from 'src/contexts/app.context'
import { StatusRequest } from 'src/enums/status-request.enum'
import { Transportation } from 'src/enums/transportation.enum'
import { Unit } from 'src/enums/unit.enum'
import { RequestTourSchema, requestTourSchema } from 'src/utils/rules'
import NotFound from '../NotFound/NotFound'
import { useTranslation } from 'react-i18next'

export type RequestTourFormData = RequestTourSchema & {
  guideId: string
  travelerRequestStatus?: string
  travelerRequestId?: number
}

const RequestTour: React.FC = () => {
  const { profile } = useContext(AppContext)
  const [buttonClicked, setButtonClicked] = useState<StatusRequest.DRAFT | StatusRequest.PENDING>()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const {
    trigger,
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<RequestTourSchema>({
    defaultValues: {
      transportation: [],
      duration: 0,
      unit: '',
      maxPricePerPerson: 0,
      numberOfTravelers: 0,
      destination: '',
      message: '',
      phone: '',
    },
    resolver: yupResolver(requestTourSchema)
  })

  const createRequestTourMutation = useMutation({
    mutationFn: (body: RequestTourFormData) => requestApi.createRequest(body)
  })

  if (!location.state || !location.state.guideId) {
    return <NotFound />
  }

  useEffect(() => {
    if (location.state.request) {
      const { transportation, message, duration, unit, maxPricePerPerson, numberOfTravelers, destination, phone } =
        location.state.request
      const request: RequestTourSchema = {
        transportation,
        message,
        duration,
        unit,
        maxPricePerPerson,
        numberOfTravelers,
        destination,
        phone
      }
      Object.entries(request).forEach(([key, value]) => {
        setValue(key as keyof RequestTourSchema, value)
      })
    }
  }, [location])

  const onSubmit = (data: RequestTourSchema) => {
    if (profile) {
      const formattedData: RequestTourFormData = {
        ...data,
        guideId: location.state.guideId,
        travelerRequestStatus: buttonClicked?.toUpperCase(),
        travelerRequestId: location.state.request?.id || ''
      }
      createRequestTourMutation.mutate(formattedData, {
        onSuccess: () => {
          if (buttonClicked === StatusRequest.PENDING) {
            toast.success('Your request has been sent.'), navigate(PATH.tourRequest)
          }
          if (buttonClicked === StatusRequest.DRAFT) {
            toast.success('Your request has been saved as a draft.')
            navigate(PATH.tourRequest, { state: { statusRequest: StatusRequest.DRAFT } })
          }
        },
        onError: () => {
          toast.error('You have a PENDING request for this guide, consider removing the previous before add.')
        }
      })
    }
  }

  const handleLoading = (status: StatusRequest.DRAFT | StatusRequest.PENDING) => {
    if (buttonClicked === status) return createRequestTourMutation.isPending
  }

  return (
    <Box className='container relative flex min-h-[550px] w-full items-center justify-center'>
      <div className='w-full py-4'>
        <h2 className='pb-4'>{t('pages.tourRequestForm.tourRequestForm')}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <div className='destination-field'>
            <ControlledTextField
              required
              fullWidth={true}
              multiline={true}
              rows={2}
              control={control}
              name={'destination'}
              label={t('pages.tourRequestForm.destination')}
            />
          </div>
          <div className='transportation-field'>
            <Box sx={{ color: (theme) => theme.palette.primary.main }} className='text-xs font-bold'>
              {t('pages.tourRequestForm.transportation')} <span className='text-sm text-red-500'>*</span>
            </Box>
            <div className='grid grid-cols-3'>
              {Object.values(Transportation).map((item) => (
                <FormControlLabel
                  key={item}
                  control={
                    <Controller
                      name='transportation'
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          {...field}
                          value={item}
                          checked={field.value?.includes(item)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...(field.value ?? []), item])
                              return
                            }
                            field.onChange(field.value?.filter((value) => value !== item) ?? [])
                          }}
                        />
                      )}
                    />
                  }
                  label={t(`enums.transportation.${item.toUpperCase()}`)}
                />
              ))}
            </div>
            {errors.transportation?.message && (
              <FormHelperText className='pl-3 text-xs text-red-500'>{errors.transportation.message}</FormHelperText>
            )}
          </div>
          <div className='flex gap-3'>
            <ControlledTextField
              required
              className='min-h-[80px] w-1/2 grow'
              type='number'
              control={control}
              name={'duration'}
              label={t('pages.tourRequestForm.duration')}
            />
            <Controller
              control={control}
              name='unit'
              render={({ field }) => (
                <TextField
                  select
                  label={
                    <Typography sx={{ fontWeight: 600 }}>
                      {t('pages.tourRequestForm.unit')}{' '}
                      <Typography component='span' sx={{ color: 'red' }}>
                        *
                      </Typography>
                    </Typography>
                  }
                  id='unit'
                  variant='outlined'
                  error={!!errors.unit?.message}
                  helperText={errors.unit?.message}
                  className='h-fit w-1/2 grow'
                  {...field}
                  InputLabelProps={{
                    shrink: true
                  }}
                  onChange={(event) => {
                    field.onChange(event)
                    trigger('unit')
                  }}
                >
                  {Object.values(Unit).map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </div>
          <div className='field-group flex gap-6'>
            <ControlledTextField
              required
              className='min-h-[80px] w-1/2 grow'
              type='number'
              control={control}
              name={'maxPricePerPerson'}
              label={t('pages.tourRequestForm.maxPricePerTraveler')}
              prefix='$'
            />
            <ControlledTextField
              required
              className='min-h-[80px] w-1/2 grow'
              type='number'
              control={control}
              name={'numberOfTravelers'}
              label={t('pages.tourRequestForm.numberOfTravelers')}
            />
          </div>
          <div className='field-group flex gap-6'>
          <ControlledTextField
            required
            className='min-h-20 w-1/2 grow'
            type='number'
            control={control}
            name={'phone'}
            label={t('pages.profile.phone')}
          />
          <ControlledTextField
            control={control}
            name={'message'}
            label={t('pages.tourRequestForm.message')}
            className='min-h-32 w-1/2 grow'
          />
          </div>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'end',
              gap: 2
            }}
          >
            <Button variant='outlined' className='w-fit' size='large' onClick={() => navigate(-1)}>
              {t('pages.tourRequestForm.cancel')}
            </Button>
            <LoadingButton
              onClick={() => setButtonClicked(StatusRequest.DRAFT)}
              loading={handleLoading(StatusRequest.DRAFT)}
              variant='contained'
              size='large'
              type='submit'
            >
              <span>{t('pages.tourRequestForm.saveDraft')}</span>
            </LoadingButton>
            <LoadingButton
              onClick={() => setButtonClicked(StatusRequest.PENDING)}
              loading={handleLoading(StatusRequest.PENDING)}
              variant='contained'
              size='large'
              type='submit'
            >
              <span>{t('pages.tourRequestForm.submit')}</span>
            </LoadingButton>
          </Box>
        </form>
      </div>
    </Box>
  )
}
export default RequestTour
