import Pagination from '@mui/material/Pagination'
import Skeleton from '@mui/material/Skeleton'
import SvgIcon from '@mui/material/SvgIcon'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ChangeEvent, useContext } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import tourApi from 'src/apis/tour.api'
import DotsIcon from 'src/assets/svg/dots.svg'
import NoodleIcon from 'src/assets/svg/noodle.svg'
import TourCard from 'src/components/TourCard'
import useQueryConfig, { QueryConfig } from 'src/hooks/useQueryConfig'
import { Tour } from 'src/types/tour.type'
import SortFilterTours from './components'
import { isTourInWishlist } from 'src/utils/wishlist'
import wishlistApi from 'src/apis/wishlist.api'
import { AppContext } from 'src/contexts/app.context'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'

export default function SearchTours() {
  const { profile, isAuthenticated } = useContext(AppContext)
  const queryConfig: QueryConfig = useQueryConfig()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { data: toursData, isPending } = useQuery({
    queryKey: ['toursSearch', queryConfig],
    queryFn: () => tourApi.searchTours(queryConfig),
    placeholderData: keepPreviousData,
    staleTime: 2 * 1000
  })
  const { data: wishListData, refetch } = useQuery({
    queryKey: [`wishlist of user with id ${profile?.id}`],
    queryFn: () => wishlistApi.getWishlist(),
    staleTime: 5 * 1000,
    enabled: isAuthenticated
  })

  const handlePaginationChange = (_event: ChangeEvent<unknown>, value: number) => {
    navigate({
      search: createSearchParams({
        ...queryConfig,
        page: (value - 1).toString()
      }).toString()
    })
  }

  return (
    <Box className='flex h-auto min-h-[100%] flex-col gap-4'>
      <div className='search-container__header container mt-4 flex min-w-80 flex-col items-start justify-between gap-4 md:flex-row'>
        <div className='header-title flex w-full'>
          <SvgIcon component={DotsIcon} inheritViewBox className=' mr-2 mt-0 h-20 w-full max-w-12 lg:mt-3' />
          <div className='search-container__header-content flex w-full flex-col'>
            <span className='text-base font-semibold sm:text-2xl'>{t('pages.search.searchTours.title')}</span>
            <div className='search-container__header-content--noodle flex flex-row justify-between gap-8'>
              <div className='flex pt-2'>
                <h2 className='pr-4 text-[2rem] leading-[3rem] sm:text-[2.75rem] lg:text-[4rem] lg:leading-[5.25rem]'>
                  {queryConfig.searchValue}
                </h2>
                <SvgIcon
                  component={NoodleIcon}
                  inheritViewBox
                  className='mt-[-20px] hidden h-[10rem] w-full max-w-[14em] lg:block'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='search-container__actions'>
        <div className='actions-container container'>
          <h2 className='my-4 text-3xl leading-8 lg:text-4xl lg:leading-[2.75rem]'>
            {t('pages.search.searchTours.allTours')}
          </h2>
          <SortFilterTours />
          <div className='my-4 text-sm font-semibold  text-[var(--label-secondary)]'>
            {isPending ? (
              <Skeleton variant='text' sx={{ fontSize: '1rem' }} width={100} />
            ) : (
              `${toursData?.data.data.totalOfResult} ${t('pages.search.searchTours.toursFound')}`
            )}
          </div>
          <div className='collection-body mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {isPending
              ? Array(8)
                  .fill(0)
                  .map((_, index) => <Skeleton variant='rounded' width='100%' height='300px' key={index} />)
              : toursData?.data.data.tourDTOS.map((tourData: Tour) => (
                  <TourCard
                    key={tourData.id}
                    tourData={tourData}
                    isTourInWishList={!!isTourInWishlist(wishListData?.data.data as Tour[], tourData.id)}
                    refetch={refetch}
                  />
                ))}
          </div>
        </div>
      </div>
      {toursData && (toursData.data.data.totalOfPage as unknown as number) > 0 && (
        <Pagination
          onChange={handlePaginationChange}
          count={toursData.data.data.totalOfPage as unknown as number}
          className='mb-4 flex justify-center'
          size='large'
          variant='outlined'
          color='primary'
        />
      )}
    </Box>
  )
}
