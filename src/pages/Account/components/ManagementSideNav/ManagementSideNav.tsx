import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import TourIcon from '@mui/icons-material/Tour'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Box } from '@mui/material'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AvatarSideNav from 'src/components/AvatarSideNav/AvatarSideNav'
import PATH from 'src/constants/path.constant'
import { AppContext } from 'src/contexts/app.context'
import { UserRole } from 'src/enums/user-role.enum'
import { isActive } from 'src/utils/active.util'
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined'
import { useTranslation } from 'react-i18next'

const ManagementSideNav: React.FC = () => {
  const { profile } = useContext(AppContext)
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <div className='management__container flex-auto md:m-0'>
      <AvatarSideNav />
      <div className='management__side-menu'>
        <Paper>
          <List sx={{ padding: 0 }}>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton component={Link} to={PATH.tourRequest} selected={isActive(location, PATH.tourRequest)}>
                <ListItemIcon>
                  <TourIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText primary={t('components.managementSideNav.tourRequestManagement')} />
              </ListItemButton>
            </ListItem>
            {profile?.role === UserRole.GUIDER && (
              <Box>
                <Divider />
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton component={Link} to={PATH.tours} selected={isActive(location, PATH.tours)}>
                    <ListItemIcon>
                      <AddLocationAltOutlinedIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText primary={t('components.managementSideNav.tourManagement')} />
                  </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    component={Link}
                    to={PATH.bookingsManagement}
                    selected={isActive(location, PATH.bookingsManagement)}
                  >
                    <ListItemIcon>
                      <ConfirmationNumberOutlinedIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText primary={t('components.managementSideNav.bookingManagement')} />
                  </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton component={Link} to={PATH.schedule} selected={isActive(location, PATH.schedule)}>
                    <ListItemIcon>
                      <CalendarMonthIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText primary={t('components.managementSideNav.scheduleManagement')} />
                  </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    component={Link}
                    to={PATH.salesReport}
                    selected={isActive(location, PATH.salesReport)}
                  >
                    <ListItemIcon>
                      <TrendingUpIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText primary={t('components.managementSideNav.salesReport')} />
                  </ListItemButton>
                </ListItem>
              </Box>
            )}
          </List>
        </Paper>
      </div>
    </div>
  )
}

export default ManagementSideNav
