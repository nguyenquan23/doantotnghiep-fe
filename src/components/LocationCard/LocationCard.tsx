/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import omit from 'lodash/omit'
import { createSearchParams, useNavigate } from 'react-router-dom'
import PATH from 'src/constants/path.constant'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { PopularCity } from 'src/types/booking.type'

interface Props {
  city: PopularCity
}

const LocationCard: React.FC<Props> = ({ city }: Props) => {
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()

  const searchTour = () => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            searchValue: city.name
          },
          ['order', 'sortBy']
        )
      : {
          ...queryConfig,
          searchValue: city.name
        }
    const searchPath = `../${PATH.searchTour}`
    const searchQuery = createSearchParams(config).toString()
    navigate(`${searchPath}?${searchQuery}`, {
      replace: true
    })
  }

  return (
    <div onClick={searchTour}>
      <div className='location-card h-52 w-48 '>
        <div className='location-card__image relative h-full  '>
          <img
            src={city.image || '/assets/images/city-default.jpg'}
            alt='location img'
            loading='lazy'
            className='absolute h-full w-full rounded-md object-cover'
          />
          <div className='text-md absolute z-10 flex h-full w-full flex-col items-center justify-end px-4 py-2 text-left font-bold leading-6 text-white drop-shadow-lg'>
            {city.name}
          </div>
          <div className='absolute bottom-0 h-[25%] w-full rounded-md bg-gradient-to-b from-transparent via-[rgba(26,43,73,0.75)] to-[rgba(26,43,73,0.9)]'></div>
        </div>
      </div>
    </div>
  )
}

export default LocationCard
