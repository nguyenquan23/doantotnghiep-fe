/* eslint-disable @typescript-eslint/no-explicit-any */
import MenuIcon from '@mui/icons-material/Menu'
import MuiAppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import SvgIcon from '@mui/material/SvgIcon'
import Toolbar from '@mui/material/Toolbar'
import { styled } from '@mui/material/styles'
import WhiteLogoIcon from 'src/assets/svg/logo-white.svg'
import { drawerWidth } from 'src/constants/width-height.constant'
import AdminProfileMenu from './AdminProfileMenu/AdminProfileMenu'
import Box from '@mui/material/Box'
import LanguageSelector from '../Header/LanguageSelector/LanguageSelector'

interface AdminHeaderProps {
  handleDrawerOpen: () => void
  open: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }: any) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
})) as any

const AdminHeader: React.FC<AdminHeaderProps> = ({ handleDrawerOpen, open }: AdminHeaderProps) => {
  return (
    <AppBar position='fixed' open={open}>
      <Toolbar>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          onClick={handleDrawerOpen}
          edge='start'
          sx={{
            marginRight: 5,
            ...(open ? { display: 'none' } : {})
          }}
        >
          <MenuIcon />
        </IconButton>
        <SvgIcon component={WhiteLogoIcon} inheritViewBox className='h-8 w-8 sm:h-12 sm:w-12' />
        <Box sx={{ marginLeft: 'auto', display: 'flex' }}>
          <AdminProfileMenu />
          <LanguageSelector />
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default AdminHeader
