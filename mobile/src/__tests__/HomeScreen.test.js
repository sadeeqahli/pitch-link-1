import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../app/(tabs)/home';

// Mock dependencies
jest.mock('@/utils/auth/useAuth', () => ({
  useAuth: () => ({
    auth: { user: { id: 'user123', name: 'Test User' } },
    isReady: true,
    isAuthenticated: true,
  }),
}));

jest.mock('@/hooks/useConvex', () => ({
  usePitches: () => ({
    pitches: [
      {
        _id: '1',
        name: 'Test Pitch',
        location: 'Test Location',
        pricePerHour: 10000,
        surfaceType: 'Artificial Grass',
        capacity: 5,
        amenities: ['WiFi'],
        images: ['test-image.jpg'],
        rating: 4.5,
        reviewsCount: 10,
      },
    ],
    error: null,
    isLoading: false,
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
    pitches: [],
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

describe('HomeScreen', () => {
  it('renders correctly', async () => {
    const { getByText, getByTestId } = render(<HomeScreen />);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(getByText('Find the perfect pitch')).toBeTruthy();
    });
    
    // Check if pitch cards are rendered
    expect(getByText('Test Pitch')).toBeTruthy();
  });
});