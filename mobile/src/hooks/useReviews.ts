import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

// Mock data for reviews since we don't have a reviews API yet
const mockReviews = [
  {
    _id: "1",
    pitchId: "pitch1",
    pitchName: "Green Field FC",
    pitchImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
    pitchLocation: "Lagos, Nigeria",
    userId: "user1",
    userName: "John Doe",
    rating: 5,
    comment: "Amazing pitch! Well maintained and great facilities. Will definitely book again.",
    createdAt: Date.now() - 86400000, // 1 day ago
  },
  {
    _id: "2",
    pitchId: "pitch2",
    pitchName: "Blue Moon Arena",
    pitchImage: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
    pitchLocation: "Abuja, Nigeria",
    userId: "user1",
    userName: "John Doe",
    rating: 4,
    comment: "Good pitch with excellent lighting. The changing rooms could use some improvement.",
    createdAt: Date.now() - 172800000, // 2 days ago
  },
  {
    _id: "3",
    pitchId: "pitch3",
    pitchName: "Red Devils Stadium",
    pitchImage: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=600&fit=crop",
    pitchLocation: "Port Harcourt, Nigeria",
    userId: "user1",
    userName: "John Doe",
    rating: 3,
    comment: "Decent pitch but quite far from the city center. Parking was a bit challenging.",
    createdAt: Date.now() - 259200000, // 3 days ago
  },
];

// Hook for getting reviews by user ID
export const useUserReviews = (userId: Id<"users"> | undefined) => {
  // In a real app, you would use:
  // const reviews = useQuery(api.reviews.getReviewsByUser, { userId });
  
  // For now, we'll use mock data
  const reviews = userId ? mockReviews : [];
  
  return {
    reviews,
    isLoading: false,
    error: null,
  };
};

// Hook for getting reviews by pitch ID
export const usePitchReviews = (pitchId: Id<"pitches"> | undefined) => {
  // In a real app, you would use:
  // const reviews = useQuery(api.reviews.getReviewsByPitch, { pitchId });
  
  // For now, we'll use mock data
  const reviews = pitchId ? mockReviews.filter(review => review.pitchId === pitchId) : [];
  
  return {
    reviews,
    isLoading: false,
    error: null,
  };
};

// Hook for creating a new review
export const useCreateReview = () => {
  // In a real app, you would use:
  // const createReview = useMutation(api.reviews.createReview);
  
  // For now, we'll mock the function
  const createReview = async (reviewData: any) => {
    console.log("Creating review:", reviewData);
    return "review-id";
  };
  
  return { createReview };
};

// Hook for updating a review
export const useUpdateReview = () => {
  // In a real app, you would use:
  // const updateReview = useMutation(api.reviews.updateReview);
  
  // For now, we'll mock the function
  const updateReview = async (reviewId: string, reviewData: any) => {
    console.log("Updating review:", reviewId, reviewData);
    return reviewId;
  };
  
  return { updateReview };
};

// Hook for deleting a review
export const useDeleteReview = () => {
  // In a real app, you would use:
  // const deleteReview = useMutation(api.reviews.deleteReview);
  
  // For now, we'll mock the function
  const deleteReview = async (reviewId: string) => {
    console.log("Deleting review:", reviewId);
    return reviewId;
  };
  
  return { deleteReview };
};