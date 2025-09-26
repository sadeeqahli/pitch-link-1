# Convex Integration for PitchLink

This document explains how to set up and use Convex as the backend for your PitchLink mobile application.

## Prerequisites

1. Node.js installed
2. Expo CLI installed
3. Convex account (optional for local development)

## Installation

1. Install Convex in your project:
```bash
npm install convex
```

2. Initialize Convex (for local development):
```bash
npx convex dev --once
```

## Project Structure

```
mobile/
├── convex/
│   ├── schema.ts          # Database schema definition
│   ├── users.ts           # User management functions
│   ├── pitches.ts         # Pitch management functions
│   ├── bookings.ts        # Booking management functions
│   └── _generated/        # Auto-generated files (created by Convex)
├── src/
│   ├── hooks/
│   │   └── useConvex.ts   # React hooks for Convex functions
│   └── utils/
│       └── convex.ts      # Convex client configuration
└── convex.json           # Convex configuration
```

## Schema Overview

The database schema includes the following tables:

1. **users** - User profiles and authentication
2. **pitches** - Football pitch information
3. **bookings** - Booking records
4. **reviews** - User reviews for pitches

## Setting Up Convex

### 1. Local Development

To run Convex locally:

```bash
npx convex dev
```

This will start the Convex development server on `http://localhost:3001`.

### 2. Configuration

The Convex client is configured in `src/utils/convex.ts`:

```javascript
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL || "http://localhost:3001"
);

export default convex;
```

Add the following to your `.env` file:
```
EXPO_PUBLIC_CONVEX_URL=http://localhost:3001
```

## Using Convex in Components

### 1. Provider Setup

The Convex provider is already added to your `App.tsx`:

```javascript
import { ConvexProvider } from "convex/react";
import convex from './src/utils/convex';

// In your component tree:
<ConvexProvider client={convex}>
  <App />
</ConvexProvider>
```

### 2. Using Hooks

Use the provided hooks in your components:

```javascript
import { useUsers, usePitches, useBookings } from "@/hooks/useConvex";

export default function MyComponent() {
  const { createUser, getUserByEmail } = useUsers();
  const { pitches, createPitch } = usePitches();
  const { createBooking, getBookingsByUser } = useBookings();
  
  // Use the functions in your component
}
```

## Deploying to Production

1. Create a Convex project:
```bash
npx convex init
```

2. Deploy your functions:
```bash
npx convex deploy
```

3. Update your environment variables with the production Convex URL.

## Example Usage

See `src/app/(tabs)/pitch/[id].convex.jsx` for a complete example of how to integrate Convex with your existing components.

## Next Steps

1. Replace mock data with real Convex queries
2. Implement authentication with Convex
3. Add real-time subscriptions for booking updates
4. Set up production deployment