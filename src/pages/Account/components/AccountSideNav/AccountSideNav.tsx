import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonIcon from '@mui/icons-material/Person'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import AvatarSideNav from 'src/components/AvatarSideNav/AvatarSideNav'
import PATH from 'src/constants/path.constant'
import { isActive } from 'src/utils/active.util'

export default function AccountSideNav() {
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <div className='account__container flex-auto md:m-0'>
      <AvatarSideNav />
      <div className='account__side-menu'>
        <Paper>
          <List sx={{ padding: 0 }}>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton component={Link} to={PATH.profile} selected={isActive(location, PATH.profile)}>
                <ListItemIcon>
                  <PersonIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText primary={t('components.accountSideNav.profile')} />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton component={Link} to={PATH.password} selected={isActive(location, PATH.password)}>
                <ListItemIcon>
                  <LockOutlinedIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText primary={t('components.accountSideNav.password')} />
              </ListItemButton>
            </ListItem>
          </List>
        </Paper>
      </div>
    </div>
  )
}
