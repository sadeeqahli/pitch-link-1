import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import SettingsScreen from '../app/(tabs)/settings';

// Mock dependencies
jest.mock('@/utils/auth/useAuth', () => ({
  useAuth: () => ({
    signOut: jest.fn(),
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

describe('SettingsScreen', () => {
  it('renders correctly', async () => {
    const { getByText } = render(<SettingsScreen />);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(getByText('Settings')).toBeTruthy();
    });
    
    // Check if settings sections are rendered
    expect(getByText('NOTIFICATIONS')).toBeTruthy();
    expect(getByText('Enable Notifications')).toBeTruthy();
    expect(getByText('PREFERENCES')).toBeTruthy();
    expect(getByText('Dark Mode')).toBeTruthy();
    expect(getByText('ACCOUNT')).toBeTruthy();
    expect(getByText('Security')).toBeTruthy();
    expect(getByText('SUPPORT')).toBeTruthy();
    expect(getByText('Help Center')).toBeTruthy();
  });
});