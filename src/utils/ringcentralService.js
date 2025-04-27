import SDK from '@ringcentral/sdk';

// URL перенаправления OAuth
const redirectUri = `${window.location.origin}/api/oauth2Callback`;

// Инициализация SDK
export const sdk = new SDK({
    appName: 'CompanyManagement',
    appVersion: '1.0.0',
    server: 'https://platform.ringcentral.com',
    clientId: '7qqd7KHvEcIdmAVmrkQoys',
    clientSecret: 'a2FIlTnfBqfdwoLtghd510YytK814amGCcQtOMR7iR5r',
    redirectUri
});

// Функция для проверки аутентификации
export const isAuthenticated = () => {
    try {
        return sdk.platform().auth().accessTokenValid();
    } catch (e) {
        return false;
    }
};

// Функция для звонка
export const makeCall = async (phoneNumber) => {
    try {
        // Получаем информацию о расширении пользователя
        const extensionInfo = await sdk.platform().get('/restapi/v1.0/account/~/extension/~');
        const extensionData = await extensionInfo.json();
        
        // Определяем номер телефона пользователя
        const fromNumber = extensionData.contact?.phoneNumbers?.find(p => p.type === 'Direct')?.phoneNumber ||
                          extensionData.contact?.phoneNumbers?.[0]?.phoneNumber;
        
        if (!fromNumber) {
            throw new Error('Не удалось найти ваш номер телефона в аккаунте RingCentral');
        }
        
        // Совершаем звонок через RingOut API
        const response = await sdk.platform().post('/restapi/v1.0/account/~/extension/~/ring-out', {
            from: { phoneNumber: fromNumber },
            to: { phoneNumber },
            playPrompt: true
        });
        
        return await response.json();
    } catch (error) {
        console.error('Ошибка звонка:', error);
        throw error;
    }
};