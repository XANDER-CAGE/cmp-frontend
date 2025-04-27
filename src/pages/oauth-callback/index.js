// src/pages/oauth-callback/index.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Spin, Result, Typography, Button } from 'antd';
import { handleAuthRedirect } from '../../utils/ringcentralService';
import Cookies from 'js-cookie';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../translations';
import { t } from '../../utils/transliteration';

const { Title, Text } = Typography;

const OAuthCallback = () => {
  const { language } = useLanguage();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const processAuthCode = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        if (error) {
          throw new Error(errorDescription || error);
        }
        
        // Handle the authorization code
        const authData = await handleAuthRedirect();
        
        // Store tokens in cookies
        if (authData.access_token) {
          Cookies.set('rc_access_token', authData.access_token, {
            expires: new Date(Date.now() + authData.expires_in * 1000),
            secure: window.location.protocol === 'https:'
          });
        }
        
        if (authData.refresh_token) {
          Cookies.set('rc_refresh_token', authData.refresh_token, {
            expires: 30, // 30 days
            secure: window.location.protocol === 'https:'
          });
        }
        
        setStatus('success');
        
        // Redirect back after successful login
        setTimeout(() => {
          const returnTo = urlParams.get('state') || '/';
          navigate(returnTo);
        }, 2000);
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Authentication failed');
      }
    };
    
    processAuthCode();
  }, [navigate]);
  
  const handleRetry = () => {
    navigate('/');
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f8fafc'
    }}>
      <Card 
        style={{ 
          width: '90%',
          maxWidth: 500,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px'
        }}
      >
        {status === 'loading' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
            <Title level={4} style={{ marginTop: 24 }}>
              {t(translations, 'ringcentralAuthenticating', language) || 'Authenticating with RingCentral...'}
            </Title>
            <Text type="secondary">
              {t(translations, 'ringcentralPleaseWait', language) || 'Please wait, this won\'t take long.'}
            </Text>
          </div>
        )}
        
        {status === 'success' && (
          <Result
            status="success"
            title={t(translations, 'ringcentralAuthSuccess', language) || 'Authentication Successful'}
            subTitle={t(translations, 'ringcentralRedirecting', language) || 'Redirecting you back...'}
          />
        )}
        
        {status === 'error' && (
          <Result
            status="error"
            title={t(translations, 'ringcentralAuthFailed', language) || 'Authentication Failed'}
            subTitle={errorMessage}
            extra={[
              <Button 
                key="retry" 
                type="primary"
                onClick={handleRetry}
              >
                {t(translations, 'goBack', language) || 'Go Back'}
              </Button>
            ]}
          />
        )}
      </Card>
    </div>
  );
};

export default OAuthCallback;