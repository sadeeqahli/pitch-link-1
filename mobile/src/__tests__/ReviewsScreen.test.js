import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ReviewsScreen from '../app/(tabs)/reviews';

// Mock dependencies
jest.mock('@/utils/auth/useAuth', () => ({
  useAuth: () => ({
    auth: { user: { id: 'user123' } },
    isReady: true,
    isAuthenticated: true,
  }),
}));

jest.mock('@/hooks/useReviews', () => ({
  useUserReviews: () => ({
    reviews: [
      {
        _id: '1',
        pitchId: 'pitch1',
        pitchName: 'Green Field FC',
        pitchImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
        pitchLocation: 'Lagos, Nigeria',
        userId: 'user123',
        userName: 'John Doe',
        rating: 5,
        comment: 'Amazing pitch! Well maintained and great facilities.',
        createdAt: Date.now() - 86400000,
      },
    ],
    isLoading: false,
    error: null,
  }),
}));

// Mock navigation
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));

// Mock color scheme
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => () => 'light');

describe('ReviewsScreen', () => {
  it('renders correctly', async () => {
    const { getByText } = render(<ReviewsScreen />);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(getByText('My Reviews')).toBeTruthy();
    });
    
    // Check if review cards are rendered
    expect(getByText('Green Field FC')).toBeTruthy();
    expect(getByText('Amazing pitch! Well maintained and great facilities.')).toBeTruthy();
  });
});