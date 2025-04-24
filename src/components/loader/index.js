import React, { useContext } from 'react';
import { Spin, Space, Typography } from 'antd';
import { ThemeContext } from '../../App';
import { LoadingOutlined } from '@ant-design/icons';
import './loader.css';

const { Text } = Typography;

const Loader = ({ text, size = 'default', textColor }) => {
  const { theme: isDarkMode } = useContext(ThemeContext);
  
  // Calculate spinner size based on prop
  const getSpinnerSize = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 40;
      default:
        return 32;
    }
  };
  
  // Custom loading icon with appropriate color for theme
  const loadingIcon = (
    <LoadingOutlined
      style={{ 
        fontSize: getSpinnerSize(),
        color: isDarkMode ? '#6366f1' : '#4f46e5' 
      }}
      spin
    />
  );
  
  // Determine text color based on theme and prop
  const determineTextColor = () => {
    if (textColor) return textColor;
    return isDarkMode ? '#e5e7eb' : '#374151';
  };

  return (
    <div className={`modern-loader ${isDarkMode ? 'dark' : 'light'}`}>
      <Space direction="vertical" align="center">
        <Spin indicator={loadingIcon} />
        {text && (
          <Text
            className="loader-text"
            style={{ color: determineTextColor() }}
          >
            {text}
          </Text>
        )}
        <div className="loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </Space>
    </div>
  );
};

export default Loader;