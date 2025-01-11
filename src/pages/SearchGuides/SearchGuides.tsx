import MenuItem from '@mui/material/MenuItem'
import Pagination from '@mui/material/Pagination'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Skeleton from '@mui/material/Skeleton'
import SvgIcon from '@mui/material/SvgIcon'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ChangeEvent, useState } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import guideApi from 'src/apis/guide.api'
import DotsIcon from 'src/assets/svg/dots.svg'
import NoodleIcon from 'src/assets/svg/noodle.svg'
import GuideCard from 'src/components/GuideCard'
import useQueryConfig, { QueryConfig } from 'src/hooks/useQueryConfig'
import { Guide } from 'src/types/guide.type'
import SortIcon from '@mui/icons-material/Sort'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'

export default function SearchGuides() {
  const queryConfig: QueryConfig = useQueryConfig()
  const { t } = useTranslation()
  const { data: guidesData, isPending } = useQuery({
    queryKey: ['guidesSearch', queryConfig],
    queryFn: () => guideApi.searchGuides(queryConfig),
    placeholderData: keepPreviousData,
    staleTime: 2 * 1000
  })

  const navigate = useNavigate()
  const getInitialSortingValue = () => {
    if (queryConfig.sortBy && queryConfig.order) {
      return `${queryConfig.sortBy}-${queryConfig.order}`
    }
    return ''
  }
  const [sortingValue, setSortingValue] = useState<string>(getInitialSortingValue())

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value
    setSortingValue(selectedValue)
    const [sortBy, order] = selectedValue.split('-')
    navigate({
      search: createSearchParams({
        ...queryConfig,
        sortBy: sortBy,
        order
      }).toString()
    })
  }

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
            <span className='text-base font-semibold sm:text-2xl'>{t('pages.search.searchGuides.guidesMatch')}</span>
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
      <div className='search-container__action mt-4'>
        <div className='actions-container container'>
          <h2 className='my-4 text-3xl leading-8 lg:text-4xl lg:leading-[2.75rem]'>
            {t('pages.search.searchGuides.allGuides')}
          </h2>
          <div className='sort-filter-container flex flex-col flex-nowrap items-start justify-between gap-4 pb-2 md:flex-row md:items-center'>
            <div className='sort-container flex items-center'>
              <Select
                name='sortBy'
                value={sortingValue}
                onChange={handleSortChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                className='h-14 min-w-48'
                MenuProps={{ disableScrollLock: true }}
                startAdornment={<SortIcon className='mr-1' />}
                style={{ height: 63, marginTop: '-6px' }}
                sx={{ color: (theme) => theme.palette.primary.main, fontWeight: 800 }}
              >
                <MenuItem disabled value=''>
                  <em>{t('pages.search.sort')}</em>
                </MenuItem>
                <MenuItem value='overallRating-asc'>{t('pages.search.ratingLTH')}</MenuItem>
                <MenuItem value='overallRating-desc'>{t('pages.search.ratingHTL')}</MenuItem>
              </Select>
            </div>
          </div>
          <div className='my-4 text-sm font-semibold text-[var(--label-secondary)]'>
            {isPending ? (
              <Skeleton variant='text' sx={{ fontSize: '1rem' }} width={100} />
            ) : (
              `${guidesData?.data.data.totalOfResult} ${t('pages.search.searchGuides.guidesFound')}`
            )}
          </div>
          <div className='collection-body mb-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {isPending
              ? Array(8)
                  .fill(0)
                  .map((_, index) => <Skeleton variant='rounded' width='100%' height='300px' key={index} />)
              : guidesData?.data.data.guides.map((guideData: Guide) => (
                  <GuideCard key={guideData.id} guideData={guideData} />
                ))}
          </div>
        </div>
      </div>
      {guidesData && (guidesData.data.data.totalOfPage as unknown as number) > 0 && (
        <Pagination
          onChange={handlePaginationChange}
          count={guidesData.data.data.totalOfPage as unknown as number}
          className='my-6 mb-4 flex justify-center'
          size='large'
          variant='outlined'
          color='primary'
        />
      )}
    </Box>
  )
}
