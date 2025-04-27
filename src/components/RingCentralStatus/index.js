// src/components/RingCentralStatus/index.js
import React from 'react';
import { Button, Badge, Tooltip, Space } from 'antd';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRingCentral } from '../../contexts/RingCentralContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../translations';
import { t } from '../../utils/transliteration';
import './ringcentral-status.css';

const RingCentralStatus = () => {
  const { language } = useLanguage();
  const { authenticated, loading, userExtension, login, logout } = useRingCentral();

  // Get display name from user extension
  const getDisplayName = () => {
    if (!userExtension) return '';
    
    if (userExtension.contact && userExtension.contact.firstName) {
      return `${userExtension.contact.firstName} ${userExtension.contact.lastName || ''}`.trim();
    }
    
    return userExtension.name || userExtension.extensionNumber || '';
  };

  return (
    <div className="ringcentral-status">
      <Space size="small">
        <Tooltip title={authenticated 
          ? `${t(translations, 'ringcentralConnected', language)}${getDisplayName() ? `: ${getDisplayName()}` : ''}`
          : t(translations, 'ringcentralConnect', language)
        }>
          <Badge 
            status={authenticated ? "success" : "error"} 
            text={authenticated 
              ? t(translations, 'ringcentralConnected', language)
              : t(translations, 'ringcentralDisconnected', language)
            } 
            className="ringcentral-badge"
          />
        </Tooltip>
        
        {authenticated ? (
          <Button 
            icon={<LogoutOutlined />} 
            onClick={logout} 
            loading={loading}
            danger
            size="small"
            className="ringcentral-logout-button"
          >
            {t(translations, 'ringcentralDisconnect', language)}
          </Button>
        ) : (
          <Button 
            icon={<LoginOutlined />} 
            onClick={login} 
            loading={loading}
            type="primary"
            size="small"
            className="ringcentral-login-button"
          >
            {t(translations, 'ringcentralConnect', language)}
          </Button>
        )}
      </Space>
    </div>
  );
};

export default RingCentralStatus;