import React, { createContext, useContext, useEffect, useState } from 'react';
import http from '../utils/axiosInterceptors';
import Cookies from 'js-cookie';

export const UserInfoContext = createContext();

export const UserInfoContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [permissions, setPermissions] = useState([]);

  const getAllUniquePermissions = (roles) => {
    if (!roles) return [];

    return roles?.reduce((acc, role) => {
      role.permissions.forEach(permission => {
        if (!acc.includes(permission.name)) {
          acc.push(permission.name);
        }
      });
      return acc;
    }, []);
  };

  const getCurrentUserInfo = async () => {
    try {
      const response = await http.get('Users/me');

      if (response?.success === true) {
        setUserInfo(response?.data);

        const permissions = getAllUniquePermissions(response?.data?.roles);

        setPermissions(permissions)
      }
    } catch (error) {
      console.log(error);
      setPermissions([]);
      setUserInfo(null);
    } finally {
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    const token = Cookies.get('access_token');

    if (token)
      getCurrentUserInfo();
  }

  return (<UserInfoContext.Provider value={{ userInfo, setUserInfo, permissions }}>
    {children}
  </UserInfoContext.Provider>);
};

export const useUserInfo = () => useContext(UserInfoContext);
