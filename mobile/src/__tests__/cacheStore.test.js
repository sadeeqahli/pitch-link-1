import { useCacheStore, checkNetworkStatus, useOfflineManager } from '../utils/cacheStore';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

// Mock fetch for network status
global.fetch = jest.fn();

describe('cacheStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCacheStore.getState().clearCache();
  });

  describe('useCacheStore', () => {
    it('should initialize with default values', () => {
      const state = useCacheStore.getState();
      
      expect(state.pitches).toEqual([]);
      expect(state.bookings).toEqual([]);
      expect(state.lastUpdated).toBeNull();
      expect(state.isOnline).toBe(true);
      expect(state.isCacheLoaded).toBe(false);
    });

    it('should set pitches', () => {
      const pitches = [{ _id: '1', name: 'Test Pitch' }];
      useCacheStore.getState().setPitches(pitches);
      
      const state = useCacheStore.getState();
      expect(state.pitches).toEqual(pitches);
      expect(state.lastUpdated).toBeDefined();
    });

    it('should set bookings', () => {
      const bookings = [{ _id: '1', pitchName: 'Test Pitch' }];
      useCacheStore.getState().setBookings(bookings);
      
      const state = useCacheStore.getState();
      expect(state.bookings).toEqual(bookings);
      expect(state.lastUpdated).toBeDefined();
    });

    it('should set online status', () => {
      useCacheStore.getState().setOnlineStatus(false);
      
      const state = useCacheStore.getState();
      expect(state.isOnline).toBe(false);
    });
  });

  describe('checkNetworkStatus', () => {
    it('should return true when network is available', async () => {
      global.fetch.mockResolvedValue({ ok: true });
      
      const result = await checkNetworkStatus();
      expect(result).toBe(true);
    });

    it('should return false when network is unavailable', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));
      
      const result = await checkNetworkStatus();
      expect(result).toBe(false);
    });
  });

  describe('useOfflineManager', () => {
    it('should return offline manager functions', () => {
      const manager = useOfflineManager();
      
      expect(typeof manager.initOfflineManager).toBe('function');
      expect(typeof manager.syncWithServer).toBe('function');
      expect(typeof manager.setOnlineStatus).toBe('function');
      expect(manager.isOnline).toBeDefined();
      expect(manager.isCacheLoaded).toBeDefined();
    });
  });
});