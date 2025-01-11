import CheckIcon from '@mui/icons-material/Check'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DebouncedFunc } from 'lodash'
import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

interface LocationNamesStepper {
  locationNames: string[]
  handleSaveLocationNames: () => void
  handleChangeLocationName: DebouncedFunc<
    (index: number, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  >
  isSaveUpdatedLocations: boolean
}

const LocationNamesStepper: React.FC<LocationNamesStepper> = ({
  locationNames,
  handleSaveLocationNames,
  handleChangeLocationName,
  isSaveUpdatedLocations
}: LocationNamesStepper) => {
  const { t } = useTranslation()

  return (
    <Paper className='p-4'>
      <Typography
        variant='subtitle2'
        sx={{ fontWeight: 600, color: (theme) => theme.palette.primary.main, marginBottom: '16px' }}
      >
        {t('pages.tourManagement.hereAreDefault')}
      </Typography>

      <Stepper orientation='horizontal' activeStep={-1}>
        {locationNames.map((name, index) => (
          <Step key={index}>
            <StepLabel
              sx={{
                '& .MuiStepIcon-root': { color: (theme) => theme.palette.secondary.main }
              }}
            >
              <TextField
                id={`outlined-input-${index}`}
                defaultValue={name}
                onChange={(e) => handleChangeLocationName(index, e)}
                sx={{ width: 'fit-content' }}
                disabled={isSaveUpdatedLocations}
              />
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box className='mt-4 flex justify-end'>
        <Button
          disabled={isSaveUpdatedLocations}
          endIcon={isSaveUpdatedLocations ? <CheckIcon /> : null}
          size='large'
          variant='outlined'
          onClick={handleSaveLocationNames}
        >
          {t('pages.tourManagement.save')}
        </Button>
      </Box>
    </Paper>
  )
}

export default LocationNamesStepper
