'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import en from '../i18n/en.json';
import ru from '../i18n/ru.json';
import uz from '../i18n/uz.json';

type Language = 'en' | 'ru' | 'uz';
type LanguageContextType = {
  lang: Language;
  t: typeof en;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  t: en,
  setLanguage: () => {}
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('en');
  const translations = { en, ru, uz };
  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], setLanguage: setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
