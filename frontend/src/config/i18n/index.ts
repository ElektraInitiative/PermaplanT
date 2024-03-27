import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { isDev } from '../env';
import de from './de';
import en from './en';

export const defaultNS = 'common';

export const resources = {
  en,
  de,
};

i18next.use(initReactI18next).use(LanguageDetector).init({
  fallbackLng: 'en',
  debug: isDev,
  resources,
  defaultNS,
});

export default i18next;
