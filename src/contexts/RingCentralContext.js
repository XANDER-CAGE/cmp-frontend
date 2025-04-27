// src/contexts/RingCentralContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  sdk, 
  isAuthenticated, 
  makeCall, 
  getLoginUrl, 
  restoreAuthFromCookies 
} from '../utils/ringcentralService';
import { toast } from 'react-toastify';
import { useLanguage } from './LanguageContext';
import { translations } from '../translations';
import { t } from '../utils/transliteration';
import Cookies from 'js-cookie';

const RingCentralContext = createContext();

export const useRingCentral = () => useContext(RingCentralContext);

export const RingCentralProvider = ({ children }) => {
  const { language } = useLanguage();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [callLoading, setCallLoading] = useState(false);
  const [userExtension, setUserExtension] = useState(null);
  
  // Проверка статуса аутентификации при монтировании
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Проверяем токены и статус аутентификации
        const authStatus = isAuthenticated();
        
        if (!authStatus) {
          // Пытаемся восстановить аутентификацию из cookies
          const restored = await restoreAuthFromCookies();
          setAuthenticated(restored);
          
          if (restored) {
            await getUserInfo();
          }
        } else {
          setAuthenticated(true);
          await getUserInfo();
        }
      } catch (error) {
        console.error('Ошибка проверки аутентификации RingCentral:', error);
        clearTokens();
      }
    };
    
    checkAuth();
    
    // Настраиваем таймер для проверки статуса аутентификации
    const interval = setInterval(checkAuth, 5 * 60 * 1000); // Проверка каждые 5 минут
    
    return () => clearInterval(interval);
  }, []);
  
  // Очистка токенов
  const clearTokens = () => {
    Cookies.remove('rc_access_token');
    Cookies.remove('rc_refresh_token');
    setAuthenticated(false);
    setUserExtension(null);
  };
  
  // Получение информации о пользователе
  const getUserInfo = async () => {
    try {
      const extensionInfo = await sdk.platform().get('/restapi/v1.0/account/~/extension/~');
      const extensionData = await extensionInfo.json();
      setUserExtension(extensionData);
      return extensionData;
    } catch (error) {
      console.error('Ошибка получения информации о пользователе:', error);
      return null;
    }
  };
  
  // Функция входа через PKCE-авторизацию (браузерный поток)
  const login = () => {
    setLoading(true);
    try {
      // Сохраняем текущий URL для возврата после авторизации
      const currentPath = window.location.pathname;
      
      // Получаем URL для входа с PKCE
      const loginUrl = getLoginUrl(currentPath);
      
      // Перенаправляем пользователя на страницу авторизации RingCentral
      window.location.href = loginUrl;
      
      return true;
    } catch (error) {
      console.error('Ошибка входа в RingCentral:', error);
      setLoading(false);
      const errorMessage = error.message || t(translations, 'ringcentralLoginError', language);
      toast.error(errorMessage);
      return false;
    }
  };
  
  // Функция выхода
  const logout = async () => {
    setLoading(true);
    try {
      await sdk.platform().logout();
      clearTokens();
      toast.success(t(translations, 'ringcentralLogoutSuccess', language));
    } catch (error) {
      console.error('Ошибка выхода из RingCentral:', error);
      // Очищаем локальное состояние даже если выход на сервере не удался
      clearTokens();
    } finally {
      setLoading(false);
    }
  };
  
  // Совершение вызова
  const call = async (phoneNumber) => {
    setCallLoading(true);
    try {
      if (!authenticated) {
        toast.error(t(translations, 'ringcentralNotLoggedIn', language));
        login(); // Перенаправляем на страницу входа
        return false;
      }
      
      // Форматируем номер телефона (удаляем пробелы, тире и т.д.)
      const formattedNumber = phoneNumber.replace(/\D/g, '');
      
      // Проверяем номер телефона (простая валидация)
      if (formattedNumber.length < 7) {
        toast.error(t(translations, 'ringcentralInvalidNumber', language));
        return false;
      }
      
      // Если у нас нет информации о пользователе, получаем ее
      if (!userExtension) {
        await getUserInfo();
      }
      
      const callResult = await makeCall(formattedNumber);
      toast.success(t(translations, 'ringcentralCallInitiated', language));
      return callResult;
    } catch (error) {
      console.error('Ошибка вызова RingCentral:', error);
      const errorMessage = error.message || t(translations, 'ringcentralCallError', language);
      toast.error(errorMessage);
      return false;
    } finally {
      setCallLoading(false);
    }
  };
  
  // Значение контекста
  const value = {
    authenticated,
    loading,
    callLoading,
    userExtension,
    login,
    logout,
    call
  };
  
  return (
    <RingCentralContext.Provider value={value}>
      {children}
    </RingCentralContext.Provider>
  );
};

export default RingCentralProvider;