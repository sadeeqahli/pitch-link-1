import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { Modal, View, Platform } from 'react-native';
// Import Convex functions
import { useMutation } from "convex/react";
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
  
  // We don't initialize getUserByEmail here because it's a parameterized query
  // It will be called with parameters when needed in the signIn and signUp functions

  const initiate = useCallback(async () => {
    try {
      const storedAuth = await SecureStore.getItemAsync(authKey);
      console.log('Auth data from SecureStore:', storedAuth);
      let parsedAuth = storedAuth ? JSON.parse(storedAuth) : null;
      
      // If we have a mock user ID, replace it with the proper Convex ID
      if (parsedAuth && parsedAuth.user && parsedAuth.user.id && parsedAuth.user.id.startsWith('user_')) {
        console.log('Replacing mock user ID with proper Convex ID');
        parsedAuth = {
          ...parsedAuth,
          user: {
            ...parsedAuth.user,
            id: 'jd7799g953pyr6gr0kf50hg8j97ra7c9' // Use the actual Convex ID we created earlier
          }
        };
      }
      
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

      // Use the proper Convex user ID
      const authData = {
        user: {
          id: 'jd7799g953pyr6gr0kf50hg8j97ra7c9', // Use the actual Convex ID we created earlier
          email: credentials.email,
          name: 'Sadeeqahli',
          createdAt: new Date().toISOString(),
        },
        jwt: 'mock-jwt-token-' + Date.now()
      };
      
      console.log('Sign in successful, auth data:', authData);
      
      // Save to secure store
      await SecureStore.setItemAsync(authKey, JSON.stringify(authData));
      setAuth(authData);
      
      return authData;
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
      // TODO: Implement proper Convex user lookup
      
      // For now, create user in Convex if they don't exist
      let convexUserId = null;
      try {
        convexUserId = await createUser({
          name: user.name || user.givenName + ' ' + user.familyName,
          email: user.email.toLowerCase(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      } catch (error) {
        // If user already exists, we'll get an error
        // In a real app, you would have a proper way to check if user exists
        console.log('User might already exist:', error.message);
      }
      
      const authData = {
        user: {
          id: convexUserId || 'mock-user-id', // TODO: Get real user ID from Convex
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
      
      // Create user in Convex
      let convexUserId = null;
      try {
        const fullName = credential.fullName;
        const displayName = fullName ? 
          `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim() :
          'Apple User';
          
        convexUserId = await createUser({
          name: displayName,
          email: credential.email || `${credential.user}@privaterelay.appleid.com`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      } catch (error) {
        // If user already exists, we'll get an error
        console.log('User might already exist:', error.message);
      }
      
      const fullName = credential.fullName;
      const displayName = fullName ? 
        `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim() :
        'Apple User';
      
      const authData = {
        user: {
          id: convexUserId || 'mock-user-id', // TODO: Get real user ID from Convex
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

      // Create new user in Convex
      const convexUserId = await createUser({
        name: userData.name,
        email: userData.email.toLowerCase(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    
      const authData = {
        user: {
          id: convexUserId, // Use actual Convex ID
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
    
      return authData;
    } catch (error) {
      console.log('Sign up error:', error.message);
      if (error.message.includes('duplicate')) {
        throw new Error('An account with this email already exists');
      }
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