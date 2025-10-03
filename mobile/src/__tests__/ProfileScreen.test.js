import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ProfileScreen from '../app/(tabs)/profile';

// Mock dependencies
jest.mock('@/utils/auth/useAuth', () => ({
  useAuth: () => ({
    auth: { 
      user: { 
        id: 'user123', 
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+2348012345678',
        createdAt: '2023-01-01T00:00:00Z'
      } 
    },
    isReady: true,
    isAuthenticated: true,
    signOut: jest.fn(),
  }),
}));

jest.mock('@/hooks/useConvex', () => ({
  useUsers: () => ({
    updateUser: jest.fn(),
  }),
}));

jest.mock('@/utils/auth/userStore', () => ({
  useUserStore: () => ({
    user: { id: 'user123' },
    initializeUserProfile: jest.fn(),
  }),
}));

// Mock navigation
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock color scheme
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => () => 'light');

describe('ProfileScreen', () => {
  it('renders correctly', async () => {
    const { getByText } = render(<ProfileScreen />);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(getByText('Profile')).toBeTruthy();
    });
    
    // Check if user info is rendered
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Member since 2023')).toBeTruthy();
  });
});