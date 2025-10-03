import { test } from "convex/test";
import { expect } from "chai";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";

test("createBookingWithReceipt creates both booking and receipt", async ({ db }) => {
  // First create a user and a pitch
  const userId = await db.mutation(api.users.createUser, {
    name: "John Doe",
    email: "john@example.com",
  });

  const pitchId = await db.mutation(api.pitches.createPitch, {
    name: "Greenfield Stadium",
    location: "123 Football Street",
    pricePerHour: 12500,
    surfaceType: "Artificial Grass",
    capacity: 5,
    amenities: ["WiFi", "Parking"],
    images: ["image1.jpg"],
    rating: 4.8,
    reviewsCount: 124,
  });

  // Use action to create booking with receipt
  const result = await db.action(api.actions.createBookingWithReceipt, {
    userId: userId as Id<"users">,
    pitchId: pitchId as Id<"pitches">,
    date: "2023-06-15",
    startTime: "14:00",
    duration: 2,
    totalPrice: 25000,
    paymentInfo: {
      transactionId: "txn_1234567890",
      amount: 25000,
      currency: "NGN",
      paymentMethod: "card",
      status: "successful",
      metadata: { test: "data" },
    },
  });

  expect(result).to.have.property("bookingId");
  expect(result).to.have.property("receiptId");
  expect(result.bookingId).to.be.a("string");
  expect(result.receiptId).to.be.a("string");

  // Verify booking was created
  const booking = await db.query(api.bookings.getBookingsByUser, { userId: userId as Id<"users"> });
  
  expect(booking).to.be.an("array");
  expect(booking.length).to.equal(1);
  expect(booking[0]._id).to.equal(result.bookingId);
  expect(booking[0].userId).to.equal(userId);
  expect(booking[0].pitchId).to.equal(pitchId);
  expect(booking[0].date).to.equal("2023-06-15");
  expect(booking[0].startTime).to.equal("14:00");
  expect(booking[0].duration).to.equal(2);
  expect(booking[0].totalPrice).to.equal(25000);
  expect(booking[0].status).to.equal("confirmed");

  // Verify receipt was created
  const receipt = await db.query(api.receipts.getReceipt, { id: result.receiptId as Id<"receipts"> });
  
  expect(receipt).to.not.be.null;
  expect(receipt!._id).to.equal(result.receiptId);
  expect(receipt!.bookingId).to.equal(result.bookingId);
  expect(receipt!.userId).to.equal(userId);
  expect(receipt!.amount).to.equal(25000);
  expect(receipt!.currency).to.equal("NGN");
  expect(receipt!.paymentMethod).to.equal("card");
  expect(receipt!.transactionId).to.equal("txn_1234567890");
  expect(receipt!.status).to.equal("successful");
  expect(receipt!.metadata).to.deep.equal({ test: "data" });
});