import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useTheme } from '@mui/material/styles'
import { SyntheticEvent, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { Booking } from 'src/types/booking.type'
import ToursInfo from '../ToursInfo'
import TabPanel from 'src/components/TabPanel/TabPanel'
import { a11yProps } from 'src/utils/tab-panel'
import { useTranslation } from 'react-i18next'

interface ContentInvoiceProps {
  bookings?: Booking[]
}

export default function ContentInvoice({ bookings }: ContentInvoiceProps) {
  const theme = useTheme()
  const [value, setValue] = useState(0)
  const { t } = useTranslation()

  const handleChange = (_: SyntheticEvent, newValue: number) => setValue(newValue)

  const handleChangeIndex = (index: number) => setValue(index)

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.common.white,
        color: (theme) => theme.palette.primary.main,
        border: 'solid',
        borderWidth: '1px',
        borderRadius: '12px'
      }}
    >
      <AppBar
        position='static'
        sx={{
          backgroundColor: (theme) => theme.palette.common.white,
          color: (theme) => theme.palette.primary.main,
          borderTopRightRadius: '12px',
          borderTopLeftRadius: '12px'
        }}
      >
        <Tabs value={value} onChange={handleChange} indicatorColor='secondary' textColor='inherit'>
          {bookings?.map((_: Booking, index: number) => (
            <Tab key={index} label={`${t('pages.bookingSuccess.trip')} ${index + 1}`} {...a11yProps(index)} />
          ))}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        {bookings?.map((booking: Booking, index: number) => (
          <TabPanel key={index} value={value} index={index} direction={theme.direction}>
            <ToursInfo booking={booking} />
          </TabPanel>
        ))}
      </SwipeableViews>
    </Box>
  )
}
