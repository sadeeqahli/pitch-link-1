import { ConvexReactClient } from "convex/react";

// For local development and production
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  console.warn("EXPO_PUBLIC_CONVEX_URL is not set, using localhost fallback");
}

const convex = new ConvexReactClient(
  convexUrl || "http://localhost:3001"
);

export default convex;