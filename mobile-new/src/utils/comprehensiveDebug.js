import * as SecureStore from 'expo-secure-store';
import { authKey } from '@/utils/auth/store';

const MOCK_USERS_KEY = `${process.env.EXPO_PUBLIC_PROJECT_GROUP_ID}-mock-users`;
const ONBOARDING_KEY = 'hasCompletedOnboarding';

export const comprehensiveDebug = async () => {
  try {
    console.log('=== COMPREHENSIVE DEBUG INFO ===');
    
    // Check all known keys
    const keysToCheck = [authKey, ONBOARDING_KEY, MOCK_USERS_KEY];
    
    for (const key of keysToCheck) {
      try {
        const value = await SecureStore.getItemAsync(key);
        console.log(`${key}:`, value ? (key === MOCK_USERS_KEY ? `Array with ${JSON.parse(value).length} items` : value) : 'None');
      } catch (error) {
        console.log(`${key}: Error reading -`, error.message);
      }
    }
    
    console.log('========================');
    
    return true;
  } catch (error) {
    console.error('Comprehensive debug error:', error);
    return false;
  }
};

// Add this to the global scope for easy access in the console
global.comprehensiveDebug = comprehensiveDebug;

export default comprehensiveDebug;