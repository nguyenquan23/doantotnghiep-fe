import { Box } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Rating from '@mui/material/Rating'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SortReview } from 'src/enums/sort-review.enum'
import { ReviewParams } from 'src/types/review.type'
import MenuButton from '../MenuButton/MenuButton'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { useTranslation } from 'react-i18next'

interface ReviewSortFilter {
  onChange: (reviewParams: ReviewParams) => void
}

const ReviewSortFilter: React.FC<ReviewSortFilter> = ({ onChange }: ReviewSortFilter) => {
  const [ratings, setRatings] = useState<number[]>([])
  const [sortBy, setSortBy] = useState<string>('')
  const { t } = useTranslation()

  const castToRatingString = useMemo(() => ratings.map((rating) => rating).join(','), [ratings])

  useEffect(() => {
    const reviewParams: ReviewParams = {
      ratings: castToRatingString,
      sortBy: sortBy
    }
    onChange(reviewParams)
  }, [castToRatingString, onChange, ratings, sortBy])

  const handleCheckboxChange = (value: number) => {
    setRatings((prevRatings) => {
      if (prevRatings.includes(value)) return prevRatings.filter((rating) => rating !== value)
      return [...prevRatings, value]
    })
  }

  const handleCheckAll = useCallback(() => {
    if (ratings.length === 5) {
      setRatings([])
      return
    }
    setRatings([1, 2, 3, 4, 5])
  }, [ratings.length])

  const handleSelectChange = useCallback((event: SelectChangeEvent<string>) => setSortBy(event.target.value), [])

  const RatingFormGroup = (
    <>
      <h3 className='reviews-summary__title'>{t('pages.tourDetails.filter')}</h3>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={ratings.length === 5} onChange={() => handleCheckAll()} />}
          label={t('pages.tourDetails.allStarRatings')}
        />
        {[5, 4, 3, 2, 1].map((value, index) => (
          <Box className='flex items-center' key={index}>
            <FormControlLabel
              control={<Checkbox checked={ratings.includes(value)} onChange={() => handleCheckboxChange(value)} />}
              label={`${value} ${t('pages.tourDetails.stars')}`}
              classes={{ label: 'sm:hidden lg:block' }}
            />
            <Rating max={5} value={value} readOnly />
          </Box>
        ))}
      </FormGroup>
    </>
  )

  return (
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} className='sort-filter-reviews'>
      <Grid item xs={2} sm={3} md={12} className='sort-by'>
        <h3 className='reviews-summary__title mb-2'>{t('pages.tourDetails.sortBy')}</h3>
        <FormControl fullWidth>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={sortBy}
            onChange={handleSelectChange}
            MenuProps={{ disableScrollLock: true }}
            style={{ height: 63, marginTop: '-6px' }}
            sx={{ color: (theme) => theme.palette.primary.main, fontWeight: 800, maxWidth: '175px' }}
          >
            <MenuItem disabled value=''>
              <em>
                <strong>{t('pages.tourDetails.sort')}</strong>
              </em>
            </MenuItem>
            {Object.keys(SortReview).map((value) => (
              <MenuItem key={value} value={value}>
                {t(`enums.sortReview.${value}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid
        item
        xs={0}
        sm={0}
        md={12}
        className='star-rating'
        sx={{
          display: { xs: 'none', md: 'block' }
        }}
      >
        {RatingFormGroup}
      </Grid>
      <Grid
        item
        xs={2}
        sm={3}
        md={0}
        className='star-rating-menu-button'
        sx={{
          display: { xs: 'block', md: 'none' }
        }}
      >
        <h3 className='reviews-summary__title mb-2'>Filter</h3>

        <MenuButton text='Star ratings' icon={<StarBorderIcon />}>
          <Box sx={{ padding: '12px' }}>{RatingFormGroup}</Box>
        </MenuButton>
      </Grid>
    </Grid>
  )
}

export default ReviewSortFilter
