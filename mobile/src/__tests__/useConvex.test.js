import { renderHook } from '@testing-library/react-native';
import { usePitches, useGetPitch, useBookings, useGetBookingsByUser } from '../hooks/useConvex';

// Mock convex
jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

// Mock api
jest.mock('../../convex/_generated/api', () => ({
  api: {
    pitches: {
      listPitches: 'listPitches',
      getPitch: 'getPitch',
      createPitch: 'createPitch',
      updatePitch: 'updatePitch',
    },
    users: {
      createUser: 'createUser',
      updateUser: 'updateUser',
      saveUserPushToken: 'saveUserPushToken',
    },
    bookings: {
      createBooking: 'createBooking',
      updateBookingStatus: 'updateBookingStatus',
      cancelBooking: 'cancelBooking',
      getBookingsByUser: 'getBookingsByUser',
      getBookingsByPitch: 'getBookingsByPitch',
      getBookingsByDate: 'getBookingsByDate',
    },
    receipts: {
      getReceiptsByUser: 'getReceiptsByUser',
      getReceipt: 'getReceipt',
    },
  },
}));

describe('useConvex', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('usePitches', () => {
    it('returns pitches data', () => {
      const mockPitches = [{ _id: '1', name: 'Test Pitch' }];
      require('convex/react').useQuery.mockReturnValue(mockPitches);
      require('convex/react').useMutation.mockReturnValue(jest.fn());
      
      const { result } = renderHook(() => usePitches());
      
      expect(result.current.pitches).toEqual(mockPitches);
      expect(typeof result.current.createPitch).toBe('function');
      expect(typeof result.current.updatePitch).toBe('function');
    });
  });

  describe('useGetPitch', () => {
    it('returns pitch data when id is provided', () => {
      const mockPitch = { _id: '1', name: 'Test Pitch' };
      require('convex/react').useQuery.mockReturnValue(mockPitch);
      
      const { result } = renderHook(() => useGetPitch('1'));
      
      expect(result.current.data).toEqual(mockPitch);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('returns loading state when data is undefined', () => {
      require('convex/react').useQuery.mockReturnValue(undefined);
      
      const { result } = renderHook(() => useGetPitch('1'));
      
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useBookings', () => {
    it('returns booking mutations', () => {
      const mockMutation = jest.fn();
      require('convex/react').useMutation.mockReturnValue(mockMutation);
      
      const { result } = renderHook(() => useBookings());
      
      expect(typeof result.current.createBooking).toBe('function');
      expect(typeof result.current.updateBookingStatus).toBe('function');
      expect(typeof result.current.cancelBooking).toBe('function');
    });
  });

  describe('useGetBookingsByUser', () => {
    it('returns user bookings', () => {
      const mockBookings = [{ _id: '1', userId: 'user1' }];
      require('convex/react').useQuery.mockReturnValue(mockBookings);
      
      const { result } = renderHook(() => useGetBookingsByUser('user1'));
      
      expect(result.current).toEqual(mockBookings);
    });
  });
});