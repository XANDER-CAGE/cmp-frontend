// src/contexts/LanguageContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorageState } from 'ahooks';

// Create the language context
const LanguageContext = createContext();

// Create a provider component
export const LanguageContextProvider = ({ children }) => {
  const [language, setLanguage] = useLocalStorageState('language', 'en');

  // Function to toggle language between English and Russian
  const toggleLanguage = () => {
    setLanguage(prevLang => (prevLang === 'en' ? 'ru' : 'en'));
  };

  // Create the context value object
  const contextValue = {
    language,
    setLanguage,
    toggleLanguage,
    isEnglish: language === 'en',
    isRussian: language === 'ru'
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageContextProvider');
  }
  return context;
};

export default LanguageContext;