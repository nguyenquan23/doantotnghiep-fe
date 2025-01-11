import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import Box from '@mui/material/Box'
import SvgIcon from '@mui/material/SvgIcon'
import { CssVarsTheme, Theme } from '@mui/material/styles'
import classNames from 'classnames'
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import WhiteLogoIcon from 'src/assets/svg/logo-white.svg'
import MainLogoIcon from 'src/assets/svg/logo.svg'
import PATH from 'src/constants/path.constant'
import { headerHeight } from 'src/constants/width-height.constant'
import { AppContext } from 'src/contexts/app.context'
import CartBadge from './CartBadge/CartBadge'
import NavLink from './NavLink'
import Notification from './Notification/Notification'
import ProfileMenu from './ProfileMenu'
import RightDrawer from './RightDrawer/RightDrawer'
import SearchBar from './SearchBar/SearchBar'
import ReceiptIcon from '@mui/icons-material/Receipt'
import LanguageSelector from './LanguageSelector/LanguageSelector'
import { useTranslation } from 'react-i18next'

interface HeaderProps {
  bgColor?: string
  textColor?: string
  logoColor?: 'main' | 'white'
  isEnableScroll?: boolean
}

export default function Header({
  bgColor = 'linear-gradient(180deg,#392a2a1c  0,rgba(0,0,0,0))',
  textColor = ((theme: Omit<Theme, 'palette'> & CssVarsTheme) => theme.palette.primary.main).toString(),
  logoColor = 'main',
  isEnableScroll = true
}: HeaderProps) {
  const { isAuthenticated } = useContext(AppContext)
  const [scroll, setScroll] = useState<boolean>(false)
  const { t } = useTranslation()

  useEffect(() => {
    if (!isEnableScroll) return

    const handleScroll = () => {
      const scrollHeight = window.scrollY
      const specificHeight = 85

      if (scrollHeight > specificHeight) {
        setScroll(true)
        return
      }
      setScroll(false)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isEnableScroll])

  return (
    <Box
      className={classNames('header__container top-0', {
        sticky: scroll && isEnableScroll
      })}
      sx={{
        height: headerHeight.sm,
        width: '100%',
        background: `${scroll && isEnableScroll ? 'white' : bgColor}`,
        '@media (min-width: 768px)': {
          height: headerHeight.md
        },
        boxShadow: `${scroll && isEnableScroll && 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px'}`,
        zIndex: '1100'
      }}
    >
      <Box className='header__content block min-w-80 px-4 py-2 md:mx-auto md:px-8 md:py-3 lg:w-full lg:max-w-[1400px] lg:px-8 xl:px-24'>
        <div className='grid grid-cols-12'>
          <Link to='/' className='col-span-1 flex items-center'>
            <SvgIcon
              component={logoColor === 'main' ? MainLogoIcon : scroll && isEnableScroll ? MainLogoIcon : WhiteLogoIcon}
              inheritViewBox
              className='h-8 w-8 sm:h-10 sm:w-10 md:h-14 md:w-14'
              style={{width:"150px"}}
            />
          </Link>
          <SearchBar className='search-bar col-span-8 col-start-2 mx-4 flex h-[48px] items-center md:h-[60px] lg:col-span-6 lg:mr-6' />
          <Box
            className='col-span-3 col-start-10 flex items-center justify-end'
            sx={{ color: `${scroll && isEnableScroll ? 'black' : textColor}` }}
          >
            {isAuthenticated && (
              <Box
                className='col-span-3 col-start-10 hidden xl:flex xl:items-center xl:justify-end'
                sx={{ color: `${scroll && isEnableScroll ? 'black' : textColor}` }}
              >
                <NavLink
                  to={PATH.wishlist}
                  icon={<FavoriteBorderIcon sx={{ fontSize: 24 }} />}
                  text={t('components.header.wishlist')}
                />
                <NavLink to={PATH.cart} icon={<CartBadge />} text={t('components.header.cart')} />
                <NavLink
                  to={PATH.bookings}
                  icon={<ConfirmationNumberOutlinedIcon sx={{ fontSize: 24 }} />}
                  text={t('components.header.bookings')}
                />
                <NavLink
                  to={PATH.invoices}
                  icon={<ReceiptIcon sx={{ fontSize: 24 }} />}
                  text={t('components.header.invoices')}
                />
              </Box>
            )}
            {isAuthenticated && <Notification textColor={scroll && isEnableScroll ? 'black' : textColor} />}
            <Box className='hidden xl:flex'>
              <ProfileMenu textColor={scroll && isEnableScroll ? 'black' : textColor} />
              <LanguageSelector />
            </Box>
            <Box className='drawer col-span-1 col-start-12 flex items-center justify-end xl:hidden'>
              <LanguageSelector />
              <RightDrawer textColor={scroll && isEnableScroll ? 'black' : textColor} />
            </Box>
          </Box>
        </div>
      </Box>
    </Box>
  )
}
