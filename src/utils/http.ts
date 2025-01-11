import axios, { AxiosError, type AxiosInstance } from 'axios'
import { URL_LOGIN, URL_LOGOUT, URL_REGISTER } from 'src/apis/auth.api'
import config from 'src/constants/config.constant'
import { AuthSuccessResponse } from 'src/types/auth.type'
import {
  clearLocalStorage,
  getAccessTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setProfileToLocalStorage
} from './auth'

export class Http {
  instance: AxiosInstance
  private accessToken: string

  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage()
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 60 * 1000 * 15,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = `Bearer ${this.accessToken}`
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === URL_LOGIN || url === URL_REGISTER) {
          this.accessToken = (response.data as AuthSuccessResponse).data.accessToken
          setAccessTokenToLocalStorage(this.accessToken)
          setProfileToLocalStorage((response.data as AuthSuccessResponse).data.user)
        } else if (url === URL_LOGOUT) {
          this.accessToken = ''
          clearLocalStorage()
        }
        return response
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
