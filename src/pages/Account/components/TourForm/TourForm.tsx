import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import { Autocomplete, Box, Button, Chip, MenuItem, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Dayjs } from 'dayjs'
import { SyntheticEvent, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import categoryApi from 'src/apis/category.api'
import ControlledTextField from 'src/components/ControlledTextField'
import ImagesUploader from 'src/components/ImagesUploader/ImagesUploader'
import { Unit } from 'src/enums/unit.enum'
import { Location } from 'src/types/location.type'
import { Request } from 'src/types/request.type'
import { ImageWithLink, Tour, TourCategory } from 'src/types/tour.type'
import { User } from 'src/types/user.type'
import { TourSchema, tourSchema } from 'src/utils/rules'
import MapTourForm from './MapTourForm/MapTourForm'
import StartTimePickers from './StartTimePickers/StartTimePickers'
import { useTranslation } from 'react-i18next'

interface TourFormProps {
  onSubmit: (data: TourFormData) => void
  onCancel: () => void
  defaultValue?: Tour | User
  isMutation: boolean
  request?: Request
}

export type TourFormData = TourSchema

export default function TourForm({ onCancel, onSubmit, defaultValue, isMutation, request }: TourFormProps) {
  const { t } = useTranslation()
  const {
    trigger,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<TourFormData>({
    defaultValues: {
      name: '',
      description: '',
      locations: [],
      transportation: '',
      duration: 0,
      unit: '',
      includeService: '',
      categories: [],
      pricePerTraveler: 0,
      limitTraveler: 0,
      estimatedLocalCashNeeded: '',
      itinerary: '',
      images: [],
      startTimes: []
    },
    resolver: yupResolver(tourSchema)
  })
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories(),
    placeholderData: keepPreviousData,
    staleTime: 5 * 1000
  })
  const watchUnitDuration = watch(['unit', 'duration'])
  const [images, setImages] = useState<(string | ImageWithLink)[]>([])

  useEffect(() => {
    if (defaultValue) {
      Object.entries(defaultValue).forEach(([key, value]) => {
        setValue(key as keyof TourFormData, value)
        setImages((defaultValue as Tour).images)
      })
    }
    if (request) {
      setValue('duration', request.duration)
      setValue('pricePerTraveler', request.maxPricePerPerson)
      setValue('limitTraveler', request.numberOfTravelers)
      setValue('transportation', request.transportation.join(', '))
      setValue('unit', request.unit)
      setValue('itinerary', request.destination)
    }
  }, [defaultValue, request, setValue])

  useEffect(() => {
    setValue('images', images)
  }, [images, setValue])

  const handleStartTimeChange = (startTimes: Dayjs[]) => {
    const formattedDate: Date[] = startTimes.map((time) => time?.toDate())
    setValue('startTimes', formattedDate)
  }

  const handleSaveUpdatedLocations = (locations: Location[]) => {
    setValue('locations', locations)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className='flex flex-col gap-2'>
          <div className='tour-form__field-group mb-4 flex flex-col gap-6 lg:flex-row lg:justify-between'>
            <ControlledTextField
              required
              className='min-h-[80px] grow lg:w-1/2'
              control={control}
              name={'name'}
              label={t('pages.tourManagement.name')}
            />
          </div>
          <div className='tour-form__field-group mb-4 flex flex-col gap-6 lg:flex-row lg:justify-between'>
            <ControlledTextField
              required
              className='min-h-[80px] grow lg:w-1/2'
              type='number'
              control={control}
              name={'pricePerTraveler'}
              label={t('pages.tourManagement.pricePerTraveler')}
              prefix='$'
            />
          </div>
          <div className='tour-form__field-group mb-4 flex flex-col gap-6 lg:flex-row lg:justify-between'>
            <ControlledTextField
              required
              className='min-h-[80px] grow lg:w-1/2'
              type='number'
              control={control}
              name={'limitTraveler'}
              label={t('pages.tourManagement.limitTraveler')}
            />
            <ControlledTextField
              required
              className='min-h-[80px] grow lg:w-1/2'
              control={control}
              name={'estimatedLocalCashNeeded'}
              label={t('pages.tourManagement.estimatedLocalCashNeeded')}
            />
          </div>
          <div className='tour-form__field-group mb-4 flex flex-col gap-6 lg:flex-row lg:justify-between'>
            {categoriesData?.data.data && (
              <Controller
                control={control}
                name='categories'
                render={({ field }) => {
                  const handleChange = (_event: SyntheticEvent<Element, Event>, value: TourCategory[] | unknown) => {
                    const isValidValue = (value as TourCategory[]).every((selectedCategory: TourCategory) =>
                      categoriesData?.data.data.some((category) => category.id === selectedCategory.id)
                    )
                    if (isValidValue) {
                      field.onChange(value)
                      trigger('categories')
                      return
                    }
                    field.onChange([])
                    trigger('categories')
                  }

                  return (
                    <Autocomplete
                      multiple
                      id='categories'
                      options={categoriesData.data.data}
                      getOptionLabel={(option) => (option.name ? option.name : '')}
                      isOptionEqualToValue={(option, value) => option && option.id === value.id}
                      value={Array.isArray(field.value) ? field.value : []}
                      className='h-fit grow lg:w-1/2'
                      onChange={handleChange}
                      sx={{
                        '& .MuiInputBase-root': { height: '56px' }
                      }}
                      renderTags={(value, getTagProps) => {
                        const numTags = value.length
                        const limitTags = 1
                        return (
                          <>
                            {value.slice(0, limitTags).map((option, index) => (
                              <Chip {...getTagProps({ index })} key={index} label={option.name ? option.name : ''} />
                            ))}

                            {numTags > limitTags && ` +${numTags - limitTags}`}
                          </>
                        )
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label={t('pages.tourManagement.categories')}
                          error={!!errors.categories?.message}
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      )}
                    />
                  )
                }}
              />
            )}
            <ControlledTextField
              required
              className='min-h-[80px] w-full grow lg:w-1/2'
              control={control}
              name={'transportation'}
              label={t('pages.tourManagement.transportation')}
            />
          </div>
          <div className='tour-form__field-group flex flex-col gap-6 lg:flex-row lg:justify-between'>
            <Controller
              control={control}
              name='unit'
              render={({ field }) => (
                <TextField
                  select
                  label={
                    <Typography sx={{ fontWeight: 600 }}>
                      {t('pages.tourManagement.unit')}{' '}
                      <Typography component='span' sx={{ color: 'red' }}>
                        *
                      </Typography>
                    </Typography>
                  }
                  id='unit'
                  variant='outlined'
                  error={!!errors.unit?.message}
                  helperText={errors.unit?.message}
                  className='h-fit w-full grow'
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
            <ControlledTextField
              required
              className='min-h-[80px] w-full grow'
              type='number'
              control={control}
              name={'duration'}
              label={t('pages.tourManagement.duration')}
            />
          </div>
          <StartTimePickers
            times={(defaultValue as Tour)?.startTimes}
            watchUnitDuration={watchUnitDuration}
            onStartTimesChange={handleStartTimeChange}
          />
          <ControlledTextField
            required
            fullWidth={true}
            multiline={true}
            rows={3}
            control={control}
            name={'itinerary'}
            label={t('pages.tourManagement.itinerary')}
            className='min-h-32'
          />
          <ControlledTextField
            fullWidth={true}
            multiline={true}
            rows={3}
            control={control}
            name={'includeService'}
            label={t('pages.tourManagement.includeService')}
            className='mb-6'
          />
          <ControlledTextField
            fullWidth={true}
            multiline={true}
            rows={3}
            control={control}
            name={'description'}
            label={t('pages.tourManagement.description')}
          />
          <Box sx={{ marginTop: 2 }}>
            <MapTourForm
              defaultValue={defaultValue as Tour}
              errors={errors}
              handleSaveUpdatedLocations={handleSaveUpdatedLocations}
            />
          </Box>
          <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '13px' }} color={(theme) => theme.palette.primary.main}>
              {t('pages.tourManagement.selectImages')}
            </Typography>
            <ImagesUploader images={images} setImages={setImages}></ImagesUploader>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
            gap: 2,
            paddingTop: '16px'
          }}
        >
          <Button variant='outlined' className='w-fit' size='large' onClick={onCancel}>
            {t('pages.tourManagement.cancel')}
          </Button>
          <LoadingButton loading={isMutation} variant='contained' size='large' type='submit'>
            {t('pages.tourManagement.submit')}
          </LoadingButton>
        </Box>
      </form>
    </>
  )
}
