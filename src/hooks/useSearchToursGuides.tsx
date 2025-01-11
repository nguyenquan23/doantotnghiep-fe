import { SearchSchema, searchSchema } from 'src/utils/rules'
import useQueryConfig from './useQueryConfig'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import omit from 'lodash/omit'
import PATH from 'src/constants/path.constant'
import { SearchType } from 'src/enums/search-type.enum'

type SearchFormData = Pick<SearchSchema, 'searchValue' | 'searchType'>
const searchNameSchema = searchSchema.pick(['searchValue', 'searchType'])

export default function useSearchToursGuides() {
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()
  const { control, handleSubmit, trigger, register, setValue } = useForm<SearchFormData>({
    defaultValues: {
      searchValue: '',
      searchType: undefined
    },
    resolver: yupResolver(searchNameSchema)
  })

  const onSubmitSearch = handleSubmit((data: SearchFormData) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            searchValue: data.searchValue
          },
          ['order', 'sortBy']
        )
      : {
          ...queryConfig,
          searchValue: data.searchValue
        }
    const searchPath = `../${data.searchType === SearchType.TOUR ? PATH.searchTour : PATH.searchGuide}`
    const searchQuery = createSearchParams(config).toString()
    navigate(`${searchPath}?${searchQuery}`, {
      replace: true
    })
  })

  return { onSubmitSearch, control, trigger, register, setValue }
}
