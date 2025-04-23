import React, { createContext, useEffect } from 'react'
import './App.css'
import AdminLayout from './components/admin-layout'
import { ConfigProvider } from 'antd'
import { useRoutes } from 'react-router-dom'
import { loginRoutes } from './routers'
import { useSelector } from 'react-redux'
import { useLocalStorageState } from 'ahooks'
import { UserInfoContextProvider } from './contexts/UserInfoContext';
import AuthContextProvider from './contexts/AuthContext';

export const ThemeContext = createContext()

const App = () => {
  const loginRouters = useRoutes(loginRoutes)
  const [theme, setTheme] = useLocalStorageState('theme', false)

  const { isAuth } = useSelector(state => state.auth)

  useEffect(() => {
    if (theme) {
      document.querySelector('html').style.backgroundColor = '#1d2736'
    } else {
      document.querySelector('html').style.backgroundColor = '#edeef1'
    }
  }, [theme])

  return (
    <div className={theme ? 'dark-theme' : 'light-theme'}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: theme ? '#1d2736' : '#5711a4',
            algorithm: true
          },
        }}
      >
        <ThemeContext.Provider value={{ theme, setTheme }}>
          {
            isAuth ?
              <AuthContextProvider>
                <UserInfoContextProvider>
                  <AdminLayout />
                </UserInfoContextProvider>
              </AuthContextProvider>
              : loginRouters
          }
        </ThemeContext.Provider>
      </ConfigProvider>
    </div>
  )
}

export default App