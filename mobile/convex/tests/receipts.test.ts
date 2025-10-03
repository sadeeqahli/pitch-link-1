import { test } from "convex/test";
import { expect } from "chai";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";

test("createReceipt creates a new receipt", async ({ db }) => {
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

  // Create a booking
  const bookingId = await db.mutation(api.bookings.createBooking, {
    userId: userId as Id<"users">,
    pitchId: pitchId as Id<"pitches">,
    date: "2023-06-15",
    startTime: "14:00",
    duration: 2,
    totalPrice: 25000,
    status: "confirmed" as const,
  });

  // Create a receipt
  const receiptData = {
    bookingId: bookingId as Id<"bookings">,
    userId: userId as Id<"users">,
    amount: 25000,
    currency: "NGN",
    paymentMethod: "card",
    transactionId: "txn_1234567890",
    status: "successful" as const,
    metadata: { test: "data" },
  };

  const receiptId = await db.mutation(api.receipts.createReceipt, receiptData);

  expect(receiptId).to.be.a("string");

  // Get the receipt
  const receipt = await db.query(api.receipts.getReceipt, { id: receiptId as Id<"receipts"> });
  
  expect(receipt).to.not.be.null;
  expect(receipt!._id).to.equal(receiptId);
  expect(receipt!.bookingId).to.equal(bookingId);
  expect(receipt!.userId).to.equal(userId);
  expect(receipt!.amount).to.equal(25000);
  expect(receipt!.currency).to.equal("NGN");
  expect(receipt!.paymentMethod).to.equal("card");
  expect(receipt!.transactionId).to.equal("txn_1234567890");
  expect(receipt!.status).to.equal("successful");
  expect(receipt!.metadata).to.deep.equal({ test: "data" });
});

test("getReceiptsByUser returns user receipts", async ({ db }) => {
  // Create a user and a few pitches
  const userId = await db.mutation(api.users.createUser, {
    name: "Jane Smith",
    email: "jane@example.com",
  });

  const pitch1Id = await db.mutation(api.pitches.createPitch, {
    name: "City Sports Complex",
    location: "456 Sports Avenue",
    pricePerHour: 15000,
    surfaceType: "Natural Grass",
    capacity: 11,
    amenities: ["WiFi", "Parking"],
    images: ["image2.jpg"],
    rating: 4.6,
    reviewsCount: 89,
  });

  const pitch2Id = await db.mutation(api.pitches.createPitch, {
    name: "Riverside Football Ground",
    location: "789 River Road",
    pricePerHour: 10000,
    surfaceType: "Hybrid Grass",
    capacity: 7,
    amenities: ["Parking"],
    images: ["image3.jpg"],
    rating: 4.7,
    reviewsCount: 67,
  });

  // Create bookings
  const booking1Id = await db.mutation(api.bookings.createBooking, {
    userId: userId as Id<"users">,
    pitchId: pitch1Id as Id<"pitches">,
    date: "2023-06-16",
    startTime: "10:00",
    duration: 1,
    totalPrice: 15000,
    status: "confirmed" as const,
  });

  const booking2Id = await db.mutation(api.bookings.createBooking, {
    userId: userId as Id<"users">,
    pitchId: pitch2Id as Id<"pitches">,
    date: "2023-06-17",
    startTime: "15:00",
    duration: 2,
    totalPrice: 20000,
    status: "confirmed" as const,
  });

  // Create receipts
  const receipt1Id = await db.mutation(api.receipts.createReceipt, {
    bookingId: booking1Id as Id<"bookings">,
    userId: userId as Id<"users">,
    amount: 15000,
    currency: "NGN",
    paymentMethod: "card",
    transactionId: "txn_1111111111",
    status: "successful" as const,
    metadata: { paymentType: "card" },
  });

  const receipt2Id = await db.mutation(api.receipts.createReceipt, {
    bookingId: booking2Id as Id<"bookings">,
    userId: userId as Id<"users">,
    amount: 20000,
    currency: "NGN",
    paymentMethod: "banktransfer",
    transactionId: "txn_2222222222",
    status: "successful" as const,
    metadata: { paymentType: "banktransfer" },
  });

  // Get receipts by user
  const userReceipts = await db.query(api.receipts.getReceiptsByUser, { userId: userId as Id<"users"> });
  
  expect(userReceipts).to.be.an("array");
  expect(userReceipts.length).to.equal(2);
  
  const receipt1 = userReceipts.find(r => r._id === receipt1Id);
  const receipt2 = userReceipts.find(r => r._id === receipt2Id);
  
  expect(receipt1).to.not.be.undefined;
  expect(receipt1!.bookingId).to.equal(booking1Id);
  expect(receipt1!.paymentMethod).to.equal("card");
  
  expect(receipt2).to.not.be.undefined;
  expect(receipt2!.bookingId).to.equal(booking2Id);
  expect(receipt2!.paymentMethod).to.equal("banktransfer");
});

