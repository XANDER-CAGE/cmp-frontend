// src/components/language-switcher/index.js
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../translations';
import { t } from '../../utils/transliteration';
import './language-switcher.css';

// Icons
import { MdLanguage } from 'react-icons/md';

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <div className="language-switcher">
      <div 
        className="language-toggle" 
        onClick={toggleLanguage}
        title={language === 'en' ? translations.ru.language : translations.en.language}
      >
        <MdLanguage size={20} />
        <span className="language-code">
          {language === 'en' ? 'EN' : 'RU'}
        </span>
      </div>
      <span className="language-name">
        {language === 'en' ? 
          t(translations, 'english', language) : 
          t(translations, 'russian', language)
        }
      </span>
    </div>
  );
};

export default LanguageSwitcher;