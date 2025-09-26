import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { QueryCtx, MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

// Get bookings by user ID
export const getBookingsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx: QueryCtx, args: { userId: Id<"users"> }) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Get bookings by pitch ID
export const getBookingsByPitch = query({
  args: { pitchId: v.id("pitches") },
  handler: async (ctx: QueryCtx, args: { pitchId: Id<"pitches"> }) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_pitch", (q) => q.eq("pitchId", args.pitchId))
      .collect();
  },
});

// Get bookings by date
export const getBookingsByDate = query({
  args: { date: v.string() },
  handler: async (ctx: QueryCtx, args: { date: string }) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
  },
});

// Create a new booking
export const createBooking = mutation({
  args: {
    userId: v.id("users"),
    pitchId: v.id("pitches"),
    date: v.string(),
    startTime: v.string(),
    duration: v.number(),
    totalPrice: v.number(),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("cancelled")),
  },
  handler: async (ctx: MutationCtx, args: {
    userId: Id<"users">;
    pitchId: Id<"pitches">;
    date: string;
    startTime: string;
    duration: number;
    totalPrice: number;
    status: "pending" | "confirmed" | "cancelled";
  }) => {
    const now = Date.now();
    const bookingId = await ctx.db.insert("bookings", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return bookingId;
  },
});
  
// Internal mutation for creating bookings from actions
export const internalCreateBooking = internalMutation({
  args: {
    userId: v.id("users"),
    pitchId: v.id("pitches"),
    date: v.string(),
    startTime: v.string(),
    duration: v.number(),
    totalPrice: v.number(),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("cancelled")),
  },
  handler: async (ctx: MutationCtx, args: {
    userId: Id<"users">;
    pitchId: Id<"pitches">;
    date: string;
    startTime: string;
    duration: number;
    totalPrice: number;
    status: "pending" | "confirmed" | "cancelled";
  }) => {
    const now = Date.now();
    const bookingId = await ctx.db.insert("bookings", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return bookingId;
  },
});

// Update booking status
export const updateBookingStatus = mutation({
  args: {
    bookingId: v.id("bookings"),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("cancelled")),
  },
  handler: async (ctx: MutationCtx, args: {
    bookingId: Id<"bookings">;
    status: "pending" | "confirmed" | "cancelled";
  }) => {
    const now = Date.now();
    await ctx.db.patch(args.bookingId, {
      status: args.status,
      updatedAt: now,
    });
    return args.bookingId;
  },
});

// Cancel a booking
export const cancelBooking = mutation({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx: MutationCtx, args: { bookingId: Id<"bookings"> }) => {
    const now = Date.now();
    await ctx.db.patch(args.bookingId, {
      status: "cancelled",
      updatedAt: now,
    });
    return args.bookingId;
  },
});