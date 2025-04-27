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
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleCall = async (phoneNum = phoneNumber) => {
    if (!authenticated) {
      // Если не авторизован, запускаем процесс авторизации
      login();
      return;
    }

    if (!phoneNum) {
      setCallModalVisible(true);
      return;
    }

    try {
      await call(phoneNum);
    } catch (error) {
      console.error('Ошибка вызова:', error);
    }
  };

  const handleCopyNumber = () => {
    if (phoneNumber) {
      navigator.clipboard.writeText(phoneNumber);
      toast.success(t(translations, 'ringcentralNumberCopied', language));
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
        
        {authenticated && (
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
        )}
        
        {!authenticated && (
          <Tooltip title={t(translations, 'ringcentralLogin', language)}>
            <Button
              size={size}
              icon={<LoginOutlined />}
              onClick={login}
              loading={loading}
              className="phone-login-button"
            />
          </Tooltip>
        )}
      </Space>

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