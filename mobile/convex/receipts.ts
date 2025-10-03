import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

// Create a new payment receipt
export const createReceipt = mutation({
  args: {
    bookingId: v.id("bookings"),
    userId: v.id("users"),
    amount: v.number(),
    currency: v.string(),
    paymentMethod: v.string(),
    transactionId: v.string(),
    status: v.union(v.literal("successful"), v.literal("failed"), v.literal("pending")),
    metadata: v.any(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const receiptId = await ctx.db.insert("receipts", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return receiptId;
  },
});

// Internal mutation for creating receipts from actions
export const internalCreateReceipt = internalMutation({
  args: {
    bookingId: v.id("bookings"),
    userId: v.id("users"),
    amount: v.number(),
    currency: v.string(),
    paymentMethod: v.string(),
    transactionId: v.string(),
    status: v.union(v.literal("successful"), v.literal("failed"), v.literal("pending")),
    metadata: v.any(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const receiptId = await ctx.db.insert("receipts", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return receiptId;
  },
});

// Get receipt by ID
export const getReceipt = query({
  args: { id: v.optional(v.id("receipts")) },
  handler: async (ctx, args) => {
    if (!args.id) return null;
    return await ctx.db.get(args.id);
  },
});

// Get receipts by user
export const getReceiptsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("receipts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});