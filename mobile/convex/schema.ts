import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),
  
  // Payment receipts table
  receipts: defineTable({
    bookingId: v.id("bookings"),
    userId: v.id("users"),
    amount: v.number(),
    currency: v.string(),
    paymentMethod: v.string(),
    transactionId: v.string(),
    status: v.union(v.literal("successful"), v.literal("failed"), v.literal("pending")),
    metadata: v.any(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]).index("by_booking", ["bookingId"]),
  
  // Pitches table
  pitches: defineTable({
    name: v.string(),
    location: v.string(),
    pricePerHour: v.number(),
    surfaceType: v.string(),
    capacity: v.number(),
    amenities: v.array(v.string()),
    images: v.array(v.string()),
    rating: v.number(),
    reviewsCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
  
  // Bookings table
  bookings: defineTable({
    userId: v.id("users"),
    pitchId: v.id("pitches"),
    date: v.string(),
    startTime: v.string(),
    duration: v.number(),
    totalPrice: v.number(),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("cancelled")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]).index("by_pitch", ["pitchId"]).index("by_date", ["date"]),
  
  // Reviews table
  reviews: defineTable({
    userId: v.id("users"),
    pitchId: v.id("pitches"),
    rating: v.number(),
    comment: v.string(),
    createdAt: v.number(),
  }).index("by_pitch", ["pitchId"]).index("by_user", ["userId"]),
});