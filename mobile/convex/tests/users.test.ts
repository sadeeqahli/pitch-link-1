import { test } from "convex/test";
import { expect } from "chai";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";

test("createUser creates a new user", async ({ db }) => {
  const userId = await db.mutation(api.users.createUser, {
    name: "John Doe",
    email: "john@example.com",
  });

  expect(userId).to.be.a("string");

  const user = await db.query(api.users.getUserByEmail, { email: "john@example.com" });
  expect(user).to.not.be.null;
  expect(user!.name).to.equal("John Doe");
  expect(user!.email).to.equal("john@example.com");
});

test("getUserByEmail returns existing user", async ({ db }) => {
  // First create a user
  const userId = await db.mutation(api.users.createUser, {
    name: "Jane Smith",
    email: "jane@example.com",
  });

  // Then query for the user
  const user = await db.query(api.users.getUserByEmail, { email: "jane@example.com" });
  
  expect(user).to.not.be.null;
  expect(user!._id).to.equal(userId);
  expect(user!.name).to.equal("Jane Smith");
  expect(user!.email).to.equal("jane@example.com");
});

test("getUserByEmail returns null for non-existent user", async ({ db }) => {
  const user = await db.query(api.users.getUserByEmail, { email: "nonexistent@example.com" });
  
  expect(user).to.be.null;
});

test("updateUser updates user information", async ({ db }) => {
  // First create a user
  const userId = await db.mutation(api.users.createUser, {
    name: "John Doe",
    email: "john@example.com",
  });

  // Update the user
  await db.mutation(api.users.updateUser, {
    userId: userId as Id<"users">,
    name: "John Smith",
    phone: "+1234567890",
  });

  // Query for the updated user
  const user = await db.query(api.users.getUserByEmail, { email: "john@example.com" });
  
  expect(user).to.not.be.null;
  expect(user!.name).to.equal("John Smith");
  expect(user!.phone).to.equal("+1234567890");
});

test("saveUserPushToken saves push token", async ({ db }) => {
  // First create a user
  const userId = await db.mutation(api.users.createUser, {
    name: "John Doe",
    email: "john@example.com",
  });

  // Save push token
  const pushToken = "ExponentPushToken[xxxxxx]";
  await db.mutation(api.users.saveUserPushToken, {
    userId: userId as Id<"users">,
    pushToken: pushToken,
  });

  // Query for the updated user
  const user = await db.query(api.users.getUserByEmail, { email: "john@example.com" });
  
  expect(user).to.not.be.null;
  expect(user!.pushToken).to.equal(pushToken);
});

test("authenticateUser authenticates existing user", async ({ db }) => {
  // First create a user
  await db.mutation(api.users.createUser, {
    name: "John Doe",
    email: "john@example.com",
  });

  // Authenticate the user (simplified for demo)
  const result = await db.query(api.users.authenticateUser, {
    email: "john@example.com",
    password: "password123", // Not used in current implementation
  });
  
  expect(result.success).to.be.true;
  expect(result.user).to.not.be.null;
  expect(result.user!.email).to.equal("john@example.com");
});

test("authenticateUser fails for non-existent user", async ({ db }) => {
  const result = await db.query(api.users.authenticateUser, {
    email: "nonexistent@example.com",
    password: "password123",
  });
  
  expect(result.success).to.be.false;
  expect(result.error).to.equal("User not found");
});