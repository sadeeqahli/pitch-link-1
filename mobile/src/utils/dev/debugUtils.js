import * as SecureStore from 'expo-secure-store';

/**
 * Debug utilities for checking and resetting app state
 */

export const checkAllStorage = async () => {
  try {
    const keys = [
      'hasCompletedOnboarding',
      'auth',
      'user-profile',
      'user-bookings'
    ];
    
    console.log('=== Storage Debug Info ===');
    for (const key of keys) {
      try {
        const value = await SecureStore.getItemAsync(key);
        console.log(`${key}:`, value);
      } catch (error) {
        console.log(`Error reading ${key}:`, error.message);
      }
    }
    console.log('========================');
  } catch (error) {
    console.log('Error in checkAllStorage:', error);
  }
};

export const resetOnboardingStatus = async () => {
  try {
    await SecureStore.deleteItemAsync('hasCompletedOnboarding');
    console.log('Onboarding status reset successfully');
    return true;
  } catch (error) {
    console.log('Error resetting onboarding status:', error);
    return false;
  }
};

export const setOnboardingStatus = async (status) => {
  try {
    await SecureStore.setItemAsync('hasCompletedOnboarding', status.toString());
    console.log(`Onboarding status set to: ${status}`);
    return true;
  } catch (error) {
    console.log('Error setting onboarding status:', error);
    return false;
  }
};

// Make these functions available globally for debugging
globalThis.checkAllStorage = checkAllStorage;
globalThis.resetOnboardingStatus = resetOnboardingStatus;
globalThis.setOnboardingStatus = setOnboardingStatus;

console.log('Debug utilities loaded. Available functions:');
console.log('- checkAllStorage()');
console.log('- resetOnboardingStatus()');
console.log('- setOnboardingStatus(true|false)');