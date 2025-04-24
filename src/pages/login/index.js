import React, { useState, useEffect } from "react";
import { Button, Form, Input, Spin, notification } from "antd";
import http from "../../utils/axiosInterceptors";
import { useDispatch } from "react-redux";
import { userLogin } from "../../reducers/authSlice";
import logoImg from '../../assets/images/bg-logo.png';
import { APP_SERIAL } from "../../constants";
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import './login.css';
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../translations";
import { t } from "../../utils/transliteration";
import LanguageSwitcher from "../../components/language-switcher";

const Login = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { language } = useLanguage();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const response = await http.post("Auth/login", { ...values }, {
        headers: {
          'X-APP-SERIAL': APP_SERIAL
        }
      });
      
      if (response?.success) {
        dispatch(userLogin(response?.data));
        notification.success({
          message: language === 'en' ? 'Successful login' : 'Успешная авторизация',
          description: language === 'en' ? 'Welcome to Billing!' : 'Добро пожаловать в Billing!',
          placement: 'topRight',
          duration: 3
        });
      } else {
        notification.error({
          message: language === 'en' ? 'Authentication error' : 'Ошибка авторизации',
          description: response?.error || (language === 'en' ? 'Invalid credentials' : 'Неверные учетные данные'),
          placement: 'topRight'
        });
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.error || error?.response?.statusText || 
                          (language === 'en' ? 'Server error!' : 'Ошибка сервера!');
      notification.error({
        message: language === 'en' ? 'Authentication error' : 'Ошибка авторизации',
        description: errorMessage,
        placement: 'topRight'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-overlay"></div>
      
      <div className="language-switcher-login">
        <LanguageSwitcher />
      </div>
      
      <div className="login-card">
        <div className="login-form-container">
          <div className="login-header">
            <img src={logoImg} alt="Company Logo" className="login-logo" />
            <h1 className="login-title">
              {t(translations, 'billingSystem', language)}
            </h1>
            <p className="login-subtitle">
              {t(translations, 'loginInstructions', language)}
            </p>
          </div>
          
          <Form
            form={form}
            name="login"
            className="login-form"
            onFinish={onFinish}
            layout="vertical"
            size={isMobile ? "large" : "default"}
          >
            <Form.Item
              name="login"
              rules={[
                {
                  required: true,
                  message: t(translations, 'enterLoginError', language),
                },
              ]}
            >
              <Input 
                prefix={<UserOutlined className="site-form-item-icon" />} 
                placeholder={t(translations, 'loginPlaceholder', language)} 
                size="large"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: t(translations, 'enterPasswordError', language),
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder={t(translations, 'passwordPlaceholder', language)}
                size="large"
                autoComplete="current-password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item className="form-button-container">
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={isLoading}
                disabled={isLoading}
                block
                size="large"
              >
                {isLoading ? <Spin size="small" /> : t(translations, 'enterButton', language)}
              </Button>
            </Form.Item>
          </Form>
          
          <div className="login-footer">
            <p>&copy; {new Date().getFullYear()} Trucking Pulse.</p>
          </div>
        </div>
        
        {!isMobile && (
          <div className="login-image-container">
            {/* Background image set in CSS */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;