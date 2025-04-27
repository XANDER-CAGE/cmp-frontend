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
  const { authenticated, loading, login, logout, call } = useRingCentral();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [callLoading, setCallLoading] = useState(false);
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

    setCallLoading(true);
    try {
      await call(phoneNum);
    } finally {
      setCallLoading(false);
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
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleLogin}
          preserveValues={false}
        >
          <Form.Item
            name="username"
            label={t(translations, 'ringcentralUsername', language)}
            rules={[{ 
              required: true, 
              message: t(translations, 'ringcentralUsernameRequired', language) 
            }]}
          >
            <Input placeholder={t(translations, 'ringcentralUsername', language)} />
          </Form.Item>
          
          <Form.Item
            name="password"
            label={t(translations, 'ringcentralPassword', language)}
            rules={[{ 
              required: true, 
              message: t(translations, 'ringcentralPasswordRequired', language) 
            }]}
          >
            <Input.Password placeholder={t(translations, 'ringcentralPassword', language)} />
          </Form.Item>
          
          <Form.Item
            name="extension"
            label={t(translations, 'ringcentralExtension', language)}
          >
            <Input placeholder={t(translations, 'ringcentralExtension', language)} />
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
      >
        <Form
          layout="vertical"
          onFinish={handleCallFormSubmit}
          initialValues={{ phoneNumber: phoneNumber || '' }}
        >
          <Form.Item
            name="phoneNumber"
            label={t(translations, 'ringcentralEnterNumber', language)}
            rules={[{ 
              required: true, 
              message: t(translations, 'ringcentralPhoneNumberRequired', language) 
            }]}
          >
            <Input placeholder={t(translations, 'ringcentralEnterNumber', language)} />
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