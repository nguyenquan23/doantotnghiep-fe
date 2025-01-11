import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import SortIcon from '@mui/icons-material/Sort'
import { Box, Typography } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import isEmpty from 'lodash/isEmpty'
import omitBy from 'lodash/omitBy'
import { SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createSearchParams, useNavigate } from 'react-router-dom'
import categoryApi from 'src/apis/category.api'
import CurrencyInput from 'src/components/CurrencyInput/CurrencyInput'
import MenuButton from 'src/components/MenuButton/MenuButton'
import useQueryConfig, { QueryConfig } from 'src/hooks/useQueryConfig'
import { TourCategory } from 'src/types/tour.type'

export default function SortFilterTours() {
  const queryConfig: QueryConfig = useQueryConfig()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories(),
    placeholderData: keepPreviousData,
    staleTime: 10 * 1000
  })

  const getInitialSortingValue = useCallback(
    () => (queryConfig.sortBy && queryConfig.order ? `${queryConfig.sortBy}-${queryConfig.order}` : ''),
    [queryConfig.sortBy, queryConfig.order]
  )

  const getInitialCategories = useCallback((): TourCategory[] => {
    if (!queryConfig.categoryId) return []
    const paramIds = queryConfig.categoryId.split(',').map(Number)
    return categoriesData?.data.data.filter((category) => paramIds.includes(category.id)) || []
  }, [queryConfig.categoryId, categoriesData])

  const getInitialPrice = useCallback((name: 'minPrice' | 'maxPrice') => queryConfig[name] || '', [queryConfig])

  const [sortingValue, setSortingValue] = useState<string>(getInitialSortingValue())
  const [minPrice, setMinPrice] = useState<string>(getInitialPrice('minPrice'))
  const [maxPrice, setMaxPrice] = useState<string>(getInitialPrice('maxPrice'))
  const [categories, setCategories] = useState<TourCategory[]>([])

  useEffect(() => {
    if (categoriesData) {
      setCategories(getInitialCategories())
    }
  }, [categoriesData, getInitialCategories])

  const handleSortChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const selectedValue = event.target.value
      setSortingValue(selectedValue)
      const [sortBy, order] = selectedValue.split('-')
      navigate({
        search: createSearchParams({
          ...queryConfig,
          sortBy,
          order
        }).toString()
      })
    },
    [navigate, queryConfig]
  )

  const handleCurrencyInputChange = useCallback(
    (name: string, value: string) => {
      let newMinPrice = minPrice
      let newMaxPrice = maxPrice

      if (parseFloat(value) < 0 || value === '') return

      if (name === 'minPrice' && value !== minPrice) {
        newMinPrice = value
      }

      if (name === 'maxPrice' && value !== maxPrice) {
        newMaxPrice = value
      }

      if (newMinPrice !== minPrice || newMaxPrice !== maxPrice) {
        setMinPrice(newMinPrice)
        setMaxPrice(newMaxPrice)

        navigate({
          search: createSearchParams(
            omitBy(
              {
                ...queryConfig,
                minPrice: newMinPrice,
                maxPrice: newMaxPrice
              },
              isEmpty
            )
          ).toString()
        })
      }
    },
    [maxPrice, minPrice, navigate, queryConfig]
  )

  const handleCategoriesChange = useCallback(
    (_event: SyntheticEvent<Element, Event>, value: TourCategory[]) => {
      setCategories(value)
      navigate({
        search: createSearchParams({
          ...queryConfig,
          categoryId: value.map((category) => category.id).join(',')
        }).toString()
      })
    },
    [navigate, queryConfig]
  )

  return (
    <div className='sort-filter-container flex flex-col flex-nowrap items-start justify-between gap-4 py-2 md:flex-row md:items-center'>
      <div className='sort-container flex w-full flex-col gap-4 sm:w-fit sm:flex-row'>
        <MenuButton text={t('pages.search.searchTours.price')} icon={<AttachMoneyIcon />}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              paddingY: 2,
              paddingX: 3,
              gap: 2
            }}
          >
            <Typography variant='subtitle2' sx={{ color: (theme) => theme.palette.secondary.main }}>
              {t('pages.search.searchTours.filterByPriceRange')}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <CurrencyInput
                name='minPrice'
                label={t('pages.search.searchTours.minPrice')}
                prefix='$'
                value={minPrice}
                onChange={handleCurrencyInputChange}
                className='w-auto'
              />
              -
              <CurrencyInput
                name='maxPrice'
                label={t('pages.search.searchTours.maxPrice')}
                prefix='$'
                value={maxPrice}
                onChange={handleCurrencyInputChange}
                className='w-auto'
              />
            </Box>
          </Box>
        </MenuButton>

        <Autocomplete
          multiple
          id='tags-outlined'
          defaultValue={categories}
          value={categories}
          options={categoriesData?.data.data || []}
          getOptionLabel={(option: TourCategory) => option.name}
          isOptionEqualToValue={(option, value) => option && option.id === value.id}
          onChange={handleCategoriesChange}
          renderInput={(params) => <TextField {...params} label={t('pages.search.searchTours.categories')} />}
          renderTags={(value, getTagProps) => {
            const numTags = value.length
            const limitTags = 1
            return (
              <>
                {value.slice(0, limitTags).map((option, index) => (
                  <Chip {...getTagProps({ index })} key={index} label={option.name ? option.name : ''} />
                ))}

                {numTags > limitTags && ` +${numTags - limitTags}`}
              </>
            )
          }}
          renderOption={(props, option) => (
            <li {...props}>
              <Box sx={{ marginRight: 8 }}>{option.name}</Box>
            </li>
          )}
          sx={{
            minWidth: '250px'
          }}
        />
      </div>
      <div className='filter-container w-full sm:w-fit'>
        <Select
          name='sort-by'
          value={sortingValue}
          onChange={handleSortChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          className='h-14 min-w-48'
          MenuProps={{ disableScrollLock: true }}
          startAdornment={<SortIcon className='mr-1' />}
          style={{ height: 63, marginTop: '-6px' }}
          sx={{ color: (theme) => theme.palette.primary.main, fontWeight: 800, width: '100%' }}
        >
          <MenuItem disabled value=''>
            <em>
              <strong>{t('pages.search.sort')}</strong>
            </em>
          </MenuItem>
          <MenuItem value='overallRating-asc'>{t('pages.search.ratingLTH')}</MenuItem>
          <MenuItem value='overallRating-desc'>{t('pages.search.ratingHTL')}</MenuItem>
        </Select>
      </div>
    </div>
  )
}
