// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importowanie tłumaczeń
import enTranslation from './translations/en.json';
import plTranslation from './translations/pl.json';

i18n
  .use(initReactI18next) // Podłączamy i18next do Reacta
  .init({
    resources: {
      en: {
        translation: enTranslation, // Tłumaczenia po angielsku
      },
      pl: {
        translation: plTranslation, // Tłumaczenia po polsku
      },
    },
    lng: 'pl', // Ustawienie domyślnego języka
    fallbackLng: 'en', // Jeśli tłumaczenie nie jest dostępne, używaj angielskiego
    interpolation: {
      escapeValue: false, // Nie musisz uciekać wartości, React się tym zajmie
    },
  });

export default i18n;
