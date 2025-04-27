// src/contexts/RingCentralContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { sdk, isAuthenticated, makeCall } from '../utils/ringcentralService';
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
  
  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists in cookies
        const token = Cookies.get('rc_access_token');
        if (token) {
          // Try to refresh the token if it exists
          try {
            await sdk.platform().auth().refresh();
            setAuthenticated(true);
            // Fetch user extension info
            await getUserInfo();
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            clearTokens();
          }
        } else {
          // Check if we're already authenticated
          const authStatus = isAuthenticated();
          setAuthenticated(authStatus);
          if (authStatus) {
            await getUserInfo();
          }
        }
      } catch (error) {
        console.error('RingCentral auth check error:', error);
        clearTokens();
      }
    };
    
    checkAuth();
    
    // Set up a timer to check auth status periodically
    const interval = setInterval(checkAuth, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => clearInterval(interval);
  }, []);
  
  // Clear tokens helper
  const clearTokens = () => {
    Cookies.remove('rc_access_token');
    Cookies.remove('rc_refresh_token');
    setAuthenticated(false);
    setUserExtension(null);
  };
  
  // Get user extension info
  const getUserInfo = async () => {
    try {
      const extensionInfo = await sdk.platform().get('/restapi/v1.0/account/~/extension/~');
      const extensionData = await extensionInfo.json();
      setUserExtension(extensionData);
      return extensionData;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };
  
  // Login function
  const login = async (username, password, extension = '') => {
    setLoading(true);
    try {
      // Clear any existing tokens
      try {
        await sdk.platform().auth().cancelAccessToken();
      } catch (e) {
        // Ignore error if no token exists
      }
      
      // Login with credentials
      await sdk.platform().login({
        username,
        password,
        extension
      });
      
      // Store tokens in cookies for persistence
      const data = sdk.platform().auth().data();
      Cookies.set('rc_access_token', data.access_token, { 
        expires: new Date(Date.now() + data.expires_in * 1000),
        secure: window.location.protocol === 'https:'
      });
      
      if (data.refresh_token) {
        Cookies.set('rc_refresh_token', data.refresh_token, { 
          expires: 30, // 30 days
          secure: window.location.protocol === 'https:'
        });
      }
      
      setAuthenticated(true);
      
      // Get user info
      await getUserInfo();
      
      toast.success(t(translations, 'ringcentralLoginSuccess', language));
      return true;
    } catch (error) {
      console.error('RingCentral login error:', error);
      const errorMessage = error.message || t(translations, 'ringcentralLoginError', language);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await sdk.platform().logout();
      clearTokens();
      toast.success(t(translations, 'ringcentralLogoutSuccess', language));
    } catch (error) {
      console.error('RingCentral logout error:', error);
      // Still clear local state even if server logout fails
      clearTokens();
    } finally {
      setLoading(false);
    }
  };
  
  // Make a call
  const call = async (phoneNumber) => {
    setCallLoading(true);
    try {
      if (!authenticated) {
        toast.error(t(translations, 'ringcentralNotLoggedIn', language));
        return false;
      }
      
      // Format phone number if needed (remove spaces, dashes, etc.)
      const formattedNumber = phoneNumber.replace(/\D/g, '');
      
      // Validate the phone number (simple validation)
      if (formattedNumber.length < 7) {
        toast.error(t(translations, 'ringcentralInvalidNumber', language));
        return false;
      }
      
      // If we don't have user extension info, fetch it
      if (!userExtension) {
        await getUserInfo();
      }
      
      const callResult = await makeCall(formattedNumber);
      toast.success(t(translations, 'ringcentralCallInitiated', language));
      return callResult;
    } catch (error) {
      console.error('RingCentral call error:', error);
      const errorMessage = error.message || t(translations, 'ringcentralCallError', language);
      toast.error(errorMessage);
      return false;
    } finally {
      setCallLoading(false);
    }
  };
  
  // The context value
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