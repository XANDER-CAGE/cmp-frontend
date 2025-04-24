import React, { useState, useEffect } from "react";
import { Button, Form, Input, Spin, notification } from "antd";
import http from "../../utils/axiosInterceptors";
import { useDispatch } from "react-redux";
import { userLogin } from "../../reducers/authSlice";
import logoImg from '../../assets/images/bg-logo.png';
import { APP_SERIAL } from "../../constants";
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import './login.css';

const Login = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
          message: 'Успешная авторизация',
          description: 'Добро пожаловать в Billing!',
          placement: 'topRight',
          duration: 3
        });
      } else {
        notification.error({
          message: 'Ошибка авторизации',
          description: response?.error || 'Неверные учетные данные',
          placement: 'topRight'
        });
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.error || error?.response?.statusText || 'Ошибка сервера!';
      notification.error({
        message: 'Ошибка авторизации',
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
      
      <div className="login-card">
        <div className="login-form-container">
          <div className="login-header">
            <img src={logoImg} alt="Company Logo" className="login-logo" />
            <h1 className="login-title">Billing System</h1>
            <p className="login-subtitle">Please enter your login credentials</p>
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
                  message: "Please, enter login!",
                },
              ]}
            >
              <Input 
                prefix={<UserOutlined className="site-form-item-icon" />} 
                placeholder="Login" 
                size="large"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please, enter password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
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
                {isLoading ? <Spin size="small" /> : "Enter"}
              </Button>
            </Form.Item>
          </Form>
          
          <div className="login-footer">
            <p>&copy; {new Date().getFullYear()} Trucking Pulse.</p>
          </div>
        </div>
        
        {!isMobile && (
          <div className="login-image-container">
            {/* Здесь будет фоновое изображение, заданное в CSS */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;