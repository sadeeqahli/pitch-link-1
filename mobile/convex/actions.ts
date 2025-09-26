import { action } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import type { ActionCtx } from "./_generated/server";

// Create booking and store payment receipt
export const createBookingWithReceipt = action({
  args: {
    userId: v.id("users"),
    pitchId: v.id("pitches"),
    date: v.string(),
    startTime: v.string(),
    duration: v.number(),
    totalPrice: v.number(),
    paymentInfo: v.object({
      transactionId: v.string(),
      amount: v.number(),
      currency: v.string(),
      paymentMethod: v.string(),
      status: v.string(),
      metadata: v.any(),
    }),
  },
  handler: async (ctx: ActionCtx, args): Promise<{ bookingId: Id<"bookings">; receiptId: Id<"receipts"> }> => {
    // Create the booking using internal mutation
    const bookingId: Id<"bookings"> = await ctx.runMutation(internal.bookings.internalCreateBooking, {
      userId: args.userId,
      pitchId: args.pitchId,
      date: args.date,
      startTime: args.startTime,
      duration: args.duration,
      totalPrice: args.totalPrice,
      status: "confirmed",
    });

    // Create the payment receipt using internal mutation
    const receiptId: Id<"receipts"> = await ctx.runMutation(internal.receipts.internalCreateReceipt, {
      bookingId: bookingId,
      userId: args.userId,
      amount: args.paymentInfo.amount,
      currency: args.paymentInfo.currency,
      paymentMethod: args.paymentInfo.paymentMethod,
      transactionId: args.paymentInfo.transactionId,
      status: args.paymentInfo.status as "successful" | "failed" | "pending",
      metadata: args.paymentInfo.metadata,
    });

    return { bookingId, receiptId };
  },
});