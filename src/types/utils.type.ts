export interface SuccessResponse<Data> {
  statusCode: string
  message: string
  data: Data
}

export interface SuccessResponseWithPagination<Data> {
  statusCode: string
  message: string
  data: {
    [key: string]: Data
  }
}
export interface ErrorResponse<Data> {
  statusCode: string
  message: string
  data?: Data
}
