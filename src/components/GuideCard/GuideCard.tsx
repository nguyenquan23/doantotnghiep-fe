import GradeIcon from '@mui/icons-material/Grade'
import LanguageIcon from '@mui/icons-material/Language'
import { Box } from '@mui/material'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import PATH from 'src/constants/path.constant'
import { Guide } from 'src/types/guide.type'

export default function GuideCard({ guideData }: { guideData: Guide }) {
  const { t } = useTranslation()

  return (
    <Link to={`${PATH.guideProfile.replace(':id', guideData.id.toString())}`} className='relative'>
      <Box
        sx={{
          boxShadow: 'rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px'
        }}
        className='tour-card__wrapper relative flex h-[440px] flex-col justify-between gap-4 overflow-hidden rounded duration-300 ease-in-out hover:scale-[1.02]'
      >
        <div className='tour-card__top-wrapper'>
          <div className='tour-card__top relative'>
            <div className='tour-card__photo relative mx-auto my-5 h-48 w-48'>
              <img
                 src={guideData.avatar || `/assets/images/default-user${Math.floor(Math.random() * 5) + 1}.jpg`}
                alt='Guide img'
                loading='lazy'
                className='h-full w-full rounded-full border-2 border-[var(--decorative-midnight-blue)] object-cover'
              />
              <div className='absolute left-[33px] top-[15px] h-28 w-[210px] rotate-[60deg] rounded-t-full border-l-[3px] border-r-[3px] border-t-[3px] border-[var(--decorative-orange)]'></div>
            </div>
            <div className='tour-card__header my-2 px-3 text-center'>
              <h3 className='title capitalize text-[var(--label-primary)] lg:max-h-20 lg:overflow-hidden'>
                {guideData?.fullName}
              </h3>
              <h5 className='text-[var(--label-secondary)]'>@{guideData.email || 'N/A email'}</h5>
              <h5 className='text-[var(--decorative-orange)]'>
                {t('components.guideCard.from')} {guideData?.address || 'N/A address'}
              </h5>
            </div>
            <div className='tour-card__body px-4 py-0 text-center text-sm text-[var(--label-primary)] sm:px-3'>
              <li className='line-clamp-3 text-sm font-semibold'>{guideData?.biography}</li>
            </div>
          </div>
        </div>
        <div className='tour-card__details mb-4 flex flex-col gap-2 px-3 lg:max-h-40 lg:overflow-hidden'>
          <div className='rating-overall-container flex items-start justify-between gap-2 rounded-md bg-blue-50 px-4 py-2'>
            <div className='flex items-center gap-1'>
              <GradeIcon className='text-yellow-400' fontSize='small' />
              {guideData?.overallRating || 'N/A'}
            </div>
            <div className='language-container inline-block w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-md text-right'>
              <LanguageIcon className='mr-[2px] text-blue-400' fontSize='small' />
              {guideData?.languageSkill.length > 0
                ? guideData?.languageSkill.map((skill, index) => (
                    <Fragment key={skill.id}>
                      <span className='language__number text-sm font-semibold'>{skill.language}</span>
                      {index < guideData?.languageSkill.length - 1 && ', '}
                    </Fragment>
                  ))
                : 'N/A'}
            </div>
          </div>
        </div>
        <div className='card-bottom-border absolute bottom-[-2px] left-0 h-4 w-full rounded-b-md border-b-4 border-[var(--decorative-orange)]'></div>
      </Box>
    </Link>
  )
}
