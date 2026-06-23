import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import am from './locales/am.json'

const savedLang = localStorage.getItem('i18n_user_choice')

i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, am: { translation: am } },
    lng: savedLang || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export function changeLanguageWithPersistence(lng) {
  i18n.changeLanguage(lng)
  localStorage.setItem('i18n_user_choice', lng)
}

export default i18n
