import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import Button from '@mui/material/Button'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import classNames from 'classnames'
import { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PATH from 'src/constants/path.constant'
import { AppContext } from 'src/contexts/app.context'
import { clearLocalStorage } from 'src/utils/auth'
import ViewListIcon from '@mui/icons-material/ViewList'
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined'
import { Divider } from '@mui/material'
import { UserRole } from 'src/enums/user-role.enum'
import { useTranslation } from 'react-i18next'

interface ProfileMenuProps {
  textColor: string
}

export default function ProfileMenu({ textColor }: ProfileMenuProps) {
  const { isAuthenticated, profile } = useContext(AppContext)
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)

  const handleClose = () => setAnchorEl(null)

  const handleLogout = () => {
    clearLocalStorage()
    navigate(PATH.home)
    window.location.reload()
    handleClose()
  }

  return (
    <>
      <Button
        onClick={handleClick}
        className={classNames(
          'ml-0 flex flex-col items-center text-sm font-normal hover:after:w-full md:after:absolute md:after:bottom-[1.5px] md:after:left-0 md:after:h-[2.5px] md:after:w-0 md:after:bg-orange-500 md:after:transition-all md:after:duration-300',
          {
            'md:after:w-full': location.pathname.includes(PATH.account) || location.pathname.includes(PATH.management)
          }
        )}
        sx={{
          '&.MuiButtonBase-root:hover': {
            bgcolor: 'transparent'
          },
          color: textColor
        }}
        disableRipple
        disableFocusRipple
      >
        <AccountCircleOutlinedIcon sx={{ fontSize: 24, color: textColor, marginBottom: '4px' }} />
        <span className='hidden w-full overflow-x-hidden text-ellipsis text-sm md:block'>
          {isAuthenticated && profile && (profile.fullName?.split(' ')[0] || profile?.email.split('@')[0])}
        </span>
      </Button>
      {!isAuthenticated && (
        <Menu
          disableScrollLock
          id='basic-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button'
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          sx={{
            '& .MuiPaper-root': {
              marginTop: '4px',
              minWidth: 180
            }
          }}
        >
          <MenuItem component={Link} to={PATH.guideApplications} onClick={handleClose}>
            <ListItemIcon>
              <ContactPageOutlinedIcon fontSize='small' />
            </ListItemIcon>
            {t('components.profileMenu.becomeAGuide')}
          </MenuItem>
          <Divider />
          <MenuItem component={Link} to={PATH.login}>
            <ListItemIcon>
              <LoginIcon fontSize='small' />
            </ListItemIcon>
            {t('components.profileMenu.signIn')}
          </MenuItem>
          <MenuItem component={Link} to={PATH.register}>
            <ListItemIcon>
              <PersonAddAlt1Icon fontSize='small' />
            </ListItemIcon>
            {t('components.profileMenu.signUp')}
          </MenuItem>
        </Menu>
      )}
      {isAuthenticated && (
        <Menu
          disableScrollLock
          id='basic-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button'
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          sx={{
            '& .MuiPaper-root': {
              marginTop: '4px',
              minWidth: 180
            }
          }}
        >
          <MenuItem component={Link} to={PATH.profile} onClick={handleClose}>
            <ListItemIcon>
              <SettingsOutlinedIcon fontSize='small' />
            </ListItemIcon>
            {t('components.profileMenu.settings')}
          </MenuItem>
          <MenuItem component={Link} to={PATH.tourRequest} onClick={handleClose}>
            <ListItemIcon>
              <ViewListIcon fontSize='small' />
            </ListItemIcon>
            {t('components.profileMenu.management')}
          </MenuItem>
          {profile?.role !== UserRole.GUIDER && (
            <MenuItem component={Link} to={PATH.guideApplications} onClick={handleClose}>
              <ListItemIcon>
                <ContactPageOutlinedIcon fontSize='small' />
              </ListItemIcon>
              {t('components.profileMenu.becomeAGuide')}
            </MenuItem>
          )}
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize='small' />
            </ListItemIcon>
            {t('components.profileMenu.logOut')}
          </MenuItem>
        </Menu>
      )}
    </>
  )
}