test("getReceipt returns specific receipt", async ({ db }) => {
  // Create a user and a pitch
  const userId = await db.mutation(api.users.createUser, {
    name: "John Doe",
    email: "john@example.com",
  });

  const pitchId = await db.mutation(api.pitches.createPitch, {
    name: "Elite Football Academy",
    location: "321 Elite Boulevard",
    pricePerHour: 17500,
    surfaceType: "Artificial Turf",
    capacity: 5,
    amenities: ["WiFi", "Parking", "Changing Rooms"],
    images: ["image4.jpg"],
    rating: 4.9,
    reviewsCount: 156,
  });

  // Create a booking
  const bookingId = await db.mutation(api.bookings.createBooking, {
    userId: userId as Id<"users">,
    pitchId: pitchId as Id<"pitches">,
    date: "2023-06-18",
    startTime: "09:00",
    duration: 1,
    totalPrice: 17500,
    status: "confirmed" as const,
  });

  // Create a receipt
  const receiptId = await db.mutation(api.receipts.createReceipt, {
    bookingId: bookingId as Id<"bookings">,
    userId: userId as Id<"users">,
    amount: 17500,
    currency: "NGN",
    paymentMethod: "card",
    transactionId: "txn_3333333333",
    status: "successful" as const,
    metadata: { test: "receipt" },
  });

  // Get the specific receipt
  const receipt = await db.query(api.receipts.getReceipt, { id: receiptId as Id<"receipts"> });
  
  expect(receipt).to.not.be.null;
  expect(receipt!._id).to.equal(receiptId);
  expect(receipt!.bookingId).to.equal(bookingId);
  expect(receipt!.userId).to.equal(userId);
  expect(receipt!.amount).to.equal(17500);
  expect(receipt!.status).to.equal("successful");
});

test("getReceipt returns null for non-existent receipt", async ({ db }) => {
  // Try to get a non-existent receipt
  const receipt = await db.query(api.receipts.getReceipt, { id: "receipts_nonexistent_id" as Id<"receipts"> });
  
  expect(receipt).to.be.null;
});

test("internalCreateReceipt creates a receipt through internal mutation", async ({ db }) => {
  // First create a user and a pitch
  const userId = await db.mutation(api.users.createUser, {
    name: "John Doe",
    email: "john@example.com",
  });

  const pitchId = await db.mutation(api.pitches.createPitch, {
    name: "Test Pitch",
    location: "Test Location",
    pricePerHour: 10000,
    surfaceType: "Artificial Grass",
    capacity: 5,
    amenities: ["WiFi"],
    images: ["test.jpg"],
    rating: 4.5,
    reviewsCount: 10,
  });

  // Create a booking
  const bookingId = await db.mutation(api.bookings.createBooking, {
    userId: userId as Id<"users">,
    pitchId: pitchId as Id<"pitches">,
    date: "2023-06-19",
    startTime: "12:00",
    duration: 1,
    totalPrice: 10000,
    status: "confirmed" as const,
  });

  // Create a receipt through internal mutation
  const receiptData = {
    bookingId: bookingId as Id<"bookings">,
    userId: userId as Id<"users">,
    amount: 10000,
    currency: "NGN",
    paymentMethod: "card",
    transactionId: "txn_4444444444",
    status: "successful" as const,
    metadata: { internal: "test" },
  };

  const receiptId = await db.mutation(api.receipts.internalCreateReceipt, receiptData);

  expect(receiptId).to.be.a("string");

  // Get the receipt
  const receipt = await db.query(api.receipts.getReceipt, { id: receiptId as Id<"receipts"> });
  
  expect(receipt).to.not.be.null;
  expect(receipt!._id).to.equal(receiptId);
  expect(receipt!.bookingId).to.equal(bookingId);
  expect(receipt!.userId).to.equal(userId);
  expect(receipt!.amount).to.equal(10000);
  expect(receipt!.status).to.equal("successful");
});