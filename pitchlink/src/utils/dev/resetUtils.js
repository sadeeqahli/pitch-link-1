import * as SecureStore from 'expo-secure-store';

/**
 * Utility functions for managing onboarding and auth state during development
 */

export const resetOnboarding = async () => {
  try {
    await SecureStore.deleteItemAsync('hasCompletedOnboarding');
    console.log('Onboarding status reset');
    return true;
  } catch (error) {
    console.log('Error resetting onboarding:', error);
    return false;
  }
};

export const resetAuth = async () => {
  try {
    await SecureStore.deleteItemAsync('auth');
    console.log('Auth status reset');
    return true;
  } catch (error) {
    console.log('Error resetting auth:', error);
    return false;
  }
};

export const resetUserProfile = async () => {
  try {
    await SecureStore.deleteItemAsync('user-profile');
    console.log('User profile reset');
    return true;
  } catch (error) {
    console.log('Error resetting user profile:', error);
    return false;
  }
};

export const resetAll = async () => {
  const results = await Promise.all([
    resetOnboarding(),
    resetAuth(),
    resetUserProfile()
  ]);
  
  const allSuccessful = results.every(result => result === true);
  if (allSuccessful) {
    console.log('All data reset successfully');
  } else {
    console.log('Some reset operations failed');
  }
  
  return allSuccessful;
};

// For development - you can call these functions in the console
globalThis.resetOnboarding = resetOnboarding;
globalThis.resetAuth = resetAuth;
globalThis.resetUserProfile = resetUserProfile;
globalThis.resetAll = resetAll;