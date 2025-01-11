import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'

const ReviewTitle: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div id='review-title' className='activity__customer-reviews--title flex items-center gap-2'>
      <p className='text-[18px] font-semibold md:text-2xl'>{t('pages.tourDetails.customerReviews')}</p>
      <Tooltip title={t('pages.tourDetails.customerReviewsTooltip')}>
        <IconButton>
          <InfoOutlinedIcon />
        </IconButton>
      </Tooltip>
    </div>
  )
}

export default ReviewTitle
