import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

// Hook for user operations
export const useUsers = () => {
  const createUser = useMutation(api.users.createUser);
  const updateUser = useMutation(api.users.updateUser);
  const saveUserPushToken = useMutation(api.users.saveUserPushToken);

  return {
    createUser,
    updateUser,
    saveUserPushToken,
  };
};

// Hook for authenticating user
export const useAuthenticateUser = (email: string, password: string) => {
  return useQuery(api.users.authenticateUser, { email, password });
};

// Hook for getting user by email (parameterized query)
export const useGetUserByEmail = (email: string) => {
  return useQuery(api.users.getUserByEmail, { email });
};

// Hook for pitch operations
export const usePitches = () => {
  const listPitches = useQuery(api.pitches.listPitches);
  const createPitch = useMutation(api.pitches.createPitch);
  const updatePitch = useMutation(api.pitches.updatePitch);

  return {
    pitches: listPitches,
    createPitch,
    updatePitch,
  };
};

// Hook for getting a specific pitch by ID (parameterized query)
export const useGetPitch = (id: Id<"pitches"> | null | undefined) => {
  // Only call the query if id is provided and valid
  const result = useQuery(
    id ? api.pitches.getPitch : (null as any), 
    id ? { id } : undefined
  );
  
  return { 
    data: result, 
    isLoading: result === undefined && id !== null && id !== undefined, 
    error: result === null && id ? new Error('Pitch not found') : null 
  };
};

// Hook for booking operations
export const useBookings = () => {
  const createBooking = useMutation(api.bookings.createBooking);
  const updateBookingStatus = useMutation(api.bookings.updateBookingStatus);
  const cancelBooking = useMutation(api.bookings.cancelBooking);

  return {
    createBooking,
    updateBookingStatus,
    cancelBooking,
  };
};

// Hook for getting bookings by user ID (parameterized query)
export const useGetBookingsByUser = (userId: Id<"users">) => {
  return useQuery(api.bookings.getBookingsByUser, { userId });
};

// Hook for getting bookings by pitch ID (parameterized query)
export const useGetBookingsByPitch = (pitchId: Id<"pitches">) => {
  return useQuery(api.bookings.getBookingsByPitch, { pitchId });
};

// Hook for getting bookings by date (parameterized query)
export const useGetBookingsByDate = (date: string) => {
  return useQuery(api.bookings.getBookingsByDate, { date });
};

// Hook for getting receipts by user ID (parameterized query)
export const useGetReceiptsByUser = (userId: Id<"users">) => {
  return useQuery(api.receipts.getReceiptsByUser, { userId });
};

// Hook for getting a specific receipt by ID (parameterized query)
export const useGetReceipt = (id: Id<"receipts"> | null | undefined) => {
  // Only call the query if id is provided
  if (!id) {
    return useQuery(null as any);
  }
  return useQuery(api.receipts.getReceipt, { id });
};