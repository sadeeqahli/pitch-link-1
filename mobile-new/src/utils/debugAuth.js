import * as SecureStore from 'expo-secure-store';
import { authKey } from '@/utils/auth/store';

const MOCK_USERS_KEY = `${process.env.EXPO_PUBLIC_PROJECT_GROUP_ID}-mock-users`;

export const debugAuthState = async () => {
  try {
    console.log('=== AUTH DEBUG INFO ===');
    
    // Check auth key
    const authData = await SecureStore.getItemAsync(authKey);
    console.log('Auth Data:', authData ? JSON.parse(authData) : 'None');
    
    // Check onboarding key
    const onboardingData = await SecureStore.getItemAsync('hasCompletedOnboarding');
    console.log('Onboarding Status:', onboardingData || 'None');
    
    // Check mock users
    const mockUsersData = await SecureStore.getItemAsync(MOCK_USERS_KEY);
    const mockUsers = mockUsersData ? JSON.parse(mockUsersData) : [];
    console.log('Mock Users Count:', mockUsers.length);
    if (mockUsers.length > 0) {
      console.log('First User:', mockUsers[0]);
    }
    
    console.log('========================');
    
    return {
      auth: authData ? JSON.parse(authData) : null,
      onboarding: onboardingData,
      mockUsers: mockUsers.length
    };
  } catch (error) {
    console.error('Debug auth error:', error);
    return null;
  }
};

export const clearAllAuthData = async () => {
  try {
    console.log('Clearing all auth data...');
    await SecureStore.deleteItemAsync(authKey);
    await SecureStore.deleteItemAsync('hasCompletedOnboarding');
    await SecureStore.deleteItemAsync(MOCK_USERS_KEY);
    console.log('Auth data cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return false;
  }
};