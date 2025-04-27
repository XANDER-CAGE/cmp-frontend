// src/components/PhoneButton/index.js
import React, { useState } from 'react';
import { Button, Modal, Form, Input, Space, Tooltip, Badge } from 'antd';
import { PhoneOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { MdCopyAll } from 'react-icons/md';
import { useRingCentral } from '../../contexts/RingCentralContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../translations';
import { t } from '../../utils/transliteration';
import { toast } from 'react-toastify';
import './phone-button.css';

const PhoneButton = ({ phoneNumber, size = 'small', containerClassName = '' }) => {
  const { language } = useLanguage();
  const { authenticated, loading, callLoading, login, logout, call } = useRingCentral();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleCall = async (phoneNum = phoneNumber) => {
    if (!authenticated) {
      setLoginModalVisible(true);
      return;
    }

    if (!phoneNum) {
      setCallModalVisible(true);
      return;
    }

    try {
      await call(phoneNum);
    } catch (error) {
      console.error('Call error:', error);
    }
  };

  const handleCopyNumber = () => {
    if (phoneNumber) {
      navigator.clipboard.writeText(phoneNumber);
      toast.success(t(translations, 'ringcentralNumberCopied', language));
    }
  };

  const handleLogin = async (values) => {
    const success = await login(values.username, values.password, values.extension);
    if (success) {
      setLoginModalVisible(false);
      
      // If we were trying to call a number, do it now
      if (phoneNumber) {
        await handleCall(phoneNumber);
      } else {
        setCallModalVisible(true);
      }
    }
  };

  // Call form submit
  const handleCallFormSubmit = async (values) => {
    await handleCall(values.phoneNumber);
    setCallModalVisible(false);
  };

  // Format phone number for display
  const formatPhoneNumber = (number) => {
    if (!number) return '';
    
    // Simple formatting for display
    const cleaned = number.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    
    return number; // Return original if no formatting applied
  };

  return (
    <div className={`phone-button-container ${containerClassName}`}>
      <Space size="small">
        <Tooltip title={t(translations, 'ringcentralCall', language)}>
          <Badge dot={authenticated} color="green">
            <Button
              type="primary"
              size={size}
              icon={<PhoneOutlined />}
              onClick={() => handleCall()}
              loading={callLoading}
              className="phone-call-button"
            />
          </Badge>
        </Tooltip>
        
        {phoneNumber && (
          <Tooltip title={t(translations, 'ringcentralCopyNumber', language)}>
            <Button
              size={size}
              icon={<MdCopyAll />}
              onClick={handleCopyNumber}
              className="phone-copy-button"
            />
          </Tooltip>
        )}
        
        {authenticated ? (
          <Tooltip title={t(translations, 'ringcentralDisconnect', language)}>
            <Button
              size={size}
              danger
              icon={<LogoutOutlined />}
              onClick={logout}
              loading={loading}
              className="phone-logout-button"
            />
          </Tooltip>
        ) : (
          <Tooltip title={t(translations, 'ringcentralLogin', language)}>
            <Button
              size={size}
              icon={<LoginOutlined />}
              onClick={() => setLoginModalVisible(true)}
              loading={loading}
              className="phone-login-button"
            />
          </Tooltip>
        )}
      </Space>

      {/* Login Modal */}
      <Modal
        title={t(translations, 'ringcentralLogin', language)}
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
              {t(translations, 'ringcentralLogin', language)}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Call Modal */}
      <Modal
        title={t(translations, 'ringcentralMakeCall', language)}
        open={callModalVisible}
        onCancel={() => setCallModalVisible(false)}
        footer={null}
        destroyOnClose
        maskClosable={!callLoading}
        closable={!callLoading}
      >
        <Form
          layout="vertical"
          onFinish={handleCallFormSubmit}
          initialValues={{ phoneNumber: phoneNumber ? formatPhoneNumber(phoneNumber) : '' }}
        >
          <Form.Item
            name="phoneNumber"
            label={t(translations, 'ringcentralEnterNumber', language)}
            rules={[{ 
              required: true, 
              message: t(translations, 'ringcentralPhoneNumberRequired', language) 
            }]}
          >
            <Input 
              placeholder={t(translations, 'ringcentralEnterNumber', language)} 
              disabled={callLoading}
              autoComplete="off"
            />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={callLoading} block>
              {t(translations, 'ringcentralCall', language)}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PhoneButton;