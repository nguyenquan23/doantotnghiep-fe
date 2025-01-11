import { Box } from '@mui/material'
import { AppContext } from 'src/contexts/app.context'
import { useContext } from 'react'
import { t } from 'i18next'

const AvatarSideNav: React.FC = () => {
  const { profile } = useContext(AppContext)

  return (
    <Box
      className='account__header relative flex h-32 flex-col justify-center overflow-hidden text-center text-white'
      sx={{ backgroundColor: `var(--decorative-midnight-blue)` }}
    >
      <h2 className='account__header-name mb-1 text-2xl font-bold'>
        {profile?.fullName || profile?.email.split('@')[0]}
      </h2>
      <h4 className='account__header-subheading font-bold uppercase tracking-wide'>
        {t(`enums.userRole.${profile?.role}`)}
      </h4>
      <img
        src='/assets/svg/top-line.svg'
        className='absolute right-[-130px] top-[-10px]'
        alt='account__header__top-line'
      />
      <img
        src='/assets/svg/bottom-line.svg'
        className='absolute bottom-[5px] left-[-120px]'
        alt='account__header__bottom-line'
      />
    </Box>
  )
}

export default AvatarSideNav
