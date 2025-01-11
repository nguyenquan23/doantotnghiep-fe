import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translationEN from './locales/en/translation.json'
import translationVI from './locales/vi/translation.json'

i18n
  .use(initReactI18next)
  .init({
    debug: true,
    resources: {
      en: {
        translation: translationEN
      },
      vi: {
        translation: translationVI
      }
    },
    fallbackLng: localStorage.getItem('language') || 'en'
  })
  .then(() => {
    localStorage.setItem('language', i18n.language)
  })

export default i18n
