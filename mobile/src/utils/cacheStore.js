import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cache store for offline capabilities
export const useCacheStore = create((set, get) => ({
  // Cache data
  pitches: [],
  bookings: [],
  lastUpdated: null,
  
  // Cache status
  isOnline: true,
  isCacheLoaded: false,
  cacheLoadLogged: false,
  
  // Load cache from AsyncStorage
  loadCache: async () => {
    try {
      const cachedData = await AsyncStorage.getItem('pitchlink_cache');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        set({
          ...parsedData,
          isCacheLoaded: true,
        });
        // Only log once per session
        if (!get().cacheLoadLogged) {
          console.log('Cache loaded successfully');
          set({ cacheLoadLogged: true });
        }
        return parsedData;
      }
      set({ isCacheLoaded: true });
      return null;
    } catch (error) {
      console.error('Error loading cache:', error);
      set({ isCacheLoaded: true });
      return null;
    }
  },
  
  // Save cache to AsyncStorage
  saveCache: async () => {
    try {
      const state = get();
      const cacheData = {
        pitches: state.pitches,
        bookings: state.bookings,
        lastUpdated: state.lastUpdated,
      };
      await AsyncStorage.setItem('pitchlink_cache', JSON.stringify(cacheData));
      // Only log when cache is actually saved
      if (state.pitches.length > 0 || state.bookings.length > 0) {
        console.log('Cache saved successfully');
      }
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  },
  
  // Update pitches cache
  setPitches: (pitches) => {
    set({ 
      pitches,
      lastUpdated: Date.now(),
    });
    // Auto-save cache
    get().saveCache();
  },
  
  // Update bookings cache
  setBookings: (bookings) => {
    set({ 
      bookings,
      lastUpdated: Date.now(),
    });
    // Auto-save cache
    get().saveCache();
  },
  
  // Clear cache
  clearCache: async () => {
    try {
      await AsyncStorage.removeItem('pitchlink_cache');
      set({
        pitches: [],
        bookings: [],
        lastUpdated: null,
      });
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  },
  
  // Set online status
  setOnlineStatus: (isOnline) => {
    set({ isOnline });
  },
}));

// Utility function to check network status
export const checkNetworkStatus = async () => {
  try {
    const response = await fetch('https://www.google.com', { method: 'HEAD', cache: 'no-cache' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Hook to manage offline capabilities
export const useOfflineManager = () => {
  const { 
    isOnline, 
    isCacheLoaded, 
    pitches, 
    bookings, 
    setOnlineStatus, 
    setPitches, 
    setBookings,
    loadCache
  } = useCacheStore();
  
  // Initialize offline manager
  const initOfflineManager = async () => {
    // Load cache
    await loadCache();
    
    // Check initial network status
    const onlineStatus = await checkNetworkStatus();
    setOnlineStatus(onlineStatus);
    
    return { isOnline: onlineStatus, isCacheLoaded: true };
  };
  
  // Sync data with server when coming online
  const syncWithServer = async (serverPitches, serverBookings) => {
    if (!isOnline) return;
    
    let synced = false;
    
    // Update cache with fresh data
    if (serverPitches) {
      // Only update if data has actually changed
      const currentPitches = useCacheStore.getState().pitches;
      const hasChanged = JSON.stringify(currentPitches) !== JSON.stringify(serverPitches);
      
      if (hasChanged) {
        setPitches(serverPitches);
        synced = true;
      }
    }
    
    if (serverBookings) {
      // Only update if data has actually changed
      const currentBookings = useCacheStore.getState().bookings;
      const hasChanged = JSON.stringify(currentBookings) !== JSON.stringify(serverBookings);
      
      if (hasChanged) {
        setBookings(serverBookings);
        synced = true;
      }
    }
    
    // Only log when actual sync happens
    if (synced) {
      console.log('Data synced with server');
    }
  };
  
  return {
    isOnline,
    isCacheLoaded,
    pitches,
    bookings,
    initOfflineManager,
    syncWithServer,
    setOnlineStatus,
  };
};