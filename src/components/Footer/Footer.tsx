import { Link } from 'react-router-dom'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import GoogleIcon from 'src/assets/svg/google.svg'
import FacebookIcon from 'src/assets/svg/facebook.svg'
import Instagram from 'src/assets/svg/instagram.svg'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <Box
      className='py-8 text-lg'
      sx={{ color: (theme) => theme.palette.grey[50], backgroundColor: '#006ce4'}}
    >
      <div className='block min-w-80 px-4 py-0 md:mx-auto md:px-8 lg:w-full lg:max-w-[1400px] xl:px-24'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-5'>
          <div className='col-span-1 mb-4 flex flex-col gap-3 md:col-span-2 md:mb-10'>
            <div className='text-lg font-bold uppercase'>{t('components.footer.contactInfo')}</div>
            <div className='head-office'>
              <b>{t('components.footer.headOffice')}:</b> Trường đại học bách khoa đà nẵng
            </div>
            <div className='email'>
              <b>{t('components.footer.email')}:</b> nguyenquan.212002@gmail.com
            </div>
            <div className='hotline'>
              <b>{t('components.footer.hotline')}:</b> 0766678406
            </div>
          </div>
          <div className='col-span-1 mb-4 flex flex-col gap-3 md:col-span-2 md:mb-10'>
            <div className='text-lg font-bold uppercase'>{t('components.footer.subscribeUs')}</div>
            <span className=''>{t('components.footer.getLatest')}</span>
            <div className='flex gap-2'>
              <TextField
                label={t('components.footer.enterEmail')}
                variant='filled'
                size='small'
                sx={{
                  backgroundColor: (theme) => theme.palette.warning.contrastText
                }}
              />
              <Button className='uppercase' variant='contained' size='small'>
                {t('components.footer.subscribe')}
              </Button>
            </div>
            <div className='uppercase'>{t('components.footer.followUs')}</div>
            <div className='flex gap-3'>
              <SvgIcon component={GoogleIcon} inheritViewBox className='h-8 w-8 md:h-10 md:w-10' />
              <SvgIcon component={FacebookIcon} inheritViewBox className='h-8 w-8 md:h-10 md:w-10' />
              <SvgIcon component={Instagram} inheritViewBox className='h-8 w-8 md:h-10 md:w-10' />
            </div>
          </div>
          <div className='col-span-1 flex flex-col gap-3 md:col-span-1'>
            <div className='text-lg font-bold uppercase'>{t('components.footer.policy')}</div>
            <Link to=''>{t('components.footer.bookingPolicy')}</Link>
            <Link to=''>{t('components.footer.customerRight')}</Link>
            <Link to=''>{t('components.footer.privacyPolicy')}</Link>
            <Link to=''>{t('components.footer.baggageRegulations')}</Link>
            <Link to=''>{t('components.footer.feq')}</Link>
          </div>
        </div>
      </div>
    </Box>
  )
}
