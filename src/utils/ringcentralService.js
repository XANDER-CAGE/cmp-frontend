// src/utils/ringcentralService.js
import SDK from '@ringcentral/sdk';
import Cookies from 'js-cookie';

// Configuration
const ringcentralConfig = {
    server: 'https://platform.ringcentral.com',
    clientId: '7jgRD9OXm6ldHaZSVo06Qd',
    clientSecret: '1SRjZSbrq2kcrOSXXA0Jyr2ksZ4VZtyU6eTO6e0qnUps',
    redirectUri: `${window.location.origin}/oauth-callback`,
    cachePrefix: 'rc-sdk-'
};

// Create SDK instance
export const sdk = new SDK({
    server: ringcentralConfig.server,
    clientId: ringcentralConfig.clientId,
    clientSecret: ringcentralConfig.clientSecret,
    redirectUri: ringcentralConfig.redirectUri,
    cachePrefix: ringcentralConfig.cachePrefix,
    appName: 'CityFuel Management',
    appVersion: '1.0.0'
});

// Platform instance
const platform = sdk.platform();

// Check authentication status
export const isAuthenticated = () => {
    try {
        return platform.auth().accessTokenValid();
    } catch (e) {
        console.error('Error checking authentication status:', e);
        return false;
    }
};

// Make a call using RingOut API
export const makeCall = async (phoneNumber) => {
    try {
        if (!isAuthenticated()) {
            throw new Error('Not authenticated with RingCentral');
        }
        
        // Get user's extension info to find their direct number
        const extensionResponse = await platform.get('/restapi/v1.0/account/~/extension/~');
        const extension = await extensionResponse.json();
        
        // Find user's direct phone number or any available number
        const userPhoneNumber = extension.contact?.phoneNumbers?.find(p => p.type === 'Direct')?.phoneNumber ||
                                extension.contact?.phoneNumbers?.[0]?.phoneNumber;
        
        if (!userPhoneNumber) {
            throw new Error('Could not find your phone number in RingCentral account');
        }
        
        // Make the call using RingOut
        const response = await platform.post('/restapi/v1.0/account/~/extension/~/ring-out', {
            from: { phoneNumber: userPhoneNumber },
            to: { phoneNumber },
            playPrompt: true,
            callerId: { phoneNumber: userPhoneNumber }
        });
        
        return await response.json();
    } catch (error) {
        console.error('RingCentral call error:', error);
        throw error;
    }
};

// Helper to restore authentication from cookies
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
                // Attempt to refresh the token
                await platform.refresh();
                return true;
            } catch (e) {
                console.error('Failed to refresh token:', e);
                return false;
            }
        }
        return false;
    } catch (e) {
        console.error('Error restoring auth from cookies:', e);
        return false;
    }
};

// OAuth redirect URI handler - for browser-based OAuth flow (if needed)
export const handleAuthRedirect = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
        return platform.login({
            code,
            redirectUri: ringcentralConfig.redirectUri
        });
    }
    
    return Promise.reject(new Error('No authorization code found in URL'));
};