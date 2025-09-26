import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { QueryCtx, MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

// Get all pitches
export const listPitches = query({
  handler: async (ctx: QueryCtx) => {
    return await ctx.db.query("pitches").collect();
  },
});

// Get pitch by ID
export const getPitch = query({
  args: { id: v.id("pitches") },
  handler: async (ctx: QueryCtx, args: { id: Id<"pitches"> }) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new pitch
export const createPitch = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    pricePerHour: v.number(),
    surfaceType: v.string(),
    capacity: v.number(),
    amenities: v.array(v.string()),
    images: v.array(v.string()),
    rating: v.number(),
    reviewsCount: v.number(),
  },
  handler: async (ctx: MutationCtx, args: {
    name: string;
    location: string;
    pricePerHour: number;
    surfaceType: string;
    capacity: number;
    amenities: string[];
    images: string[];
    rating: number;
    reviewsCount: number;
  }) => {
    const now = Date.now();
    const pitchId = await ctx.db.insert("pitches", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return pitchId;
  },
});

// Update a pitch
export const updatePitch = mutation({
  args: {
    id: v.id("pitches"),
    name: v.optional(v.string()),
    location: v.optional(v.string()),
    pricePerHour: v.optional(v.number()),
    surfaceType: v.optional(v.string()),
    capacity: v.optional(v.number()),
    amenities: v.optional(v.array(v.string())),
    images: v.optional(v.array(v.string())),
    rating: v.optional(v.number()),
    reviewsCount: v.optional(v.number()),
  },
  handler: async (ctx: MutationCtx, args: {
    id: Id<"pitches">;
    name?: string;
    location?: string;
    pricePerHour?: number;
    surfaceType?: string;
    capacity?: number;
    amenities?: string[];
    images?: string[];
    rating?: number;
    reviewsCount?: number;
  }) => {
    const now = Date.now();
    await ctx.db.patch(args.id, {
      ...args,
      updatedAt: now,
    });
    return args.id;
  },
});