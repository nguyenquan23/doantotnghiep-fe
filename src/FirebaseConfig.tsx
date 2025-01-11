import { initializeApp } from 'firebase/app'
import { getToken, getMessaging, isSupported } from 'firebase/messaging'
import { toast } from 'react-toastify'

const vapidKey = 'BAtVZmEdbuU6dmi35svw5h9CbKHeYA5AzOVk2S7RoCeAbOwJ19bWLu3xZ822RGKJF-Bu4yhUYeAXHWRjsXclzsg'

const firebaseConfig = {
  apiKey: 'AIzaSyBpkJX4CMukErgJ-t4HHkP2L0pdrfloUpY',
  authDomain: 'local-guide-4a72b.firebaseapp.com',
  projectId: 'local-guide-4a72b',
  storageBucket: 'local-guide-4a72b.appspot.com',
  messagingSenderId: '828099826535',
  appId: '1:828099826535:web:3642db793502c8e16715c2'
}

export const firebaseApp = initializeApp(firebaseConfig)

export const messaging = (async () => {
  try {
    const isSupportedBrowser = await isSupported()

    if (isSupportedBrowser) return getMessaging(firebaseApp)

    toast.error('Firebase is not supported in this browser')
    return null
  } catch (err) {
    toast.error('Error: ' + err)
    return null
  }
})()

export const getOrRegisterServiceWorker = () => {
  if ('serviceWorker' in navigator && typeof window.navigator.serviceWorker !== 'undefined') {
    return window.navigator.serviceWorker.getRegistration('/firebase-push-notification-scope').then((serviceWorker) => {
      if (serviceWorker) return serviceWorker
      return window.navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/firebase-push-notification-scope'
      })
    })
  }
  throw new Error('The browser doesn`t support service worker.')
}

export const getFirebaseToken = async () => {
  try {
    const messagingResolve = await messaging
    if (messagingResolve) {
      return getOrRegisterServiceWorker().then((serviceWorkerRegistration) => {
        return Promise.resolve(
          getToken(messagingResolve, {
            vapidKey: vapidKey,
            serviceWorkerRegistration
          })
        )
      })
    }
  } catch (error) {
    toast.error('An error occurred while retrieving token. ' + error)
  }
}
