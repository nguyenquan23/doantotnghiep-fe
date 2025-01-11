import Rating from '@mui/material/Rating'
import { useTranslation } from 'react-i18next'

interface OverallRatingProps {
  ratingReviewsAverage: number
  totalReviews: number
}

const OverallRating: React.FC<OverallRatingProps> = ({ ratingReviewsAverage, totalReviews }: OverallRatingProps) => {
  const { t } = useTranslation()

  return (
    <div className='reviews-summary__rating flex flex-col items-center'>
      <h3 className='reviews-summary__title'>{t('pages.tourDetails.overallRating')}</h3>
      <div className='reviews-summary__content flex flex-col'>
        <div className='average-rating flex items-center justify-center gap-2'>
          <span className='current-average-rating text-3xl font-bold md:text-4xl'>{ratingReviewsAverage}</span>
          <span className='max-rating text-xl font-bold text-slate-500 md:text-2xl'>/5</span>
        </div>
        <Rating
          sx={{
            '& .MuiRating-icon': { fontSize: '3rem' }
          }}
          max={5}
          precision={0.1}
          value={ratingReviewsAverage}
          readOnly
        />
        <span className='mt-2 text-center font-semibold text-slate-500'>
          {t('pages.tourDetails.baseOnReviews', {
            totalReviews
          })}
        </span>
      </div>
    </div>
  )
}

export default OverallRating
