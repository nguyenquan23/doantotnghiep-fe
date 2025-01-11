import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined'
import SearchIcon from '@mui/icons-material/Search'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useQuery } from '@tanstack/react-query'
import debounce from 'lodash/debounce'
import { useEffect, useMemo, useState } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import searchSuggestionApi from 'src/apis/suggestion.api'
import { SearchType } from 'src/enums/search-type.enum'
import useQueryConfig from 'src/hooks/useQueryConfig'
import useSearchToursGuides from 'src/hooks/useSearchToursGuides'
import theme from 'src/theme'
import { SearchResult, SearchSuggestionResult } from 'src/types/search-suggestion-result.type'

interface SearchBarProps {
  className: string
}

const SearchBar: React.FC<SearchBarProps> = ({ className }: SearchBarProps) => {
  const queryConfig = useQueryConfig()
  const location = useLocation()
  const { t } = useTranslation()
  const { onSubmitSearch, control, trigger, register, setValue } = useSearchToursGuides()
  const [search, setSearch] = useState({
    searchType: (location.pathname.includes(SearchType.GUIDE) ? SearchType.GUIDE : SearchType.TOUR) as string,
    searchValue: queryConfig.searchValue || ''
  })
  const [isTypingMode, setIsTypingMode] = useState<boolean>(false)
  const [searchSuggestionResults, setSearchSuggestionResults] = useState<SearchResult[]>([])
  const isMdBreakpoint = useMediaQuery(theme.breakpoints.up('md'))
  const { data: searchSuggestionData } = useQuery({
    queryKey: ['searchSuggestion', search.searchType, search.searchValue],
    queryFn: () => searchSuggestionApi.getSearchSuggestions(search),
    staleTime: 1 * 1000,
    enabled: search.searchValue.trim() !== '' && !!isTypingMode
  })

  const handleSearchValueChange = useMemo(
    () =>
      debounce((searchValue: string, action: 'select' | 'type') => {
        if (searchValue !== search.searchValue && action === 'type') setSearch({ ...search, searchValue })
      }, 300),
    [search, setSearch]
  )

  const transformSearchSuggestions = (result: SearchSuggestionResult) => {
    const convertedAddresses = result.addresses.map((address) => ({
      resultName: address
    }))
    return [...convertedAddresses, ...result.toursOrGuiders]
  }

  useEffect(() => {
    if (searchSuggestionData?.data?.data) {
      const mergedSearchResults = transformSearchSuggestions(searchSuggestionData.data.data)
      setSearchSuggestionResults(mergedSearchResults)
    }
  }, [searchSuggestionData])

  return (
    <form className={className} onSubmit={onSubmitSearch}>
      <Box className='relative flex h-full w-full items-center rounded-full border-2 border-solid border-[var(--border-primary)] bg-white focus:border-2 focus:border-solid focus:border-blue-500'>
        <div className='search-icon flex h-full w-auto items-center justify-center border-r-2 border-solid border-[var(--border-primary)]'>
          <Controller
            control={control}
            name='searchType'
            render={({ field }) => (
              <Select
                displayEmpty
                id='searchType'
                value={search.searchType}
                label='Categories'
                {...register('searchType')}
                onChange={(event) => {
                  field.onChange(event)
                  trigger('searchType')
                  setSearch({ searchValue: '', searchType: event.target.value })
                }}
                className='w-[80px] overflow-auto text-sm md:w-[100px] md:text-base'
                sx={{
                  boxShadow: 'none',
                  '.MuiOutlinedInput-notchedOutline': { border: 0 },
                  '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                    border: 0
                  },
                  '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 0
                  }
                }}
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value={SearchType.TOUR}>{t('components.searchBar.tour')}</MenuItem>
                <MenuItem value={SearchType.GUIDE}>{t('components.searchBar.guide')}</MenuItem>
              </Select>
            )}
          />
        </div>
        <Controller
          control={control}
          name='searchValue'
          render={({ field }) => (
            <Autocomplete
              fullWidth
              freeSolo
              disableClearable
              value={search.searchValue}
              options={searchSuggestionResults || []}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option?.resultName || '')}
              componentsProps={{ popper: { style: { width: 'fit-content', minWidth: '350px' } } }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(event) => {
                    setIsTypingMode(true)
                    field.onChange(event)
                    trigger('searchValue')
                    handleSearchValueChange(event.target.value, 'type')
                  }}
                  placeholder={
                    search.searchType === SearchType.TOUR
                      ? t('components.searchBar.searchTours')
                      : t('components.searchBar.searchGuides')
                  }
                  fullWidth
                  sx={{ '& fieldset': { border: 'none' } }}
                />
              )}
              renderOption={(props, option) => {
                const handleOptionClick = () => {
                  setIsTypingMode(false)
                  setSearch({ ...search, searchValue: option.resultName })
                  setValue('searchValue', option.resultName)
                  onSubmitSearch()
                }
                return (
                  <Box component='li' {...props} onClick={handleOptionClick}>
                    {option.imageLink ? (
                      <img
                        loading='lazy'
                        style={{
                          height: 42,
                          width: 42,
                          borderRadius: '8px',
                          objectFit: 'cover',
                          marginRight: '1rem',
                          flexShrink: 0
                        }}
                        srcSet={`${option.imageLink} 2x`}
                        src={`${option.imageLink}`}
                        alt=''
                      />
                    ) : (
                      <Box
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: '8px',
                          background: 'var(--supportive-over-view)',
                          marginRight: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <FmdGoodOutlinedIcon />
                      </Box>
                    )}
                    <span className='flex-grow'>{option.resultName}</span>
                  </Box>
                )
              }}
            />
          )}
        />
        {isMdBreakpoint ? (
          <Button
            type='submit'
            className='mr-2 rounded-full font-semibold md:inline-block'
            variant='contained'
            size={'large'}
          >
            <SearchIcon />
          </Button>
        ) : (
          <IconButton type='submit' color='primary' aria-label='search' className='mr-2'>
            <SearchIcon />
          </IconButton>
        )}
      </Box>
    </form>
  )
}

export default SearchBar
