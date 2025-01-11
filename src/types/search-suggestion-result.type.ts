export type SearchResult = {
  id?: number
  resultName: string
  imageLink?: string
}

export type SearchSuggestionResult = {
  addresses: string[]
  toursOrGuiders: SearchResult[]
}
