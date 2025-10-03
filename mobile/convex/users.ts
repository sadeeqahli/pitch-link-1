import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

// Get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    return user;
  },
});

// Create a new user
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      phone: args.phone,
      createdAt: now,
      updatedAt: now,
    });
    return userId;
  },
});

// Update user
export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.userId, {
      ...(args.name && { name: args.name }),
      ...(args.phone && { phone: args.phone }),
      updatedAt: now,
    });
    return args.userId;
  },
});

// Save user push token
export const saveUserPushToken = mutation({
  args: {
    userId: v.id("users"),
    pushToken: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.userId, {
      pushToken: args.pushToken,
      updatedAt: now,
    });
    return args.userId;
  },
});

// Authenticate user (simplified for demo purposes)
export const authenticateUser = query({
  args: { 
    email: v.string(),
    password: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    
    // In a real app, you would hash and compare passwords
    // For this demo, we're just checking if the user exists
    if (user) {
      return {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          createdAt: user.createdAt,
        }
      };
    }
    
    return {
      success: false,
      error: "User not found"
    };
  },
});