import { Box } from '@mui/material'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import { useTranslation } from 'react-i18next'
import { Location } from 'src/types/location.type'

interface MainStopProps {
  locations: Location[]
  orientation?: 'horizontal' | 'vertical'
  isShowAddress: boolean
  titleClassName?: string
}

const MainStop: React.FC<MainStopProps> = ({
  locations,
  orientation,
  isShowAddress,
  titleClassName = 'text-[18px] font-semibold md:text-2xl'
}: MainStopProps) => {
  const { t } = useTranslation()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <div className={titleClassName}>{t('pages.tourDetails.mainStops')}</div>
      <Stepper orientation={orientation} activeStep={-1}>
        {locations.map((location, index) => (
          <Step key={location.name}>
            <StepLabel
              sx={{
                '& .MuiStepIcon-root': { color: (theme) => theme.palette.secondary.main }
              }}
            >
              {index === 0 && <div className='font-bold'>{t('pages.tourDetails.startingLocation')}:</div>}
              {index === locations.length - 1 && <div className='font-bold'>{t('pages.tourDetails.finishAt')}:</div>}
              {location.name} {isShowAddress && `(${location.address})`}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}

export default MainStop
