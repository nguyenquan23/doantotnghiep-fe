/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import CheckIcon from '@mui/icons-material/Check'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { LatLngExpression } from 'leaflet'
import debounce from 'lodash/debounce'
import { ChangeEvent, memo, useCallback, useEffect, useState } from 'react'
import addressApi from 'src/apis/address.api'
import Map from 'src/components/Map/Map'
import { Location } from 'src/types/location.type'
import { Tour } from 'src/types/tour.type'
import LocationNamesStepper from '../LocationNamesStepper/LocationNamesStepper'
import { useTranslation } from 'react-i18next'

interface MapTourFormProps {
  defaultValue: Tour
  errors: any
  handleSaveUpdatedLocations: (updatedLocations: Location[]) => void
}

const MapTourForm: React.FC<MapTourFormProps> = memo(
  ({ errors, handleSaveUpdatedLocations, defaultValue }: MapTourFormProps) => {
    const { t } = useTranslation()
    const [locations, setLocations] = useState<Location[]>([])
    const [openCollapse, setOpenCollapse] = useState(false)
    const [isConfirmLocations, setIsConfirmLocations] = useState<boolean>(false)
    const [isSaveUpdatedLocations, setIsSaveUpdatedLocations] = useState<boolean>(false)
    const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false)

    const { data: locationNamesData, isPending: isLocationNamesPending } = useQuery({
      queryKey: [`location name of ${locations}`],
      queryFn: () => addressApi.getLocationNameByLatLon(locations as any),
      enabled: openCollapse && locations.length > 0 && !isUpdateMode
    })

    useEffect(() => {
      if (typeof defaultValue === 'object') {
        setLocations((defaultValue as Tour).locations)
        handleConfirmLocationLatLon()
        setIsUpdateMode(true)
      }
    }, [])

    useEffect(() => {
      if (locationNamesData?.data.data) {
        const names = locationNamesData.data.data
        const updateLocationsWithNames = locations.map((location, index) => ({
          ...location,
          name: names[index]
        }))

        setLocations(updateLocationsWithNames)
      }
    }, [locationNamesData])

    const handleMarkersUpdate = useCallback(
      (markers: LatLngExpression[]) => {
        const formattedMarkers: Location[] = (markers as Array<number[]>).map((marker: number[]) => {
          return {
            latitude: marker[0],
            longitude: marker[1]
          }
        })
        setLocations(formattedMarkers)
      },
      [setLocations]
    )

    const handleConfirmLocationLatLon = () => {
      setOpenCollapse(true)
      setIsConfirmLocations(true)
    }

    const handleChangeLocationName = useCallback(
      debounce((index: number, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setLocations((prevLocationNames) => {
          const updatedLocationNames = [...prevLocationNames]
          updatedLocationNames[index].name = event.target.value
          return updatedLocationNames
        })
      }, 300),
      []
    )

    const handleSaveLocationNames = () => {
      handleSaveUpdatedLocations(locations)
      setIsSaveUpdatedLocations(true)
    }

    return (
      <Box sx={{ marginTop: 2 }}>
        <Box className='flex justify-between'>
          <Typography sx={{ fontWeight: 600, fontSize: '13px' }} color={(theme) => theme.palette.primary.main}>
            {t('pages.tourManagement.selectSequentialLocations')}{' '}
            <Typography component='span' sx={{ color: 'red' }}>
              *
            </Typography>
            <Tooltip title={t('pages.tourManagement.selectSequentialLocationsToolTip')}>
              <IconButton>
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Typography>
          <Button
            disabled={locations.length === 0 || openCollapse}
            variant='outlined'
            onClick={handleConfirmLocationLatLon}
            endIcon={isConfirmLocations ? <CheckIcon /> : null}
          >
            {t('pages.tourManagement.confirmLocations')}
          </Button>
        </Box>
        {locations.length > 0 && isUpdateMode ? (
          <Map onMarkersUpdate={() => {}} locations={locations} selectMode={false} />
        ) : (
          <Map
            onMarkersUpdate={handleMarkersUpdate}
            selectMode={isConfirmLocations ? false : true}
            removeMode={isConfirmLocations ? false : true}
            changeMapViewMode={false}
          />
        )}

        {openCollapse && (
          <Collapse in={openCollapse} timeout='auto' unmountOnExit>
            {isUpdateMode && (
              <LocationNamesStepper
                locationNames={locations.map((location) => location.name as string)}
                handleChangeLocationName={handleChangeLocationName}
                isSaveUpdatedLocations={isSaveUpdatedLocations}
                handleSaveLocationNames={handleSaveLocationNames}
              />
            )}
            {!isUpdateMode && !isLocationNamesPending && locationNamesData && (
              <LocationNamesStepper
                locationNames={locationNamesData.data.data}
                handleChangeLocationName={handleChangeLocationName}
                isSaveUpdatedLocations={isSaveUpdatedLocations}
                handleSaveLocationNames={handleSaveLocationNames}
              />
            )}
            {!isUpdateMode && isLocationNamesPending && (
              <>
                <Paper className='flex flex-col gap-2 p-4'>
                  <Skeleton variant='text' sx={{ fontSize: '1rem' }} width='80%' />
                  <Box className='flex w-full gap-2'>
                    <Box className='flex w-1/2 gap-2'>
                      <Skeleton animation='wave' variant='circular' width={40} height={40} />
                      <Skeleton variant='text' sx={{ fontSize: '1rem' }} width='80%' />
                    </Box>
                    <Box className='flex w-1/2 gap-2'>
                      <Skeleton animation='wave' variant='circular' width={40} height={40} />
                      <Skeleton variant='text' sx={{ fontSize: '1rem' }} width='80%' />
                    </Box>
                  </Box>
                  <Skeleton variant='rounded' sx={{ marginLeft: 'auto' }} width={80} height={40} />
                </Paper>
              </>
            )}
          </Collapse>
        )}
        {!!errors.locations?.message && <FormHelperText error>{errors.locations?.message}</FormHelperText>}
      </Box>
    )
  },
  (prevProps, nextProps) => prevProps === nextProps
)

MapTourForm.displayName = 'MapTourForm'
export default MapTourForm
