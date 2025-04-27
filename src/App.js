import React, { createContext, useEffect } from 'react';
import './App.css';
import AdminLayout from './components/admin-layout';
import { ConfigProvider, theme } from 'antd';
import { useRoutes } from 'react-router-dom';
import { loginRoutes } from './routers';
import { useSelector } from 'react-redux';
import { useLocalStorageState } from 'ahooks';
import { UserInfoContextProvider } from './contexts/UserInfoContext';
import AuthContextProvider from './contexts/AuthContext';
import { RingCentralProvider } from './contexts/RingCentralContext';
import { LanguageContextProvider } from './contexts/LanguageContext';

// Color palette for light and dark themes
const lightTheme = {
  colorPrimary: '#4f46e5', // Primary purple
  colorSuccess: '#10b981', // Green
  colorWarning: '#f59e0b', // Orange
  colorError: '#ef4444',   // Red
  colorInfo: '#3b82f6',    // Blue
  borderRadius: 8,         // Rounded corners
};

const darkTheme = {
  colorPrimary: '#6366f1',  // Brighter purple for dark theme
  colorSuccess: '#10b981',
  colorWarning: '#f59e0b',
  colorError: '#ef4444',
  colorInfo: '#3b82f6',
  borderRadius: 8,
};

export const ThemeContext = createContext();

const App = () => {
  const loginRouters = useRoutes(loginRoutes);
  const [isDarkMode, setIsDarkMode] = useLocalStorageState('theme', false);
  const { isAuth } = useSelector(state => state.auth);

  useEffect(() => {
    // Update HTML background color when theme changes
    if (isDarkMode) {
      document.querySelector('html').style.backgroundColor = '#111827'; // Dark gray
    } else {
      document.querySelector('html').style.backgroundColor = '#f3f4f6'; // Light gray
    }
    
    // Add/remove dark theme class for the entire document
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className={isDarkMode ? 'dark-theme' : 'light-theme'}>
      <ConfigProvider
        theme={{
          token: isDarkMode ? {
            ...darkTheme,
            colorBgContainer: '#1f2937',
            colorBgElevated: '#1f2937',
            colorText: '#e5e7eb',
            colorTextSecondary: '#9ca3af',
          } : {
            ...lightTheme,
            colorBgContainer: '#ffffff',
            colorText: '#111827',
            colorTextSecondary: '#4b5563',
          },
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          components: {
            Button: {
              controlHeight: 40,
              fontWeight: 500,
            },
            Card: {
              boxShadow: isDarkMode 
                ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.26)' 
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
            Menu: {
              itemBorderRadius: 6,
              subMenuItemBorderRadius: 6,
            },
            Table: {
              headerBg: isDarkMode ? '#374151' : '#f9fafb',
              headerColor: isDarkMode ? '#e5e7eb' : '#111827',
              headerSplitColor: isDarkMode ? '#4b5563' : '#e5e7eb',
              rowHoverBg: isDarkMode ? '#374151' : '#f3f4f6',
            },
          },
        }}
      >
        <ThemeContext.Provider value={{ theme: isDarkMode, setTheme: setIsDarkMode }}>
          <LanguageContextProvider>
            {isAuth ? (
              <AuthContextProvider>
                <UserInfoContextProvider>
                  <RingCentralProvider>
                    <AdminLayout />
                  </RingCentralProvider>
                </UserInfoContextProvider>
              </AuthContextProvider>
            ) : (
              loginRouters
            )}
          </LanguageContextProvider>
        </ThemeContext.Provider>
      </ConfigProvider>
    </div>
  );
};

export default App;