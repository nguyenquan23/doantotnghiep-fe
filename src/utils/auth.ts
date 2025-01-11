import { User } from 'src/types/user.type'

export const LocalStorageEventTarget = new EventTarget()

export const getAccessTokenFromLocalStorage = () => localStorage.getItem('access_token') || ''

export const setAccessTokenToLocalStorage = (accessToken: string) => {
  localStorage.setItem('access_token', accessToken)
}

export const getProfileFromLocalStorage = () => {
  const profile = localStorage.getItem('profile')
  return profile ? JSON.parse(profile) : null
}

export const setProfileToLocalStorage = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}

export const clearLocalStorage = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
  LocalStorageEventTarget.dispatchEvent(new Event('clearLS'))
}
