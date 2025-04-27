// src/components/RingCentralStatus/index.js
import React, { useState } from 'react';
import { Button, Modal, Form, Input, Badge, Tooltip, Space } from 'antd';
import { PhoneOutlined, LoginOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useRingCentral } from '../../contexts/RingCentralContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../translations';
import { t } from '../../utils/transliteration';
import './ringcentral-status.css';

const RingCentralStatus = () => {
  const { language } = useLanguage();
  const { authenticated, loading, userExtension, login, logout } = useRingCentral();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleLogin = async (values) => {
    const success = await login(values.username, values.password, values.extension);
    if (success) {
      setLoginModalVisible(false);
    }
  };

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
            onClick={() => setLoginModalVisible(true)} 
            loading={loading}
            type="primary"
            size="small"
            className="ringcentral-login-button"
          >
            {t(translations, 'ringcentralConnect', language)}
          </Button>
        )}
      </Space>

      {/* Login Modal */}
      <Modal
        title={t(translations, 'ringcentralConnect', language)}
        open={loginModalVisible}
        onCancel={() => setLoginModalVisible(false)}
        footer={null}
        destroyOnClose
        maskClosable={!loading}
        closable={!loading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleLogin}
          preserve={false}
        >
          <Form.Item
            name="username"
            label={t(translations, 'ringcentralUsername', language)}
            rules={[{ 
              required: true, 
              message: t(translations, 'ringcentralUsernameRequired', language) 
            }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder={t(translations, 'ringcentralUsername', language)} 
              disabled={loading}
              autoComplete="off"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            label={t(translations, 'ringcentralPassword', language)}
            rules={[{ 
              required: true, 
              message: t(translations, 'ringcentralPasswordRequired', language) 
            }]}
          >
            <Input.Password 
              placeholder={t(translations, 'ringcentralPassword', language)} 
              disabled={loading}
              autoComplete="new-password"
            />
          </Form.Item>
          
          <Form.Item
            name="extension"
            label={t(translations, 'ringcentralExtension', language)}
          >
            <Input 
              placeholder={t(translations, 'ringcentralExtension', language)} 
              disabled={loading}
              autoComplete="off"
            />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {t(translations, 'ringcentralConnect', language)}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RingCentralStatus;