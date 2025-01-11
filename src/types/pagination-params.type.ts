export type PaginationParams = {
  page?: number
  limit?: number
}

export type PaginationParamWithCoordinates = PaginationParams & {
  latitude: number
  longitude: number
}
