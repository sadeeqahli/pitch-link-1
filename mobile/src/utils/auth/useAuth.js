import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { Modal, View, Platform } from 'react-native';
// Import Convex functions
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
// Conditional imports for native-only packages
let GoogleSignin;
let AppleAuthentication;

try {
  GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
} catch (e) {
  GoogleSignin = null;
}

try {
  AppleAuthentication = require('expo-apple-authentication');
} catch (e) {
  AppleAuthentication = null;
}
import { useAuthModal, useAuthStore, authKey } from './store';
import { registerForPushNotificationsAsync, savePushTokenToConvex } from '@/utils/pushNotifications';

// Configure Google Sign-in
const configureGoogleSignIn = () => {
  if (GoogleSignin) {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, // From Google Cloud Console
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, // From Google Cloud Console
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID, // From Google Cloud Console
      scopes: ['email', 'profile'],
    });
  }
};

// Initialize Google Sign-in configuration
configureGoogleSignIn();


/**
 * This hook provides authentication functionality.
 * It may be easier to use the `useAuthModal` or `useRequireAuth` hooks
 * instead as those will also handle showing authentication to the user
 * directly.
 */
export const useAuth = () => {
  const { isReady, auth, setAuth } = useAuthStore();
  const { isOpen, close, open } = useAuthModal();
  
  // Convex mutations for user management
  const createUser = useMutation(api.users.createUser);
  const updateUser = useMutation(api.users.updateUser);
  const saveUserPushToken = useMutation(api.users.saveUserPushToken);
  // We'll use the direct query approach for getUserByEmail and authenticateUser since they require parameters
  // Convex queries for user lookup (parameterized)
  // We don't initialize getUserByEmail or authenticateUser here because they're parameterized queries
  // They will be called with parameters when needed in the signIn and signUp functions

  const initiate = useCallback(async () => {
    try {
      const storedAuth = await SecureStore.getItemAsync(authKey);
      console.log('Auth data from SecureStore:', storedAuth);
      const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null;
      
      console.log('Parsed auth data:', parsedAuth);
      useAuthStore.setState({
        auth: parsedAuth,
        isReady: true,
      });
      console.log('Auth store updated with:', parsedAuth);
    } catch (error) {
      console.log('Error loading auth:', error);
      useAuthStore.setState({
        auth: null,
        isReady: true,
      });
    }
  }, []);

  useEffect(() => {
    initiate();
  }, [initiate]);

  const signIn = useCallback(async (credentials) => {
    try {
      console.log('Attempting sign in with credentials:', credentials);
      if (!credentials) {
        console.log('No credentials provided, throwing error');
        throw new Error('Credentials object is required');
      }
      if (!credentials?.email || !credentials?.password) {
        console.log('Email or password missing from credentials');
        throw new Error('Email and password are required');
      }

      // Authenticate user with Convex
      try {
        // Use the Convex client to authenticate user
        const convex = (await import('@/utils/convex')).default;
        const authResult = await convex.query(api.users.authenticateUser, {
          email: credentials.email.toLowerCase(),
          password: credentials.password
        });
        
        if (!authResult.success) {
          throw new Error(authResult.error || 'Authentication failed');
        }
        
        const userData = authResult.user;
        
        const authData = {
          user: {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            createdAt: new Date(userData.createdAt).toISOString(),
          },
          jwt: 'mock-jwt-token-' + Date.now()
        };
        
        console.log('Sign in successful, auth data:', authData);
        
        // Save to secure store
        await SecureStore.setItemAsync(authKey, JSON.stringify(authData));
        setAuth(authData);
        
        // Register for push notifications
        try {
          const pushToken = await registerForPushNotificationsAsync();
          if (pushToken && userData.id) {
            await savePushTokenToConvex(userData.id, pushToken);
          }
        } catch (pushError) {
          console.log('Error registering push notifications:', pushError);
        }
        
        return authData;
      } catch (convexError) {
        console.log('Convex authentication error:', convexError.message);
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.log('Sign in error:', error.message);
      throw error;
    }
  }, [setAuth]);

  const signInWithGoogle = useCallback(async () => {
    // Check if Google Sign-in is available
    if (!GoogleSignin) {
      throw new Error('Google Sign-in is not available on this platform');
    }
    
    try {
      // Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices();
      
      // Get user info from Google
      const userInfo = await GoogleSignin.signIn();
      
      if (!userInfo?.user) {
        throw new Error('Google Sign-in was cancelled or failed');
      }
      
      const { user } = userInfo;
      
      // Check if user already exists in Convex
      let userData = null;
      try {
        // Use the Convex client to check if user exists
        // This is the correct way to call a query with parameters in an async function
        const convex = (await import('@/utils/convex')).default;
        userData = await convex.query(api.users.getUserByEmail, { email: user.email.toLowerCase() });
        console.log('User found in Convex:', userData);
      } catch (error) {
        console.log('Error checking user existence:', error.message);
      }
      
      let convexUserId = null;
      
      // If user doesn't exist, create them
      if (!userData) {
        try {
          convexUserId = await createUser({
            name: user.name || user.givenName + ' ' + user.familyName,
            email: user.email.toLowerCase(),
          });
          console.log('Created new user with ID:', convexUserId);
        } catch (error) {
          // If user already exists, we'll get an error due to unique constraint
          console.log('User might already exist:', error.message);
          // Try to fetch the user again
          try {
            const convex = (await import('@/utils/convex')).default;
            const existingUser = await convex.query(api.users.getUserByEmail, { email: user.email.toLowerCase() });
            if (existingUser) {
              convexUserId = existingUser._id;
            } else {
              throw new Error('Failed to create or find user account');
            }
          } catch (fetchError) {
            console.log('Error fetching existing user:', fetchError.message);
            throw new Error('Failed to create user account');
          }
        }
      } else {
        convexUserId = userData._id;
      }
      
      const authData = {
        user: {
          id: convexUserId,
          email: user.email.toLowerCase(),
          name: user.name || user.givenName + ' ' + user.familyName,
          avatar: user.photo,
          provider: 'google',
          createdAt: new Date().toISOString(),
        },
        jwt: 'mock-jwt-token-google-' + Date.now()
      };
      
      // Save to secure store
      await SecureStore.setItemAsync(authKey, JSON.stringify(authData));
      setAuth(authData);
      
      // Register for push notifications
      try {
        const pushToken = await registerForPushNotificationsAsync();
        if (pushToken && convexUserId) {
          await savePushTokenToConvex(convexUserId, pushToken);
        }
      } catch (pushError) {
        console.log('Error registering push notifications:', pushError);
      }
      
      return authData;
    } catch (error) {
      if (error.code === 'SIGN_IN_CANCELLED') {
        throw new Error('Google Sign-in was cancelled');
      } else if (error.code === 'IN_PROGRESS') {
        throw new Error('Google Sign-in is already in progress');
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        throw new Error('Google Play Services not available');
      } else {
        console.error('Google Sign-in error:', error);
        throw new Error('Google Sign-in failed. Please try again.');
      }
    }
  }, [setAuth, createUser]);

  const signInWithApple = useCallback(async () => {
    // Check if Apple authentication is available
    if (!AppleAuthentication) {
      throw new Error('Apple Sign-in is not available on this platform');
    }
    
    try {
      // Check if Apple authentication is available
      if (Platform.OS === 'ios' && !await AppleAuthentication.isAvailableAsync()) {
        throw new Error('Apple Sign-in is not available on this device');
      }
      
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      
      if (!credential.user) {
        throw new Error('Apple Sign-in was cancelled or failed');
      }
      
      // Check if user already exists in Convex
      let userData = null;
      try {
        // Use the Convex client to check if user exists
        const convex = (await import('@/utils/convex')).default;
        const email = credential.email || `${credential.user}@privaterelay.appleid.com`;
        userData = await convex.query(api.users.getUserByEmail, { email: email.toLowerCase() });
        console.log('User found in Convex:', userData);
      } catch (error) {
        console.log('Error checking user existence:', error.message);
      }
      
      let convexUserId = null;
      
      // If user doesn't exist, create them
      if (!userData) {
        try {
          const fullName = credential.fullName;
          const displayName = fullName ? 
            `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim() :
            'Apple User';
          
          const email = credential.email || `${credential.user}@privaterelay.appleid.com`;
          convexUserId = await createUser({
            name: displayName,
            email: email.toLowerCase(),
          });
          console.log('Created new user with ID:', convexUserId);
        } catch (error) {
          // If user already exists, we'll get an error due to unique constraint
          console.log('User might already exist:', error.message);
          // Try to fetch the user again
          try {
            const convex = (await import('@/utils/convex')).default;
            const email = credential.email || `${credential.user}@privaterelay.appleid.com`;
            const existingUser = await convex.query(api.users.getUserByEmail, { email: email.toLowerCase() });
            if (existingUser) {
              convexUserId = existingUser._id;
            } else {
              throw new Error('Failed to create or find user account');
            }
          } catch (fetchError) {
            console.log('Error fetching existing user:', fetchError.message);
            throw new Error('Failed to create user account');
          }
        }
      } else {
        convexUserId = userData._id;
      }
      
      const fullName = credential.fullName;
      const displayName = fullName ? 
        `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim() :
        'Apple User';
      
      const authData = {
        user: {
          id: convexUserId,
          email: credential.email || `${credential.user}@privaterelay.appleid.com`,
          name: displayName,
          provider: 'apple',
          createdAt: new Date().toISOString(),
        },
        jwt: 'mock-jwt-token-apple-' + Date.now()
      };
      
      // Save to secure store
      await SecureStore.setItemAsync(authKey, JSON.stringify(authData));
      setAuth(authData);
      
      // Register for push notifications
      try {
        const pushToken = await registerForPushNotificationsAsync();
        if (pushToken && convexUserId) {
          await savePushTokenToConvex(convexUserId, pushToken);
        }
      } catch (pushError) {
        console.log('Error registering push notifications:', pushError);
      }
      
      return authData;
    } catch (error) {
      if (error.code === 'ERR_CANCELED') {
        throw new Error('Apple Sign-in was cancelled');
      } else {
        console.error('Apple Sign-in error:', error);
        throw new Error('Apple Sign-in failed. Please try again.');
      }
    }
  }, [setAuth, createUser]);

  const getCurrentUser = useCallback(() => {
    return auth?.user || null;
  }, [auth]);

  const signOut = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(authKey);
      setAuth(null);
      
      // Reset any user-specific data in other stores
      // For example, you might want to reset user preferences
      
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }, [setAuth]);

  const signUp = useCallback(async (userData) => {
    try {
      console.log('Attempting sign up with data:', userData);
      if (!userData?.email || !userData?.password || !userData?.name) {
        throw new Error('Email, password, and name are required');
      }

      // Check if user already exists
      try {
        const convex = (await import('@/utils/convex')).default;
        const existingUser = await convex.query(api.users.getUserByEmail, { email: userData.email.toLowerCase() });
        if (existingUser) {
          throw new Error('An account with this email already exists');
        }
      } catch (checkError) {
        // If there's an error checking, we'll proceed with creation
        console.log('Error checking existing user:', checkError.message);
      }

      // Create new user in Convex
      try {
        const convexUserId = await createUser({
          name: userData.name,
          email: userData.email.toLowerCase(),
        });
      
        const authData = {
          user: {
            id: convexUserId,
            email: userData.email.toLowerCase(),
            name: userData.name,
            createdAt: new Date().toISOString(),
          },
          jwt: 'mock-jwt-token-' + Date.now()
        };
      
        console.log('Sign up successful, auth data:', authData);
      
        // Save to secure store
        await SecureStore.setItemAsync(authKey, JSON.stringify(authData));
        setAuth(authData);
        
        // Register for push notifications
        try {
          const pushToken = await registerForPushNotificationsAsync();
          if (pushToken && convexUserId) {
            await savePushTokenToConvex(convexUserId, pushToken);
          }
        } catch (pushError) {
          console.log('Error registering push notifications:', pushError);
        }
      
        return authData;
      } catch (createError) {
        console.log('Error creating user:', createError.message);
        if (createError.message.includes('duplicate')) {
          throw new Error('An account with this email already exists');
        }
        throw new Error('Failed to create account. Please try again.');
      }
    } catch (error) {
      console.log('Sign up error:', error.message);
      throw error;
    }
  }, [setAuth, createUser]);

  const updateUserProfile = useCallback(async (updates) => {
    try {
      if (!auth?.user?.id) {
        throw new Error('No authenticated user');
      }

      // Update user in Convex
      await updateUser({
        userId: auth.user.id,
        ...(updates.name && { name: updates.name }),
        ...(updates.phone && { phone: updates.phone }),
      });

      // Update auth state
      const updatedAuth = {
        ...auth,
        user: {
          ...auth.user,
          ...updates,
        },
      };

      await SecureStore.setItemAsync(authKey, JSON.stringify(updatedAuth));
      setAuth(updatedAuth);

      return updatedAuth.user;
    } catch (error) {
      throw error;
    }
  }, [auth, setAuth, updateUser]);

  return {
    isReady,
    isAuthenticated: isReady ? !!auth : null,
    signIn,
    signOut,
    signUp,
    signInWithGoogle,
    signInWithApple,
    auth,
    user: auth?.user || null,
    getCurrentUser,
    updateUserProfile,
    setAuth,
    initiate,
  };
};

/**
 * This hook will automatically open the authentication modal if the user is not authenticated.
 */
export const useRequireAuth = (options) => {
  const { isAuthenticated, isReady } = useAuth();
  const { open } = useAuthModal();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      open({ mode: options?.mode });
    }
  }, [isAuthenticated, open, options?.mode, isReady]);
};

export default useAuth;