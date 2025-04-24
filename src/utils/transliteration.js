/**
 * Transliterate Russian text to Latin script
 * @param {string} text - Russian text to transliterate
 * @returns {string} - Transliterated text in Latin script
 */
export const transliterateRuToEn = (text) => {
  if (!text) return '';
  
  const transliterationMap = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 
    'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 
    'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 
    'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 
    'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch', 'Ъ': '', 
    'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
  };
  
  return Array.from(text).map(char => transliterationMap[char] || char).join('');
};

/**
 * Transliterate Latin script to Russian
 * @param {string} text - Latin text to transliterate
 * @returns {string} - Transliterated text in Russian
 */
export const transliterateEnToRu = (text) => {
  if (!text) return '';
  
  // This is a simplified version - for a real implementation, you'd need
  // more complex rules to handle multi-character sequences
  const transliterationMap = {
    'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'e': 'е', 
    'zh': 'ж', 'z': 'з', 'i': 'и', 'y': 'й', 'k': 'к', 'l': 'л', 'm': 'м', 
    'n': 'н', 'o': 'о', 'p': 'п', 'r': 'р', 's': 'с', 't': 'т', 'u': 'у', 
    'f': 'ф', 'kh': 'х', 'ts': 'ц', 'ch': 'ч', 'sh': 'ш', 'sch': 'щ',
    'y': 'ы', 'e': 'э', 'yu': 'ю', 'ya': 'я',
    'A': 'А', 'B': 'Б', 'V': 'В', 'G': 'Г', 'D': 'Д', 'E': 'Е', 
    'Zh': 'Ж', 'Z': 'З', 'I': 'И', 'Y': 'Й', 'K': 'К', 'L': 'Л', 'M': 'М', 
    'N': 'Н', 'O': 'О', 'P': 'П', 'R': 'Р', 'S': 'С', 'T': 'Т', 'U': 'У', 
    'F': 'Ф', 'Kh': 'Х', 'Ts': 'Ц', 'Ch': 'Ч', 'Sh': 'Ш', 'Sch': 'Щ',
    'Y': 'Ы', 'E': 'Э', 'Yu': 'Ю', 'Ya': 'Я'
  };
  
  // Note: This is a simplified implementation that doesn't handle multi-character
  // transliterations like 'zh', 'kh', etc. correctly. A more complex implementation
  // would be needed for production use.
  return Array.from(text).map(char => transliterationMap[char] || char).join('');
};

/**
 * Transliterate text based on source and target languages
 * @param {string} text - Text to transliterate
 * @param {string} from - Source language ('en' or 'ru')
 * @param {string} to - Target language ('en' or 'ru')
 * @returns {string} - Transliterated text
 */
export const transliterate = (text, from, to) => {
  if (from === to) return text;
  
  if (from === 'ru' && to === 'en') {
    return transliterateRuToEn(text);
  } else if (from === 'en' && to === 'ru') {
    return transliterateEnToRu(text);
  }
  
  return text;
};

/**
 * Get text in the current language
 * @param {object} translations - Translation object
 * @param {string} key - Translation key
 * @param {string} language - Current language
 * @returns {string} - Translated text
 */
export const t = (translations, key, language) => {
  if (!translations || !translations[language]) {
    return key;
  }
  
  return translations[language][key] || key;
};