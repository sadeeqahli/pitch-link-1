import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Seed data for pitches
const seedPitches = [
  {
    name: "Greenfield Stadium",
    location: "123 Football Street, Lagos, Nigeria",
    pricePerHour: 12500,
    surfaceType: "Artificial Grass",
    capacity: 5,
    amenities: ["WiFi", "Parking", "Changing Rooms", "Floodlights"],
    images: [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=600&fit=crop",
    ],
    rating: 4.8,
    reviewsCount: 124,
  },
  {
    name: "City Sports Complex",
    location: "456 Sports Avenue, Lagos, Nigeria",
    pricePerHour: 15000,
    surfaceType: "Natural Grass",
    capacity: 11,
    amenities: ["WiFi", "Parking", "Changing Rooms", "Cafeteria", "Showers"],
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=600&fit=crop",
    ],
    rating: 4.6,
    reviewsCount: 89,
  },
  {
    name: "Riverside Football Ground",
    location: "789 River Road, Lagos, Nigeria",
    pricePerHour: 10000,
    surfaceType: "Hybrid Grass",
    capacity: 7,
    amenities: ["Parking", "Changing Rooms", "Floodlights"],
    images: [
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
    ],
    rating: 4.7,
    reviewsCount: 67,
  },
  {
    name: "Elite Football Academy",
    location: "321 Elite Boulevard, Lagos, Nigeria",
    pricePerHour: 17500,
    surfaceType: "Artificial Turf",
    capacity: 5,
    amenities: ["WiFi", "Parking", "Changing Rooms", "Floodlights", "Gym", "Cafeteria"],
    images: [
      "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
    ],
    rating: 4.9,
    reviewsCount: 156,
  },
  {
    name: "Parkside Pitch",
    location: "654 Park Lane, Lagos, Nigeria",
    pricePerHour: 11000,
    surfaceType: "Natural Grass",
    capacity: 11,
    amenities: ["WiFi", "Parking", "Changing Rooms"],
    images: [
      "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
    ],
    rating: 4.5,
    reviewsCount: 78,
  },
];

// Function to seed the database
export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Create pitches
    const pitchIds = [];
    for (const pitchData of seedPitches) {
      const pitchId = await ctx.db.insert("pitches", {
        ...pitchData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      pitchIds.push(pitchId);
      console.log(`Created pitch: ${pitchData.name} with ID: ${pitchId}`);
    }

    // Create some sample users
    const userId1 = await ctx.db.insert("users", {
      name: "John Doe",
      email: "john@example.com",
      phone: "+2341234567890",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    console.log(`Created user: John Doe with ID: ${userId1}`);

    const userId2 = await ctx.db.insert("users", {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+2340987654321",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    console.log(`Created user: Jane Smith with ID: ${userId2}`);

    // Create some sample bookings
    const bookingId1 = await ctx.db.insert("bookings", {
      userId: userId1,
      pitchId: pitchIds[0],
      date: "2023-06-15",
      startTime: "14:00",
      duration: 2,
      totalPrice: 25000,
      status: "confirmed",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    console.log(`Created booking with ID: ${bookingId1}`);

    const bookingId2 = await ctx.db.insert("bookings", {
      userId: userId2,
      pitchId: pitchIds[1],
      date: "2023-06-16",
      startTime: "10:00",
      duration: 1,
      totalPrice: 15000,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    console.log(`Created booking with ID: ${bookingId2}`);

    console.log("Database seeding completed!");
    return "Database seeding completed!";
  },
});