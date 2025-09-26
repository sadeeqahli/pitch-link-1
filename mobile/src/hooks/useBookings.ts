import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useAuth } from "../utils/auth/useAuth";

// Custom hook to fetch user bookings with receipts
export const useUserBookings = () => {
  const { auth } = useAuth();
  
  // Check if we have a valid Convex user ID
  const hasValidUserId = auth?.user?.id && 
    !auth.user.id.startsWith('user_') && 
    auth.user.id.length > 20;
  
  // Fetch bookings - only call if we have a proper Convex ID
  const bookingsQuery = hasValidUserId
    ? useQuery(api.bookings.getBookingsByUser, { userId: auth.user.id as Id<"users"> })
    : null;
  
  // Fetch receipts - only call if we have a proper Convex ID
  const receiptsQuery = hasValidUserId
    ? useQuery(api.receipts.getReceiptsByUser, { userId: auth.user.id as Id<"users"> })
    : null;
  
  // Combine bookings with their receipts
  const enrichedBookings = Array.isArray(bookingsQuery) && hasValidUserId
    ? bookingsQuery.map((booking: any) => {
        const receipt = Array.isArray(receiptsQuery) 
          ? receiptsQuery.find((r: any) => r.bookingId === booking._id)
          : null;
        return {
          ...booking,
          receipt: receipt || null
        };
      })
    : [];
  
  return {
    bookings: enrichedBookings,
    isLoading: hasValidUserId ? (!bookingsQuery || !receiptsQuery) : false,
    error: null
  };
};