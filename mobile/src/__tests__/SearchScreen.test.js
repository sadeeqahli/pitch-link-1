import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import SearchScreen from '../app/(tabs)/search';

// Mock dependencies
jest.mock('@/utils/auth/useAuth', () => ({
  useAuth: () => ({
    auth: { user: { id: 'user123' } },
    isReady: true,
    isAuthenticated: true,
  }),
}));

jest.mock('@/hooks/useConvex', () => ({
  usePitches: () => ({
    pitches: [
      {
        _id: '1',
        name: 'Green Field FC',
        location: 'Lagos, Nigeria',
        pricePerHour: 15000,
        surfaceType: 'Artificial Grass',
        capacity: 5,
        amenities: ['WiFi', 'Parking'],
        images: ['test-image.jpg'],
        rating: 4.8,
        reviewsCount: 124,
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
  useLocalSearchParams: () => ({}),
}));

// Mock color scheme
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => () => 'light');

describe('SearchScreen', () => {
  it('renders correctly', async () => {
    const { getByText, getByPlaceholderText } = render(<SearchScreen />);
    
    // Check if search bar is rendered
    expect(getByPlaceholderText('Search pitches...')).toBeTruthy();
    
    // Wait for the component to load
    await waitFor(() => {
      expect(getByText('1 pitches found')).toBeTruthy();
    });
    
    // Check if pitch cards are rendered
    expect(getByText('Green Field FC')).toBeTruthy();
  });
});