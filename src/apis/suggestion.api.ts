import { SearchSuggestionResult } from 'src/types/search-suggestion-result.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'
import { SearchSchema } from 'src/utils/rules'

const URL_SEARCH_SUGGESTION = 'search-suggestion'
type SearchFormData = SearchSchema

const suggestionApi = {
  getSearchSuggestions(params: SearchFormData) {
    return http.get<SuccessResponse<SearchSuggestionResult>>(URL_SEARCH_SUGGESTION, { params })
  }
}

export default suggestionApi
