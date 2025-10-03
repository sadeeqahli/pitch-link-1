import { test } from "convex/test";
import { expect } from "chai";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";

test("listPitches returns all pitches", async ({ db }) => {
  // Create a few pitches
  const pitch1Id = await db.mutation(api.pitches.createPitch, {
    name: "Greenfield Stadium",
    location: "123 Football Street",
    pricePerHour: 12500,
    surfaceType: "Artificial Grass",
    capacity: 5,
    amenities: ["WiFi", "Parking"],
    images: ["image1.jpg", "image2.jpg"],
    rating: 4.8,
    reviewsCount: 124,
  });

  const pitch2Id = await db.mutation(api.pitches.createPitch, {
    name: "City Sports Complex",
    location: "456 Sports Avenue",
    pricePerHour: 15000,
    surfaceType: "Natural Grass",
    capacity: 11,
    amenities: ["WiFi", "Parking", "Changing Rooms"],
    images: ["image3.jpg", "image4.jpg"],
    rating: 4.6,
    reviewsCount: 89,
  });

  // List all pitches
  const pitches = await db.query(api.pitches.listPitches);
  
  expect(pitches).to.be.an("array");
  expect(pitches.length).to.be.at.least(2);
  
  const pitch1 = pitches.find(p => p._id === pitch1Id);
  const pitch2 = pitches.find(p => p._id === pitch2Id);
  
  expect(pitch1).to.not.be.undefined;
  expect(pitch1!.name).to.equal("Greenfield Stadium");
  expect(pitch2).to.not.be.undefined;
  expect(pitch2!.name).to.equal("City Sports Complex");
});

test("getPitch returns specific pitch", async ({ db }) => {
  // Create a pitch
  const pitchId = await db.mutation(api.pitches.createPitch, {
    name: "Riverside Football Ground",
    location: "789 River Road",
    pricePerHour: 10000,
    surfaceType: "Hybrid Grass",
    capacity: 7,
    amenities: ["Parking", "Changing Rooms"],
    images: ["image5.jpg", "image6.jpg"],
    rating: 4.7,
    reviewsCount: 67,
  });

  // Get the specific pitch
  const pitch = await db.query(api.pitches.getPitch, { id: pitchId as Id<"pitches"> });
  
  expect(pitch).to.not.be.null;
  expect(pitch!._id).to.equal(pitchId);
  expect(pitch!.name).to.equal("Riverside Football Ground");
  expect(pitch!.pricePerHour).to.equal(10000);
  expect(pitch!.capacity).to.equal(7);
});

test("getPitch returns null for non-existent pitch", async ({ db }) => {
  // Try to get a non-existent pitch
  const pitch = await db.query(api.pitches.getPitch, { id: "pitches_nonexistent_id" as Id<"pitches"> });
  
  expect(pitch).to.be.null;
});

test("createPitch creates a new pitch", async ({ db }) => {
  const pitchData = {
    name: "Elite Football Academy",
    location: "321 Elite Boulevard",
    pricePerHour: 17500,
    surfaceType: "Artificial Turf",
    capacity: 5,
    amenities: ["WiFi", "Parking", "Changing Rooms", "Gym"],
    images: ["image7.jpg", "image8.jpg"],
    rating: 4.9,
    reviewsCount: 156,
  };

  const pitchId = await db.mutation(api.pitches.createPitch, pitchData);

  expect(pitchId).to.be.a("string");

  const pitch = await db.query(api.pitches.getPitch, { id: pitchId as Id<"pitches"> });
  
  expect(pitch).to.not.be.null;
  expect(pitch!.name).to.equal(pitchData.name);
  expect(pitch!.location).to.equal(pitchData.location);
  expect(pitch!.pricePerHour).to.equal(pitchData.pricePerHour);
  expect(pitch!.surfaceType).to.equal(pitchData.surfaceType);
  expect(pitch!.capacity).to.equal(pitchData.capacity);
  expect(pitch!.amenities).to.deep.equal(pitchData.amenities);
  expect(pitch!.images).to.deep.equal(pitchData.images);
  expect(pitch!.rating).to.equal(pitchData.rating);
  expect(pitch!.reviewsCount).to.equal(pitchData.reviewsCount);
});

test("updatePitch updates pitch information", async ({ db }) => {
  // Create a pitch
  const pitchId = await db.mutation(api.pitches.createPitch, {
    name: "Parkside Pitch",
    location: "654 Park Lane",
    pricePerHour: 11000,
    surfaceType: "Natural Grass",
    capacity: 11,
    amenities: ["WiFi", "Parking"],
    images: ["image9.jpg"],
    rating: 4.5,
    reviewsCount: 78,
  });

  // Update the pitch
  await db.mutation(api.pitches.updatePitch, {
    id: pitchId as Id<"pitches">,
    name: "Updated Parkside Pitch",
    pricePerHour: 12000,
    amenities: ["WiFi", "Parking", "Changing Rooms"],
  });

  // Get the updated pitch
  const pitch = await db.query(api.pitches.getPitch, { id: pitchId as Id<"pitches"> });
  
  expect(pitch).to.not.be.null;
  expect(pitch!.name).to.equal("Updated Parkside Pitch");
  expect(pitch!.pricePerHour).to.equal(12000);
  expect(pitch!.amenities).to.deep.equal(["WiFi", "Parking", "Changing Rooms"]);
});