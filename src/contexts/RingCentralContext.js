// src/contexts/RingCentralContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorageState } from 'ahooks';
import { initRingCentral, isAuthenticated, login, logout, makeCall } from '../utils/ringcentralService';
import { toast } from 'react-toastify';
import { useLanguage } from './LanguageContext';
import { translations } from '../translations';
import { t } from '../utils/transliteration';

// Create the RingCentral context
const RingCentralContext = createContext();

// Custom hook for using the RingCentral context
export const useRingCentral = () => {
  const context = useContext(RingCentralContext);
  if (!context) {
    throw new Error('useRingCentral must be used within a RingCentralProvider');
  }
  return context;
};

// Create a provider component
export const RingCentralProvider = ({ children }) => {
  const { language } = useLanguage();
  const [authenticated, setAuthenticated] = useLocalStorageState('ringcentral-auth', { 
    defaultValue: false 
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Initialize RingCentral SDK
    initRingCentral();
    
    // Check auth status on mount
    const checkAuthStatus = async () => {
      const status = await isAuthenticated();
      setAuthenticated(status);
    };
    
    checkAuthStatus();
  }, [setAuthenticated]);
  
  // Login function
  const handleLogin = async (username, password, extension = '') => {
    setLoading(true);
    try {
      const success = await login(username, password, extension);
      if (success) {
        setAuthenticated(true);
        toast.success(t(translations, 'ringcentralLoginSuccess', language));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(`Login failed: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setAuthenticated(false);
      toast.success(t(translations, 'ringcentralLogoutSuccess', language));
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(`Logout failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Call function
  const handleCall = async (phoneNumber) => {
    if (!authenticated) {
      toast.error(t(translations, 'ringcentralNotAuthenticated', language));
      return false;
    }
    
    return await makeCall(phoneNumber);
  };
  
  const value = {
    authenticated,
    loading,
    login: handleLogin,
    logout: handleLogout,
    call: handleCall
  };
  
  return (
    <RingCentralContext.Provider value={value}>
      {children}
    </RingCentralContext.Provider>
  );
};

export default RingCentralContext;