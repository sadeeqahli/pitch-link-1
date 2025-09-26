import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

// Mock data for initial state
const mockBookings = [
  {
    id: '1',
    pitchId: '1',
    pitchName: 'Greenfield Stadium',
    date: '2023-06-15',
    startTime: '14:00',
    duration: 2,
    totalPrice: 25000,
    status: 'confirmed',
    location: '123 Football Street, Lagos',
    receipt: {
      id: 'r1',
      transactionId: 'FLW123456789',
      amount: 25000,
      currency: 'NGN',
      paymentMethod: 'card',
      status: 'successful',
      createdAt: '2023-06-10T14:30:00Z',
    },
  },
  {
    id: '2',
    pitchId: '2',
    pitchName: 'City Sports Complex',
    date: '2023-06-20',
    startTime: '10:00',
    duration: 1,
    totalPrice: 12500,
    status: 'completed',
    location: '456 Sports Avenue, Lagos',
    receipt: {
      id: 'r2',
      transactionId: 'FLW987654321',
      amount: 12500,
      currency: 'NGN',
      paymentMethod: 'banktransfer',
      status: 'successful',
      createdAt: '2023-06-15T10:15:00Z',
    },
  },
  {
    id: '3',
    pitchId: '3',
    pitchName: 'Riverside Football Ground',
    date: '2023-06-25',
    startTime: '16:00',
    duration: 1,
    totalPrice: 10000,
    status: 'pending',
    location: '789 River Road, Lagos',
    receipt: null,
  },
];

const bookingStoreKey = 'pitchlink-bookings';

export const useBookingStore = create((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,
  
  // Load bookings from storage or use mock data
  loadBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would fetch from Convex
      // For now, we'll use mock data
      const storedBookings = await SecureStore.getItemAsync(bookingStoreKey);
      const bookings = storedBookings ? JSON.parse(storedBookings) : mockBookings;
      set({ bookings, isLoading: false });
    } catch (error) {
      console.error('Error loading bookings:', error);
      set({ bookings: mockBookings, isLoading: false, error: 'Failed to load bookings' });
    }
  },
  
  // Save bookings to storage
  saveBookings: async (bookings) => {
    try {
      await SecureStore.setItemAsync(bookingStoreKey, JSON.stringify(bookings));
    } catch (error) {
      console.error('Error saving bookings:', error);
    }
  },
  
  // Add a new booking
  addBooking: async (bookingData) => {
    const { bookings, saveBookings } = get();
    const newBooking = {
      id: `booking_${Date.now()}`,
      ...bookingData,
      createdAt: new Date().toISOString(),
    };
    
    const updatedBookings = [...bookings, newBooking];
    set({ bookings: updatedBookings });
    await saveBookings(updatedBookings);
    return newBooking;
  },
  
  // Update booking status
  updateBookingStatus: async (bookingId, status) => {
    const { bookings, saveBookings } = get();
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status } : booking
    );
    set({ bookings: updatedBookings });
    await saveBookings(updatedBookings);
  },
  
  // Cancel a booking
  cancelBooking: async (bookingId) => {
    const { bookings, saveBookings } = get();
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
    );
    set({ bookings: updatedBookings });
    await saveBookings(updatedBookings);
  },
  
  // Get categorized bookings
  getCategorizedBookings: () => {
    const { bookings } = get();
    
    const confirmed = bookings.filter(booking => booking.status === 'confirmed');
    const completed = bookings.filter(booking => booking.status === 'completed');
    const pending = bookings.filter(booking => booking.status === 'pending');
    const cancelled = bookings.filter(booking => booking.status === 'cancelled');
    
    return {
      all: bookings,
      confirmed,
      completed,
      pending,
      cancelled,
    };
  },
  
  // Search bookings
  searchBookings: (query, filters = {}) => {
    const { bookings } = get();
    
    return bookings.filter(booking => {
      // Search query match
      const matchesQuery = !query || 
        booking.pitchName.toLowerCase().includes(query.toLowerCase()) ||
        booking.location.toLowerCase().includes(query.toLowerCase());
      
      // Status filter
      const matchesStatus = !filters.status || filters.status.length === 0 || 
        filters.status.includes('all') || 
        filters.status.includes(booking.status);
      
      return matchesQuery && matchesStatus;
    });
  },
  
  // Clear error
  clearError: () => set({ error: null }),
}));

// UI store for booking-related UI state
export const useBookingUIStore = create((set) => ({
  selectedTab: 'all',
  selectedBooking: null,
  isReceiptVisible: false,
  
  setSelectedTab: (tab) => set({ selectedTab: tab }),
  showReceipt: (booking) => set({ selectedBooking: booking, isReceiptVisible: true }),
  hideReceipt: () => set({ isReceiptVisible: false, selectedBooking: null }),
}));

// Pricing calculation utility
export const calculatePricing = (basePricePerHour, duration, isFirstTimeUser = false) => {
  // Calculate subtotal based on base price and duration
  const subtotal = basePricePerHour * duration;
  
  // Service fee is 5% of subtotal
  const serviceFee = Math.round(subtotal * 0.05);
  
  // First-time booking discount (10% of subtotal)
  const firstBookingDiscount = isFirstTimeUser ? Math.round(subtotal * 0.10) : 0;
  
  // Duration discount for bookings longer than 1 hour (5% of subtotal)
  const durationDiscount = duration > 1 ? Math.round(subtotal * 0.05) : 0;
  
  // Calculate total with all discounts applied
  const total = subtotal + serviceFee - firstBookingDiscount - durationDiscount;
  
  return {
    subtotal,
    serviceFee,
    firstBookingDiscount,
    durationDiscount,
    total,
  };
};
