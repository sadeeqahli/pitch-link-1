import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { Modal, View, Platform } from 'react-native';
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

// Mock user database for development
const MOCK_USERS_KEY = `${process.env.EXPO_PUBLIC_PROJECT_GROUP_ID}-mock-users`;

// Helper function to get mock users from storage
const getMockUsers = async () => {
  try {
    const users = await SecureStore.getItemAsync(MOCK_USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    return [];
  }
};

// Helper function to save users to storage
const saveMockUsers = async (users) => {
  try {
    await SecureStore.setItemAsync(MOCK_USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users:', error);
  }
};

// Helper function to generate user ID
const generateUserId = () => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Helper function to save a single user to storage
const saveUser = async (user) => {
  try {
    const users = await getMockUsers();
    const existingUserIndex = users.findIndex(u => u.id === user.id);
    
    if (existingUserIndex >= 0) {
      users[existingUserIndex] = user;
    } else {
      users.push(user);
    }
    
    await saveMockUsers(users);
    return user;
  } catch (error) {
    console.error('Failed to save user:', error);
    throw error;
  }
};

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

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get existing users
      const users = await getMockUsers();
      console.log('Existing users:', users);
      
      // Find user by email
      const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
      console.log('Found user:', user);
      
      if (!user) {
        throw new Error('Account not found. Please sign up first.');
      }
      
      // Check password (in real app, this would be hashed)
      if (user.password !== credentials.password) {
        throw new Error('Invalid password. Please try again.');
      }
      
      const authData = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
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
      
      // Get existing users to check if account exists
      const users = await getMockUsers();
      let existingUser = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
      
      if (!existingUser) {
        // Create new user from Google data
        const newUser = {
          id: generateUserId(),
          name: user.name || user.givenName + ' ' + user.familyName,
          email: user.email.toLowerCase(),
          googleId: user.id,
          avatar: user.photo,
          provider: 'google',
          createdAt: new Date().toISOString(),
        };
        
        users.push(newUser);
        await saveMockUsers(users);
        existingUser = newUser;
      }
      
      const authData = {
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          avatar: existingUser.avatar,
          provider: 'google',
          createdAt: existingUser.createdAt,
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
  }, [setAuth]);

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
      
      // Get existing users to check if account exists
      const users = await getMockUsers();
      let existingUser = users.find(u => u.appleId === credential.user);
      
      if (!existingUser) {
        // Create new user from Apple data
        const fullName = credential.fullName;
        const displayName = fullName ? 
          `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim() :
          'Apple User';
        
        const newUser = {
          id: generateUserId(),
          name: displayName,
          email: credential.email || `${credential.user}@privaterelay.appleid.com`,
          appleId: credential.user,
          provider: 'apple',
          createdAt: new Date().toISOString(),
        };
        
        users.push(newUser);
        await saveMockUsers(users);
        existingUser = newUser;
      }
      
      const authData = {
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          provider: 'apple',
          createdAt: existingUser.createdAt,
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
  }, [setAuth]);

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

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get existing users
      const users = await getMockUsers();
      console.log('Existing users:', users);
      
      // Check if user already exists
      const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      console.log('Existing user found:', existingUser);
      
      if (existingUser) {
        throw new Error('An account with this email already exists');
      }
      
      // Create new user with default player role
      const newUser = {
        id: generateUserId(),
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: userData.password, // In real app, this would be hashed
        role: 'player', // Default role for new users
        createdAt: new Date().toISOString(),
      };
      
      users.push(newUser);
      await saveMockUsers(users);
      
      const authData = {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          createdAt: newUser.createdAt,
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
      throw error;
    }
  }, [setAuth]);

  const updateUserProfile = useCallback(async (updates) => {
    try {
      if (!auth?.user?.id) {
        throw new Error('No authenticated user');
      }

      const users = await getMockUsers();
      const userIndex = users.findIndex(u => u.id === auth.user.id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Update user data
      users[userIndex] = {
        ...users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await saveMockUsers(users);

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
  }, [auth, setAuth]);

  // New function to apply for owner status
  const applyForOwner = useCallback(async (businessData) => {
    try {
      if (!auth?.user?.id) {
        throw new Error('No authenticated user');
      }

      const users = await getMockUsers();
      const userIndex = users.findIndex(u => u.id === auth.user.id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Update user to pending owner with business data
      users[userIndex] = {
        ...users[userIndex],
        role: 'pending_owner',
        businessName: businessData.businessName,
        businessAddress: businessData.businessAddress,
        phoneNumber: businessData.phoneNumber,
        appliedAt: new Date().toISOString(),
      };

      await saveMockUsers(users);

      // Update auth state
      const updatedAuth = {
        ...auth,
        user: {
          ...auth.user,
          role: 'pending_owner',
          businessName: businessData.businessName,
          businessAddress: businessData.businessAddress,
          phoneNumber: businessData.phoneNumber,
        },
      };

      await SecureStore.setItemAsync(authKey, JSON.stringify(updatedAuth));
      setAuth(updatedAuth);

      return updatedAuth.user;
    } catch (error) {
      throw error;
    }
  }, [auth, setAuth]);

  // New function to simulate owner approval (for development only)
  const simulateOwnerApproval = useCallback(async () => {
    try {
      if (!auth?.user?.id) {
        throw new Error('No authenticated user');
      }

      const users = await getMockUsers();
      const userIndex = users.findIndex(u => u.id === auth.user.id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Update user to approved owner
      users[userIndex] = {
        ...users[userIndex],
        role: 'owner',
        approvedAt: new Date().toISOString(),
      };

      await saveMockUsers(users);

      // Update auth state
      const updatedAuth = {
        ...auth,
        user: {
          ...auth.user,
          role: 'owner',
        },
      };

      await SecureStore.setItemAsync(authKey, JSON.stringify(updatedAuth));
      setAuth(updatedAuth);

      return updatedAuth.user;
    } catch (error) {
      throw error;
    }
  }, [auth, setAuth]);

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
    applyForOwner, // New function
    simulateOwnerApproval, // New function
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
    if (!isAuthenticated && isReady) {
      open({ mode: options?.mode });
    }
  }, [isAuthenticated, open, options?.mode, isReady]);
};

export default useAuth;