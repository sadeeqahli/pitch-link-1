import { test } from "convex/test";
import { expect } from "chai";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";

test("createBooking creates a new booking", async ({ db }) => {
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
  const bookingData = {
    userId: userId as Id<"users">,
    pitchId: pitchId as Id<"pitches">,
    date: "2023-06-15",
    startTime: "14:00",
    duration: 2,
    totalPrice: 25000,
    status: "confirmed" as const,
  };

  const bookingId = await db.mutation(api.bookings.createBooking, bookingData);

  expect(bookingId).to.be.a("string");

  // Get bookings by user
  const userBookings = await db.query(api.bookings.getBookingsByUser, { userId: userId as Id<"users"> });
  
  expect(userBookings).to.be.an("array");
  expect(userBookings.length).to.equal(1);
  expect(userBookings[0]._id).to.equal(bookingId);
  expect(userBookings[0].userId).to.equal(userId);
  expect(userBookings[0].pitchId).to.equal(pitchId);
  expect(userBookings[0].date).to.equal(bookingData.date);
  expect(userBookings[0].startTime).to.equal(bookingData.startTime);
  expect(userBookings[0].duration).to.equal(bookingData.duration);
  expect(userBookings[0].totalPrice).to.equal(bookingData.totalPrice);
  expect(userBookings[0].status).to.equal(bookingData.status);
});

test("getBookingsByUser returns user bookings", async ({ db }) => {
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
    status: "pending" as const,
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

  // Get bookings by user
  const userBookings = await db.query(api.bookings.getBookingsByUser, { userId: userId as Id<"users"> });
  
  expect(userBookings).to.be.an("array");
  expect(userBookings.length).to.equal(2);
  
  const booking1 = userBookings.find(b => b._id === booking1Id);
  const booking2 = userBookings.find(b => b._id === booking2Id);
  
  expect(booking1).to.not.be.undefined;
  expect(booking1!.pitchId).to.equal(pitch1Id);
  expect(booking1!.status).to.equal("pending");
  
  expect(booking2).to.not.be.undefined;
  expect(booking2!.pitchId).to.equal(pitch2Id);
  expect(booking2!.status).to.equal("confirmed");
});

test("getBookingsByPitch returns pitch bookings", async ({ db }) => {
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

  // Create bookings for the same pitch
  const booking1Id = await db.mutation(api.bookings.createBooking, {
    userId: userId as Id<"users">,
    pitchId: pitchId as Id<"pitches">,
    date: "2023-06-18",
    startTime: "09:00",
    duration: 1,
    totalPrice: 17500,
    status: "confirmed" as const,
  });

  const booking2Id = await db.mutation(api.bookings.createBooking, {
    userId: userId as Id<"users">,
    pitchId: pitchId as Id<"pitches">,
    date: "2023-06-19",
    startTime: "16:00",
    duration: 2,
    totalPrice: 35000,
    status: "pending" as const,
  });

  // Get bookings by pitch
  const pitchBookings = await db.query(api.bookings.getBookingsByPitch, { pitchId: pitchId as Id<"pitches"> });
  
  expect(pitchBookings).to.be.an("array");
  expect(pitchBookings.length).to.equal(2);
  
  const booking1 = pitchBookings.find(b => b._id === booking1Id);
  const booking2 = pitchBookings.find(b => b._id === booking2Id);
  
  expect(booking1).to.not.be.undefined;
  expect(booking1!.userId).to.equal(userId);
  expect(booking1!.status).to.equal("confirmed");
  
  expect(booking2).to.not.be.undefined;
  expect(booking2!.userId).to.equal(userId);
  expect(booking2!.status).to.equal("pending");
});

