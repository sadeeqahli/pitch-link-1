import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import BookingsScreen from '../app/(tabs)/bookings';

// Mock dependencies
jest.mock('@/utils/auth/useAuth', () => ({
  useAuth: () => ({
    auth: { user: { id: 'user123' } },
    isReady: true,
    isAuthenticated: true,
  }),
}));

jest.mock('@/hooks/useBookings', () => ({
  useUserBookings: () => ({
    bookings: [
      {
        _id: 'booking1',
        pitchName: 'Test Pitch',
        location: 'Test Location',
        date: '2023-06-15',
        startTime: '14:00',
        duration: 2,
        totalPrice: 25000,
        status: 'confirmed',
      },
    ],
    isLoading: false,
    error: null,
  }),
}));

jest.mock('@/utils/errorHandling', () => ({
  useErrorStore: () => ({
    addError: jest.fn(),
  }),
}));

jest.mock('@/utils/cacheStore', () => ({
  useOfflineManager: () => ({
    isOnline: true,
    isCacheLoaded: true,
    bookings: [],
    initOfflineManager: jest.fn(),
    syncWithServer: jest.fn(),
  }),
}));

// Mock navigation
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock color scheme
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => () => 'light');

describe('BookingsScreen', () => {
  it('renders correctly', async () => {
    const { getByText } = render(<BookingsScreen />);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(getByText('My Bookings')).toBeTruthy();
    });
    
    // Check if booking cards are rendered
    expect(getByText('Test Pitch')).toBeTruthy();
    expect(getByText('Booking ID: BOOKING1')).toBeTruthy();
  });
});