import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import { Button } from '@mui/material'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import PATH from 'src/constants/path.constant'
import { AppContext } from 'src/contexts/app.context'
import { clearLocalStorage } from 'src/utils/auth'

const AdminProfileMenu: React.FC = () => {
  const { profile } = useContext(AppContext)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const open = Boolean(anchorEl)
  const { t } = useTranslation()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)

  const handleLogout = () => {
    clearLocalStorage()
    navigate(PATH.home)
    window.location.reload()
  }

  return (
    <>
      <Button
        onClick={handleClick}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: 'fit-content',
          '&.MuiButtonBase-root:hover': {
            bgcolor: 'transparent'
          },
          color: 'white'
        }}
        disableRipple
        disableFocusRipple
      >
        <AccountCircleOutlinedIcon sx={{ fontSize: 24, color: 'white', marginBottom: '4px' }} />
        <span className='hidden overflow-x-hidden text-ellipsis text-sm md:block'>{profile?.email}</span>
      </Button>
      <Menu
        disableScrollLock
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={() => {
          setAnchorEl(null)
        }}
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
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize='small' />
          </ListItemIcon>
          {t('components.profileMenu.logOut')}
        </MenuItem>
      </Menu>
    </>
  )
}

export default AdminProfileMenu
