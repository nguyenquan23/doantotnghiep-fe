/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup'
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined'
import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Collapse from '@mui/material/Collapse'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useMutation, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import addressApi from 'src/apis/address.api'
import guideApplicationApi from 'src/apis/guide-application.api'
import userApi from 'src/apis/user.api'
import ControlledTextField from 'src/components/ControlledTextField/ControlledTextField'
import ImagesUploader from 'src/components/ImagesUploader/ImagesUploader'
import PATH from 'src/constants/path.constant'
import { AppContext } from 'src/contexts/app.context'
import { TypeOfTransport } from 'src/enums/type-of-transport.enum'
import { GuideApplicationType } from 'src/types/guide-application.type'
import { User } from 'src/types/user.type'
import { convertDateToUTC7 } from 'src/utils/date-time'
import { GuideApplicationSchema, guideApplicationSchema } from 'src/utils/rules'

type FormData = Omit<GuideApplicationSchema, 'newPassword' | 'confirmPassword'>

const applicationSchema = guideApplicationSchema.pick([
  'fullName',
  'address',
  'phone',
  'dateOfBirth',
  'email',
  'password',
  'transportation',
  'isLicensedGuide',
  'yearsOfExperience',
  'licenseImages',
  'biography'
])

const GuideApplication: React.FC = () => {
  const { isAuthenticated, profile } = useContext(AppContext)
  const [openCollapse, setOpenCollapse] = useState(false)
  const { t } = useTranslation()
  const [transportationState, setTransportationState] = useState({
    none: false,
    myOwn: false,
    rental: false,
    hired: false
  })
  const [images, setImages] = useState<string[]>([])
  const formDefaultValues = {
    fullName: '',
    address: '',
    email: '',
    password: isAuthenticated ? undefined : '',
    phone: '',
    dateOfBirth: undefined,
    transportation: transportationState,
    isLicensedGuide: true,
    licenseImages: [],
    yearsOfExperience: 0,
    biography: ''
  }
  const formSchema = isAuthenticated ? applicationSchema.omit(['password']) : applicationSchema
  const { trigger, control, setValue, watch, handleSubmit } = useForm<FormData>({
    defaultValues: formDefaultValues,
    resolver: yupResolver(formSchema) as any
  })
  const { data: provincesData } = useQuery({
    queryKey: ['provinces'],
    queryFn: () => addressApi.getProvinces()
  })
  const { data: profileData } = useQuery({
    queryKey: [`get me ${profile?.email}`, profile?.email],
    queryFn: () => userApi.getMe()
  })
  const watchIsLicenseGuide = watch('isLicensedGuide')
  const navigate = useNavigate()

  useEffect(() => {
    if (profileData?.data.data) {
      const user = profileData?.data.data as User

      setValue('email', user.email)
      user?.fullName && setValue('fullName', user.fullName)
      user?.phone && setValue('phone', user.phone)
      user?.address && setValue('address', user.address)
      user?.dateOfBirth && setValue('dateOfBirth', dayjs(user.dateOfBirth.split('T')[0]) as any)
    }
  }, [profileData?.data.data, setValue])

  useEffect(() => {
    setValue('licenseImages', images)
  }, [images, setValue])

  useEffect(() => {
    setValue('transportation', transportationState)
  }, [setValue, transportationState])

  useEffect(() => {
    if (String(watchIsLicenseGuide) === 'false') {
      setImages([])
      setOpenCollapse(false)
      return
    }
    setOpenCollapse(true)
  }, [watchIsLicenseGuide])

  const createGuideApplicationMutation = useMutation({
    mutationFn: (body: GuideApplicationType) => {
      return guideApplicationApi.createGuideApplication(body)
    }
  })

  const getTransportationString = (transportationTypes: any) => {
    return Object.entries(transportationTypes)
      .filter(([__key, value]) => value)
      .map(([key]) => (TypeOfTransport as any)[key])
      .join(';')
  }

  const onSubmit = (data: FormData) => {
    const formattedData: GuideApplicationType = {
      ...data,
      userId: isAuthenticated ? Number(profile?.id) : null,
      dateOfBirth: convertDateToUTC7(data.dateOfBirth),
      transportation: getTransportationString(data.transportation),
      licenseImages: data.licenseImages as string[]
    }

    createGuideApplicationMutation.mutate(formattedData, {
      onSuccess: () => {
        toast.success('Create guide application successfully.')
        navigate(PATH.home)
      },
      onError: (error: any) => {
        toast.error(error.response.data.message)
      }
    })
  }

  const handleTransportationChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTransportationState({
      ...transportationState,
      [event.target.name]: event.target.checked
    })
  }
  const { none, hired, myOwn, rental } = transportationState

  return (
    <Box className='container relative flex h-auto min-h-[100%] w-full justify-center'>
      <form onSubmit={handleSubmit(onSubmit)} className='h-full w-full flex-col gap-6 rounded-lg p-8'>
        <Typography variant='h4' className='mb-4 font-bold'>
          {t('pages.guideApplication.title')}
        </Typography>
        <h2 className='account-profile__header border-b-1 mb-5 border-b-[0.5px] border-solid border-[var(--border-primary)] pb-1'>
          {t('pages.guideApplication.profileDetails')}
        </h2>
        <div className='field-group flex flex-col gap-6 md:flex-row md:justify-between'>
          <ControlledTextField
            required
            className='min-h-20 w-full'
            control={control}
            name={'fullName'}
            label={t('pages.guideApplication.fullName')}
          />
          <Controller
            control={control}
            name='dateOfBirth'
            render={({ field, fieldState: { error } }) => {
              return (
                <DatePicker
                  disableFuture
                  label={
                    <Typography sx={{ fontWeight: 600 }}>
                      {t('pages.guideApplication.dateOfBirth')}
                      <Typography component='span' sx={{ color: 'red' }}>
                        {' '}
                        *
                      </Typography>
                    </Typography>
                  }
                  value={field.value}
                  className='min-h-20 w-full'
                  slotProps={{
                    textField: { InputLabelProps: { shrink: true }, error: !!error, helperText: error?.message }
                  }}
                  onChange={(event) => {
                    field.onChange(event)
                    trigger('dateOfBirth')
                  }}
                />
              )
            }}
          />
        </div>
        <h2 className='account-profile__header border-b-1 mb-5 border-b-[0.5px] border-solid border-[var(--border-primary)] pb-1'>
          {t('pages.guideApplication.contactDetails')}
        </h2>
        <div className='field-group mb-5 flex flex-col gap-6 md:flex-row md:justify-between'>
          <Controller
            name='address'
            control={control}
            render={({ field, fieldState: { error } }) => {
              const { onChange, onBlur, value } = field
              return (
                <Autocomplete
                  {...field}
                  freeSolo
                  disablePortal
                  id='address'
                  className='min-h-20 w-full flex-grow'
                  onBlur={onBlur}
                  value={value}
                  onChange={(__event, selectedOptions) => {
                    onChange(selectedOptions)
                  }}
                  options={provincesData?.data.data || []}
                  sx={{ width: 300 }}
                  renderOption={(props, option) => (
                    <Box component='li' {...props}>
                      <FmdGoodOutlinedIcon
                        sx={{ mr: 2, flexShrink: 0, color: (theme) => theme.palette.primary.main }}
                      />
                      {option}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <Typography sx={{ fontWeight: 600 }}>
                          {t('pages.guideApplication.address')}{' '}
                          <Typography component='span' sx={{ color: 'red' }}>
                            {' '}
                            *
                          </Typography>
                        </Typography>
                      }
                      InputLabelProps={{
                        shrink: true
                      }}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              )
            }}
          />
          <ControlledTextField
            required
            className='min-h-20 w-full'
            control={control}
            name={'phone'}
            label={t('pages.guideApplication.phone')}
          />
        </div>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          className='tour-details__row-grid'
        >
          <Grid item xs={4} sm={8} md={6} className='field-group flex items-center gap-6'>
            <ControlledTextField
              required
              disabled={!!profile}
              className='min-h-20 w-full'
              control={control}
              name={'email'}
              label={t('pages.guideApplication.email')}
            />
          </Grid>
          <Grid item xs={4} sm={8} md={6} className='field-group flex items-center gap-6'>
            {!isAuthenticated && (
              <ControlledTextField
                required
                className='min-h-20 w-full'
                type='password'
                control={control}
                name={'password'}
                label={t('pages.guideApplication.password')}
              />
            )}
          </Grid>
        </Grid>
        <h2 className='account-profile__header border-b-1 mb-5 border-b-[0.5px] border-solid border-[var(--border-primary)] pb-1'>
          {t('pages.guideApplication.experience')}
        </h2>
        <FormControl className='mb-4 w-full'>
          <Typography sx={{ color: (theme) => theme.palette.primary.main, fontWeight: '600' }} id='transportation'>
            {t('pages.guideApplication.offerTransportationQuestion')}
          </Typography>
          <FormGroup aria-labelledby='transportation'>
            <Controller
              control={control}
              name='transportation'
              render={({ field }) => {
                const { onChange } = field
                return (
                  <FormGroup aria-labelledby='transportation' onChange={onChange}>
                    <FormControlLabel
                      control={<Checkbox checked={none} onChange={handleTransportationChange} name='none' />}
                      label={t('pages.guideApplication.offerTransportationNone')}
                    />
                    <FormControlLabel
                      control={<Checkbox checked={myOwn} onChange={handleTransportationChange} name='myOwn' />}
                      label={t('pages.guideApplication.offerTransportationMyOwn')}
                    />
                    <FormControlLabel
                      control={<Checkbox checked={rental} onChange={handleTransportationChange} name='rental' />}
                      label={t('pages.guideApplication.offerTransportationRental')}
                    />
                    <FormControlLabel
                      control={<Checkbox checked={hired} onChange={handleTransportationChange} name='hired' />}
                      label={t('pages.guideApplication.offerTransportationHired')}
                    />
                  </FormGroup>
                )
              }}
            />
          </FormGroup>
        </FormControl>
        <FormControl className='mb-4 w-full'>
          <Typography sx={{ color: (theme) => theme.palette.primary.main, fontWeight: '600' }} id='isLicensedGuide'>
            {t('pages.guideApplication.licensedTourGuideQuestion')}
            <Typography component='span' sx={{ color: 'red' }}>
              {' '}
              *
            </Typography>
          </Typography>
          <Controller
            control={control}
            name='isLicensedGuide'
            render={({ field, fieldState: { error } }) => {
              const { value, onChange } = field
              return (
                <RadioGroup aria-labelledby='isLicensedGuide' value={value} onChange={onChange}>
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label={t('pages.guideApplication.licensedTourGuideYes')}
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label={t('pages.guideApplication.licensedTourGuideNo')}
                  />
                  {error && <FormHelperText error>{error.message}</FormHelperText>}
                </RadioGroup>
              )
            }}
          />
        </FormControl>
        <Collapse in={openCollapse} timeout='auto' className='mb-4' unmountOnExit>
          <Box sx={{ marginY: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ color: (theme) => theme.palette.primary.main, fontWeight: '600' }} id='isLicensedGuide'>
              {t('pages.guideApplication.licenseImages')}
            </Typography>
            <ImagesUploader images={images} setImages={setImages as any} />
          </Box>
        </Collapse>
        <ControlledTextField
          required
          className='mb-4 min-h-20 w-full md:w-[49%]'
          type='number'
          control={control}
          name={'yearsOfExperience'}
          label={t('pages.guideApplication.yearsOfExperience')}
        />
        <ControlledTextField
          multiline
          rows={3}
          required
          className='min-h-20 w-full md:w-full'
          control={control}
          name={'biography'}
          label={t('pages.guideApplication.biography')}
        />
        <Alert severity='info' className='my-4'>
          <AlertTitle>{t('pages.guideApplication.info')}</AlertTitle>
          {t('pages.guideApplication.receiveEmail')}
        </Alert>
        <Box className='guide-applications__actions mt-4 flex items-center justify-end'>
          <LoadingButton
            loading={createGuideApplicationMutation.isPending}
            type='submit'
            variant='contained'
            size='large'
          >
            {t('pages.guideApplication.submit')}
          </LoadingButton>
        </Box>
      </form>
    </Box>
  )
}

export default GuideApplication
