import * as SecureStore from 'expo-secure-store';
import { authKey } from '@/utils/auth/store';

const MOCK_USERS_KEY = `${process.env.EXPO_PUBLIC_PROJECT_GROUP_ID}-mock-users`;

export const clearAllData = async () => {
  try {
    console.log('Clearing all app data...');
    
    // Clear auth data
    await SecureStore.deleteItemAsync(authKey);
    console.log('Auth data cleared');
    
    // Clear onboarding status
    await SecureStore.deleteItemAsync('hasCompletedOnboarding');
    console.log('Onboarding status cleared');
    
    // Clear mock users
    await SecureStore.deleteItemAsync(MOCK_USERS_KEY);
    console.log('Mock users cleared');
    
    console.log('All data cleared successfully!');
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

// Run the function if this file is executed directly
if (typeof window === 'undefined') {
  clearAllData();
}

export default clearAllData;