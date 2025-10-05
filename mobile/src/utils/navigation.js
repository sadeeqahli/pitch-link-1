import { Platform } from 'react-native';

/**
 * Navigation utility functions that follow iOS and Android standards
 */

/**
 * Safe navigation back with fallback
 * @param {Object} router - Expo Router instance
 * @param {string} fallbackRoute - Fallback route if back is not possible
 */
export const safeGoBack = (router, fallbackRoute = "/(tabs)/home") => {
  console.log('Attempting to go back...');
  console.log('Can go back:', router.canGoBack());
  console.log('Current route:', router.getCurrentRoute());
  
  if (router.canGoBack()) {
    console.log('Going back...');
    router.back();
  } else {
    console.log('Cannot go back, navigating to fallback:', fallbackRoute);
    router.push(fallbackRoute);
  }
};

/**
 * Safe navigation forward
 * @param {Object} router - Expo Router instance
 * @param {Object} route - Route object with pathname and params
 */
export const safeNavigate = (router, route) => {
  console.log('Navigating to:', route);
  console.log('Current route:', router.getCurrentRoute());
  
  try {
    // For iOS and Android, we want smooth transitions
    const navigationOptions = {
      animationTypeForReplace: Platform.OS === 'ios' ? 'push' : 'pop',
    };
    
    router.push(route, navigationOptions);
    console.log('Navigation command sent');
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

/**
 * Get platform-specific animation type
 * @returns {string} Animation type for the current platform
 */
export const getPlatformAnimation = () => {
  return Platform.OS === 'ios' ? 'slide_from_right' : 'slide_from_right';
};

/**
 * Check if we're on a mobile platform
 * @returns {boolean} True if on mobile platform
 */
export const isMobilePlatform = () => {
  return Platform.OS === 'ios' || Platform.OS === 'android';
};

export default {
  safeGoBack,
  safeNavigate,
  getPlatformAnimation,
  isMobilePlatform,
};