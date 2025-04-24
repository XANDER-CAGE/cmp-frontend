import React, { useContext } from 'react';
import { Spin, Typography } from 'antd';
import "./home-loading.css";
import { ThemeContext } from '../../App';

const { Title } = Typography;

const HomeLoading = () => {
  const { theme: isDarkMode } = useContext(ThemeContext);

  return (
    <div className={`home-loading ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="loading-container">
        <div className="logo-container">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" 
              className="logo-outer" 
            />
            <path 
              d="M12 8L16 10.5V15.5L12 18L8 15.5V10.5L12 8Z" 
              className="logo-inner" 
            />
          </svg>
          <div className="loading-spinner">
            <Spin size="large" />
          </div>
        </div>
        <Title level={3} className="loading-title">Loading your dashboard...</Title>
        <div className="loading-progress">
          <div className="progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default HomeLoading;