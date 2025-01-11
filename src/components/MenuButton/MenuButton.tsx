import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import { ReactNode, useState } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import theme from 'src/theme'

interface MenuButtonProps {
  children: ReactNode
  text: string
  icon: ReactNode
}

const MenuButton = ({ children, text, icon }: MenuButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const isLgBreakpoint = useMediaQuery(theme.breakpoints.up('lg'))
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => setAnchorEl(event.currentTarget)

  const handleClose = () => setAnchorEl(null)

  return (
    <>
      <Button
        id='demo-customized-button'
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        variant='outlined'
        disableElevation
        onClick={handleClick}
        size='large'
        endIcon={<KeyboardArrowDownIcon />}
        className='min-h-[55px]'
        sx={{
          fontWeight: 800,
          borderColor: '#c4c4c4',
          '&:hover': {
            borderColor: '#564345',
            backgroundColor: 'transparent'
          }
        }}
      >
        {isLgBreakpoint ? text : icon}
      </Button>
      <Popover
        id='demo-customized-menu'
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        disableScrollLock
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        className='p-4'
        sx={{
          '& .MuiPaper-root': {
            marginTop: '8px',
            borderRadius: '12px'
          }
        }}
      >
        {children}
      </Popover>
    </>
  )
}

export default MenuButton
