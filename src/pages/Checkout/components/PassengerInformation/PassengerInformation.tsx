import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button } from '@mui/material'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ControlledTextField from 'src/components/ControlledTextField'
import { AppContext } from 'src/contexts/app.context'
import { PassengerInformationSchema, passengerInformationSchema } from 'src/utils/rules'

interface Props {
  setPassengerInfo: React.Dispatch<React.SetStateAction<PassengerInformationSchema>>
  setIsDisplaySaveButton: React.Dispatch<React.SetStateAction<boolean>>
  isDisplaySaveButton: boolean
}

const PassengerInformation: React.FC<Props> = ({
  setPassengerInfo,
  isDisplaySaveButton,
  setIsDisplaySaveButton
}: Props) => {
  const { profile } = useContext(AppContext)
  const { t } = useTranslation()
  const { control, handleSubmit } = useForm<PassengerInformationSchema>({
    defaultValues: {
      fullName: profile?.fullName,
      phone: profile?.phone,
      email: profile?.email
    },
    resolver: yupResolver(passengerInformationSchema)
  })

  const confirmPassengerInfo = (data: PassengerInformationSchema) => {
    setPassengerInfo(data)
    setIsDisplaySaveButton(false)
  }

  return (
    <>
      <h3 className='pb-[0.75rem]'> {t('pages.checkout.passengerInformation')}</h3>
      <form onSubmit={handleSubmit(confirmPassengerInfo)}>
        <Card onClick={() => setIsDisplaySaveButton(true)} className='rounded-lg border-2 p-4 shadow-none'>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={4} sm={8} md={6} className='flex flex-col'>
              <Box className='flex items-center gap-2'>
                <ControlledTextField
                  required
                  label={t('pages.checkout.fullName')}
                  className=' grow lg:w-1/2'
                  control={control}
                  name={'fullName'}
                />
              </Box>
            </Grid>
            <Grid item xs={4} sm={8} md={6} className='flex flex-col'>
              <Box className='flex items-center gap-2'>
                <ControlledTextField
                  required
                  label={t('pages.checkout.phoneNumber')}
                  className=' grow lg:w-1/2'
                  control={control}
                  name={'phone'}
                />
              </Box>
            </Grid>
            <Grid item xs={4} sm={8} md={12} className='flex flex-col'>
              <Box className='flex items-center gap-2'>
                <ControlledTextField
                  required
                  label={t('pages.checkout.email')}
                  className=' grow lg:w-1/2'
                  control={control}
                  name={'email'}
                />
              </Box>
            </Grid>
          </Grid>
          {isDisplaySaveButton && (
            <Button type='submit' variant='contained' className='mt-4 w-full' size='large'>
              {t('pages.checkout.save')}
            </Button>
          )}
        </Card>
      </form>
    </>
  )
}

export default PassengerInformation