test("getBookingsByDate returns bookings for a date", async ({ db }) => {
  // Create users and a pitch
  const user1Id = await db.mutation(api.users.createUser, {
    name: "John Doe",
    email: "john@example.com",
  });

  const user2Id = await db.mutation(api.users.createUser, {
    name: "Jane Smith",
    email: "jane@example.com",
  });

  const pitchId = await db.mutation(api.pitches.createPitch, {
    name: "Parkside Pitch",
    location: "654 Park Lane",
    pricePerHour: 11000,
    surfaceType: "Natural Grass",
    capacity: 11,
    amenities: ["WiFi", "Parking"],
    images: ["image5.jpg"],
    rating: 4.5,
    reviewsCount: 78,
  });

  // Create bookings for the same date
  const booking1Id = await db.mutation(api.bookings.createBooking, {
    userId: user1Id as Id<"users">,
    pitchId: pitchId as Id<"pitches">,
    date: "2023-06-20",
    startTime: "11:00",
    duration: 1,
    totalPrice: 11000,
    status: "confirmed" as const,
  });

  const booking2Id = await db.mutation(api.bookings.createBooking, {
    userId: user2Id as Id<"users">,
    pitchId: pitchId as Id<"pitches">,
    date: "2023-06-20",
    startTime: "13:00",
    duration: 2,
    totalPrice: 22000,
    status: "pending" as const,
  });

  // Create a booking for a different date
  await db.mutation(api.bookings.createBooking, {
    userId: user1Id as Id<"users">,
    pitchId: pitchId as Id<"pitches">,
    date: "2023-06-21",
    startTime: "14:00",
    duration: 1,
    totalPrice: 11000,
    status: "confirmed" as const,
  });

  // Get bookings by date
  const dateBookings = await db.query(api.bookings.getBookingsByDate, { date: "2023-06-20" });
  
  expect(dateBookings).to.be.an("array");
  expect(dateBookings.length).to.equal(2);
  
  const booking1 = dateBookings.find(b => b._id === booking1Id);
  const booking2 = dateBookings.find(b => b._id === booking2Id);
  
  expect(booking1).to.not.be.undefined;
  expect(booking1!.userId).to.equal(user1Id);
  expect(booking1!.date).to.equal("2023-06-20");
  
  expect(booking2).to.not.be.undefined;
  expect(booking2!.userId).to.equal(user2Id);
  expect(booking2!.date).to.equal("2023-06-20");
});

test("updateBookingStatus updates booking status", async ({ db }) => {
  // Create a user and a pitch
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

  // Create a booking with pending status
  const bookingId = await db.mutation(api.bookings.createBooking, {
    userId: userId as Id<"users">,
    pitchId: pitchId as Id<"pitches">,
    date: "2023-06-22",
    startTime: "12:00",
    duration: 1,
    totalPrice: 10000,
    status: "pending" as const,
  });

  // Update booking status to confirmed
  await db.mutation(api.bookings.updateBookingStatus, {
    bookingId: bookingId as Id<"bookings">,
    status: "confirmed" as const,
  });

  // Get the updated booking
  const booking = await db.query(api.bookings.getBookingsByUser, { userId: userId as Id<"users"> });
  
  expect(booking).to.be.an("array");
  expect(booking.length).to.equal(1);
  expect(booking[0]._id).to.equal(bookingId);
  expect(booking[0].status).to.equal("confirmed");
});

test("cancelBooking cancels a booking", async ({ db }) => {
  // Create a user and a pitch
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

  // Create a booking with confirmed status
  const bookingId = await db.mutation(api.bookings.createBooking, {
    userId: userId as Id<"users">,
    pitchId: pitchId as Id<"pitches">,
    date: "2023-06-23",
    startTime: "15:00",
    duration: 2,
    totalPrice: 20000,
    status: "confirmed" as const,
  });

  // Cancel the booking
  await db.mutation(api.bookings.cancelBooking, {
    bookingId: bookingId as Id<"bookings">,
  });

  // Get the cancelled booking
  const booking = await db.query(api.bookings.getBookingsByUser, { userId: userId as Id<"users"> });
  
  expect(booking).to.be.an("array");
  expect(booking.length).to.equal(1);
  expect(booking[0]._id).to.equal(bookingId);
  expect(booking[0].status).to.equal("cancelled");
});