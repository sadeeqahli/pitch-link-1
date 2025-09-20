import * as SecureStore from "expo-secure-store";

const ONBOARDING_KEY = 'hasCompletedOnboarding';

export const resetOnboarding = async () => {
  try {
    await SecureStore.deleteItemAsync(ONBOARDING_KEY);
    console.log('Onboarding status reset successfully');
    return true;
  } catch (error) {
    console.log('Error resetting onboarding status:', error);
    return false;
  }
};

export const checkOnboardingStatus = async () => {
  try {
    const status = await SecureStore.getItemAsync(ONBOARDING_KEY);
    console.log('Current onboarding status:', status);
    return status === 'true';
  } catch (error) {
    console.log('Error checking onboarding status:', error);
    return false;
  }
};