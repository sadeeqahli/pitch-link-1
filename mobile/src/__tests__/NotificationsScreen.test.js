import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import NotificationsScreen from '../app/(tabs)/notifications';

// Mock navigation
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock color scheme
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => () => 'light');

describe('NotificationsScreen', () => {
  it('renders correctly', async () => {
    const { getByText } = render(<NotificationsScreen />);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(getByText('Notifications')).toBeTruthy();
    });
    
    // Check if notifications are rendered
    expect(getByText('Booking Confirmed')).toBeTruthy();
    expect(getByText('Your booking for Green Field FC on June 15 at 5:00 PM has been confirmed.')).toBeTruthy();
  });
});