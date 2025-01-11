import { Link } from 'react-router-dom'
import { Box } from '@mui/material'
import LogoIcon from 'src/assets/svg/logo.svg'
import SvgIcon from '@mui/material/SvgIcon'
import { useTranslation } from 'react-i18next'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation()

  return (
    <div className='h-screen w-full'>
      <div className='grid h-full grid-cols-1 overflow-y-auto lg:grid-cols-5'>
        <div className='col-start-1 col-end-5 flex flex-col bg-white lg:col-span-2 lg:col-start-1'>
          <div className='header w-full px-6 pt-4'>
            <Link to='/'>
              <SvgIcon component={LogoIcon} inheritViewBox className='text-5xl' />
            </Link>
          </div>
          <div className='form mx-auto flex h-full w-full flex-grow flex-col justify-center gap-4 px-5 lg:px-7'>
            {children}
          </div>
        </div>
        <Box
          className='image hidden bg-cover bg-center lg:col-span-3 lg:col-start-3 lg:block'
          sx={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)),
            url('/assets/images/auth-cover.jpg')`
          }}
        >
          <div className='flex h-full items-center justify-center text-center text-5xl font-bold text-white'>
            {t('pages.authLayout.title')}
          </div>
        </Box>
      </div>
    </div>
  )
}
