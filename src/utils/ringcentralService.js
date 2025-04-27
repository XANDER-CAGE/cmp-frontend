// src/utils/ringcentralService.js
import SDK from '@ringcentral/sdk';
import Cookies from 'js-cookie';

// Конфигурация
const ringcentralConfig = {
    server: 'https://platform.ringcentral.com',
    clientId: '7qqd7KHvEcIdmAVmrkQoys', // Ваш Client ID
    redirectUri: `${window.location.origin}/oauth-callback`,
    appName: 'CityFuel Management',
    appVersion: '1.0.0'
};

// Создаем экземпляр SDK
export const sdk = new SDK({
    server: ringcentralConfig.server,
    clientId: ringcentralConfig.clientId,
    redirectUri: ringcentralConfig.redirectUri,
    appName: ringcentralConfig.appName,
    appVersion: ringcentralConfig.appVersion
});

// Платформенный экземпляр
const platform = sdk.platform();

// Проверка статуса аутентификации
export const isAuthenticated = () => {
    try {
        return platform.auth().accessTokenValid();
    } catch (e) {
        console.error('Ошибка проверки статуса аутентификации:', e);
        return false;
    }
};

// Получить URL для авторизации с PKCE
export const getLoginUrl = (state = '') => {
    return platform.loginUrl({
        state,
        usePKCE: true
    });
};

// Обработать перенаправление авторизации
export const handleAuthRedirect = async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (!code) {
            throw new Error('Код авторизации не найден в URL');
        }
        
        // Логин с использованием кода авторизации
        await platform.login({ code });
        
        // Возвращаем данные авторизации
        return platform.auth().data();
    } catch (error) {
        console.error('Ошибка обработки авторизации:', error);
        throw error;
    }
};

// Обновление токена из cookies
export const restoreAuthFromCookies = async () => {
    try {
        const accessToken = Cookies.get('rc_access_token');
        const refreshToken = Cookies.get('rc_refresh_token');
        
        if (accessToken && refreshToken) {
            platform.auth().setData({
                access_token: accessToken,
                refresh_token: refreshToken,
                token_type: 'bearer'
            });
            
            try {
                // Пытаемся обновить токен
                await platform.refresh();
                return true;
            } catch (e) {
                console.error('Не удалось обновить токен:', e);
                return false;
            }
        }
        return false;
    } catch (e) {
        console.error('Ошибка восстановления аутентификации из cookies:', e);
        return false;
    }
};

// Совершение звонка
export const makeCall = async (phoneNumber) => {
    try {
        if (!isAuthenticated()) {
            throw new Error('Не авторизован в RingCentral');
        }
        
        // Получаем информацию о внутреннем номере пользователя
        const extensionResponse = await platform.get('/restapi/v1.0/account/~/extension/~');
        const extension = await extensionResponse.json();
        
        // Находим прямой номер телефона пользователя или любой доступный номер
        const userPhoneNumber = extension.contact?.phoneNumbers?.find(p => p.type === 'Direct')?.phoneNumber ||
                               extension.contact?.phoneNumbers?.[0]?.phoneNumber;
        
        if (!userPhoneNumber) {
            throw new Error('Не удалось найти ваш номер телефона в аккаунте RingCentral');
        }
        
        // Совершаем вызов с использованием RingOut
        const response = await platform.post('/restapi/v1.0/account/~/extension/~/ring-out', {
            from: { phoneNumber: userPhoneNumber },
            to: { phoneNumber },
            playPrompt: true,
            callerId: { phoneNumber: userPhoneNumber }
        });
        
        return await response.json();
    } catch (error) {
        console.error('Ошибка вызова RingCentral:', error);
        throw error;
    }
};