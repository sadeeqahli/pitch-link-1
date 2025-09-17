import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { Modal, View } from 'react-native';
import { useAuthModal, useAuthStore, authKey } from './store';


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
      useAuthStore.setState({
        auth: storedAuth ? JSON.parse(storedAuth) : null,
        isReady: true,
      });
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
    // Mock sign in for development
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAuth = {
        user: {
          id: '1',
          email: credentials?.email || 'user@example.com',
          name: 'User Name'
        },
        jwt: 'mock-jwt-token'
      };
      
      // Save to secure store
      await SecureStore.setItemAsync(authKey, JSON.stringify(mockAuth));
      setAuth(mockAuth);
      
      return mockAuth;
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  }, [setAuth]);
  
  const signUp = useCallback(async (userData) => {
    // Mock sign up for development
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAuth = {
        user: {
          id: '1',
          email: userData?.email || 'user@example.com',
          name: userData?.name || 'New User'
        },
        jwt: 'mock-jwt-token'
      };
      
      // Save to secure store
      await SecureStore.setItemAsync(authKey, JSON.stringify(mockAuth));
      setAuth(mockAuth);
      
      return mockAuth;
    } catch (error) {
      throw new Error('Failed to create account');
    }
  }, [setAuth]);

  const signOut = useCallback(() => {
    setAuth(null);
    close();
  }, [close]);

  return {
    isReady,
    isAuthenticated: isReady ? !!auth : null,
    signIn,
    signOut,
    signUp,
    auth,
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