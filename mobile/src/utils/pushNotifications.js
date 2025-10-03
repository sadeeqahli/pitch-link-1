import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register for push notifications
 * @returns {Promise<string|null>} Push token or null if not supported
 */
export const registerForPushNotificationsAsync = async () => {
  let token;
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }
    
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push token:', token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
};

/**
 * Save push token to Convex for a user
 * @param {string} userId - Convex user ID
 * @param {string} pushToken - Expo push token
 */
export const savePushTokenToConvex = async (userId, pushToken) => {
  try {
    // In a real implementation, you would call a Convex mutation here
    // For now, we'll just log it
    console.log('Saving push token to Convex for user:', userId, pushToken);
    
    // Example of what the Convex mutation might look like:
    // await saveUserPushToken({ userId, pushToken });
    
    return true;
  } catch (error) {
    console.error('Error saving push token to Convex:', error);
    return false;
  }
};

/**
 * Send push notification to a user
 * @param {string} pushToken - Expo push token
 * @param {Object} notification - Notification content
 */
export const sendPushNotification = async (pushToken, notification) => {
  try {
    const message = {
      to: pushToken,
      sound: 'default',
      title: notification.title,
      body: notification.body,
      data: notification.data || {},
    };

    // In a real implementation, you would send this to Expo's push notification service
    // For now, we'll just log it
    console.log('Sending push notification:', message);
    
    // Example of what the API call might look like:
    // await fetch('https://exp.host/--/api/v2/push/send', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Accept-encoding': 'gzip, deflate',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(message),
    // });
    
    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
};

/**
 * Hook to handle push notifications in components
 */
export const usePushNotifications = () => {
  const saveUserPushToken = useMutation(api.users.saveUserPushToken);
  
  const registerAndSaveToken = async (userId) => {
    try {
      const token = await registerForPushNotificationsAsync();
      if (token && userId) {
        await saveUserPushToken({ userId, pushToken: token });
        console.log('Push token saved to Convex for user:', userId);
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error registering and saving push token:', error);
      return null;
    }
  };
  
  return {
    registerAndSaveToken,
  };
};

/**
 * Send booking confirmation notification
 * @param {string} pushToken - User's push token
 * @param {Object} bookingDetails - Booking details
 */
export const sendBookingConfirmationNotification = async (pushToken, bookingDetails) => {
  const notification = {
    title: 'Booking Confirmed!',
    body: `Your booking for ${bookingDetails.pitchName} on ${bookingDetails.date} at ${bookingDetails.time} has been confirmed.`,
    data: { 
      bookingId: bookingDetails.bookingId,
      type: 'booking_confirmation'
    },
  };
  
  return await sendPushNotification(pushToken, notification);
};