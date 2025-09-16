# Enhanced Booking Flow & History Design

## Overview

This design document outlines the enhancements to the PitchLink mobile application's booking system, focusing on creating a predictable, transparent booking process with reliable time slot selection, first-time booking discount implementation, and comprehensive booking history management.

## Technology Stack

- **Frontend**: React Native with Expo SDK 53
- **State Management**: Zustand for global state management
- **Routing**: Expo Router for file-based navigation
- **Data Persistence**: Expo SecureStore for secure local storage
- **Database**: Firestore for backend data management
- **Styling**: React Native StyleSheet with dynamic theming

## Architecture

### Component Hierarchy

```mermaid
graph TD
    A[Pitch Details Screen] --> B[Time Slot Selection]
    A --> C[Duration Selection]
    A --> D[Pricing Calculator]
    B --> E[Booking Summary]
    C --> E
    D --> E
    E --> F[Payment Screen]
    F --> G[Booking Confirmation]
    
    H[Booking History Screen] --> I[Booking Cards]
    H --> J[Search Filter]
    
    K[Home Screen] --> L[Search Component]
    L --> M[Pitch Results]
    
    N[Booking Store] --> A
    N --> E
    N --> H
    O[User Store] --> N
```

### State Management Architecture

```mermaid
classDiagram
    class BookingStore {
        +Array bookings
        +Object currentBooking
        +Boolean isLoading
        +String error
        +Function createBooking()
        +Function loadBookings()
        +Function updateBookingStatus()
        +Function calculatePricing()
        +Function checkFirstTimeBooking()
    }
    
    class UserStore {
        +Object user
        +Boolean hasBookedBefore
        +Function updateUserBookingStatus()
        +Function getUserProfile()
    }
    
    class PitchSelectionStore {
        +String selectedDate
        +String selectedTime
        +Number selectedDuration
        +Array availableSlots
        +Function updateSelection()
        +Function validateSlotAvailability()
    }
    
    BookingStore --> UserStore : uses
    PitchSelectionStore --> BookingStore : feeds into
```

## Time Slot Selection Enhancement

### Sequential Time Slot Logic

```mermaid
sequenceDiagram
    participant User as User
    participant UI as Pitch Details UI
    participant Store as Booking Store
    participant Validator as Slot Validator
    
    User->>UI: Select initial time slot (e.g., 10:00)
    UI->>Store: Update selectedTime
    Store->>Validator: Check contiguous availability
    Validator-->>Store: Return available next slots
    Store-->>UI: Update available duration options
    UI-->>User: Highlight 1hr, 2hr, 3hr options
    
    User->>UI: Select duration (e.g., 2 hours)
    UI->>Store: Update selectedDuration
    Store->>Validator: Validate 10:00-12:00 availability
    Validator-->>Store: Confirm availability
    Store-->>UI: Update pricing calculation
    UI-->>User: Display total cost
```

### Time Slot Display Component

| Component | Properties | Behavior |
|-----------|------------|----------|
| TimeSlotGrid | `availableSlots: Array` | Displays chronological time slots (09:00-21:00) |
| TimeSlotButton | `time: String, available: Boolean, selected: Boolean` | Visual feedback for slot status |
| DurationSelector | `selectedTime: String, availableHours: Array` | Shows 1, 2, 3-hour options when time selected |
| PricingDisplay | `basePricePerHour: Number, duration: Number` | Real-time pricing calculation |

### Time Slot Selection Rules

1. **Fixed Chronological Order**: Time slots displayed sequentially (09:00, 10:00, 11:00, etc.)
2. **Contiguous Selection**: When time selected, highlight next available contiguous slots
3. **Duration Validation**: Ensure selected duration doesn't conflict with existing bookings
4. **Visual Feedback**: Clear indication of selected time, duration, and pricing

## First-Time Booking Discount System

### Discount Calculation Logic

```mermaid
flowchart TD
    A[User Selects Duration] --> B[Calculate Base Cost]
    B --> C{Check User Profile}
    C --> |hasBookedBefore: false| D[Apply 10% Discount]
    C --> |hasBookedBefore: true| E[No Discount]
    D --> F[Calculate Transaction Fee]
    E --> F
    F --> G[Display Final Total]
    
    subgraph "Pricing Breakdown"
        H[Subtotal: Base × Hours]
        I[First-Booking Discount: -10%]
        J[Transaction Fee: Fixed ₦2,500]
        K[Total Payable: Subtotal - Discount + Fee]
    end
```

### Pricing Calculation Model

| Field | Calculation | Example (1hr, ₦12,500/hr, First Booking) |
|-------|-------------|-------------------------------------------|
| Subtotal | `basePricePerHour × duration` | ₦12,500 × 1 = ₦12,500 |
| First-Booking Discount | `subtotal × 0.1` (if eligible) | ₦12,500 × 0.1 = ₦1,250 |
| Transaction Fee | Fixed amount | ₦2,500 |
| Total Payable | `subtotal - discount + transactionFee` | ₦12,500 - ₦1,250 + ₦2,500 = ₦13,750 |

### User Profile Integration

```typescript
interface UserProfile {
  userId: string;
  hasBookedBefore: boolean;
  totalBookings: number;
  firstBookingDate?: string;
  discountEligible: boolean;
}

interface DiscountCalculation {
  subtotal: number;
  discountAmount: number;
  discountPercentage: number;
  transactionFee: number;
  total: number;
  isFirstBooking: boolean;
}
```

## Enhanced Booking Store

### Store Structure Enhancement

```typescript
interface EnhancedBookingStore {
  // Existing state
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  
  // New state for enhanced flow
  selectedDate: Date | null;
  selectedTime: string | null;
  selectedDuration: number;
  availableTimeSlots: TimeSlot[];
  pricingBreakdown: PricingBreakdown | null;
  
  // Enhanced actions
  setTimeSlot: (date: Date, time: string) => void;
  setDuration: (duration: number) => void;
  calculateDynamicPricing: (basePricePerHour: number, duration: number, isFirstBooking: boolean) => PricingBreakdown;
  validateSlotAvailability: (date: Date, time: string, duration: number) => boolean;
  getContiguousSlots: (selectedTime: string) => string[];
  checkFirstTimeBookingEligibility: (userId: string) => Promise<boolean>;
  updateUserBookingStatus: (userId: string) => Promise<void>;
}
```

### Dynamic Pricing Function

```typescript
const calculateEnhancedPricing = (
  basePricePerHour: number, 
  duration: number, 
  isFirstBooking: boolean
): PricingBreakdown => {
  const subtotal = basePricePerHour * duration;
  const discountAmount = isFirstBooking ? subtotal * 0.1 : 0;
  const transactionFee = 2500; // Fixed fee
  const total = subtotal - discountAmount + transactionFee;
  
  return {
    subtotal,
    discountAmount,
    discountPercentage: isFirstBooking ? 10 : 0,
    transactionFee,
    total,
    isFirstBooking,
    breakdown: {
      basePricePerHour,
      duration,
      hourlyTotal: subtotal,
      savings: discountAmount
    }
  };
};
```

## Booking History System

### Booking History Architecture

```mermaid
graph TB
    A[Booking History Screen] --> B[Tab Navigation]
    B --> C[Upcoming Bookings]
    B --> D[Past Bookings] 
    B --> E[Cancelled Bookings]
    
    F[Search & Filter Bar] --> G[Name Filter]
    F --> H[Location Filter]
    F --> I[Date Range Filter]
    F --> J[Status Filter]
    
    K[Booking Card Component] --> L[Pitch Details]
    K --> M[Booking Info]
    K --> N[Action Buttons]
    
    C --> K
    D --> K
    E --> K
```

### Booking Card Component Structure

| Element | Description | Data Source |
|---------|-------------|-------------|
| Pitch Image | Thumbnail image | `booking.pitchImage` |
| Pitch Name | Venue name | `booking.pitchName` |
| Location | Full address | `booking.location` |
| Date & Time | Formatted booking datetime | `booking.date`, `booking.time` |
| Duration | Hours booked | `booking.duration` |
| Total Cost | Final amount paid | `booking.totalPrice` |
| Status Badge | Booking status indicator | `booking.status` |
| Action Button | Context-sensitive actions | Based on status and date |

### Booking History Data Model

```typescript
interface BookingHistoryItem {
  id: string;
  pitchName: string;
  pitchImage: string;
  location: string;
  date: string;
  time: string;
  duration: number;
  totalCost: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  bookingRef: string;
  createdAt: string;
  updatedAt: string;
  receipt?: BookingReceipt;
}

interface BookingFilter {
  searchTerm: string;
  location: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  status: string[];
}
```

## Home Page Search Enhancement

### Search Component Architecture

```mermaid
graph LR
    A[Search Input] --> B[Filter Processor]
    B --> C[API Query Builder]
    C --> D[Firestore Query]
    D --> E[Results Processor]
    E --> F[UI Update]
    
    G[Filter Options] --> H[Name Filter]
    G --> I[Location Filter]
    G --> J[Availability Filter]
    G --> K[Date Filter]
    
    H --> B
    I --> B
    J --> B
    K --> B
```

### Search Filter Implementation

```typescript
interface SearchFilters {
  searchTerm: string;
  location: string;
  selectedDate: Date | null;
  availabilityOnly: boolean;
  priceRange: {
    min: number;
    max: number;
  };
  pitchType: string[];
  amenities: string[];
}

interface SearchResult {
  pitches: Pitch[];
  totalCount: number;
  searchTime: number;
  appliedFilters: SearchFilters;
}
```

### Real-time Search Flow

```mermaid
sequenceDiagram
    participant User as User
    participant SearchBar as Search Component
    participant Debouncer as Debounce Handler
    participant API as Search API
    participant Firestore as Database
    participant Results as Results Component
    
    User->>SearchBar: Types search term
    SearchBar->>Debouncer: Trigger search (300ms delay)
    Debouncer->>API: Execute search query
    API->>Firestore: Query pitches collection
    Firestore-->>API: Return matching pitches
    API-->>Results: Update search results
    Results-->>User: Display filtered pitches
    
    User->>SearchBar: Select location filter
    SearchBar->>API: Update search parameters
    API->>Firestore: Apply location filter
    Firestore-->>Results: Return location-filtered results
```

## Database Schema Enhancements

### User Profile Schema

```typescript
interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  hasBookedBefore: boolean;
  totalBookings: number;
  firstBookingDate?: Timestamp;
  preferences: {
    preferredLocations: string[];
    preferredPitchTypes: string[];
    notifications: boolean;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Booking Schema Enhancement

```typescript
interface Booking {
  id: string;
  userId: string;
  pitchId: string;
  pitchName: string;
  pitchImage: string;
  date: Timestamp;
  time: string;
  duration: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  pricing: {
    basePricePerHour: number;
    subtotal: number;
    discountAmount: number;
    transactionFee: number;
    total: number;
    isFirstBooking: boolean;
  };
  location: string;
  bookingRef: string;
  receipt?: BookingReceipt;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Component Updates

### Enhanced Pitch Details Screen

```typescript
// Key enhancements to pitch/[id].jsx
const PitchDetailsEnhancements = {
  timeSlotSelection: {
    chronologicalOrder: true,
    contiguousHighlighting: true,
    durationValidation: true
  },
  durationSelection: {
    options: [1, 2, 3], // hours
    realTimePricing: true,
    discountDisplay: true
  },
  pricingDisplay: {
    dynamicCalculation: true,
    breakdownVisibility: true,
    firstBookingDiscount: true
  }
};
```

### Enhanced Booking Summary Screen

```typescript
// Key enhancements to booking-summary.jsx
const BookingSummaryEnhancements = {
  pricingBreakdown: {
    subtotalDisplay: true,
    discountHighlight: true,
    transactionFeeClarity: true,
    totalCalculation: true
  },
  userFeedback: {
    firstBookingBadge: true,
    savingsHighlight: true,
    nextStepsGuidance: true
  }
};
```

### New Booking History Screen

```typescript
// Enhanced bookings.jsx
const BookingHistoryEnhancements = {
  tabNavigation: {
    upcoming: true,
    past: true,
    cancelled: true
  },
  searchFunctionality: {
    realTimeFilter: true,
    multiCriteriaSearch: true,
    resultsSorting: true
  },
  cardDesign: {
    compactLayout: true,
    statusIndicators: true,
    actionButtons: true
  }
};
```

## Testing Strategy

### Unit Testing

| Component | Test Cases | Coverage |
|-----------|------------|----------|
| Time Slot Selection | Chronological order, contiguous highlighting, availability validation | 95% |
| Pricing Calculator | First-time discount, transaction fee calculation, edge cases | 100% |
| Booking Store | CRUD operations, state consistency, error handling | 90% |
| Search Filter | Query building, real-time updates, result accuracy | 85% |

### Integration Testing

```mermaid
graph TD
    A[E2E Booking Flow] --> B[Select Pitch]
    B --> C[Choose Time & Duration]
    C --> D[Verify Pricing]
    D --> E[Complete Payment]
    E --> F[Confirm Booking]
    F --> G[View in History]
    
    H[Search Flow] --> I[Enter Search Term]
    I --> J[Apply Filters]
    J --> K[Verify Results]
    K --> L[Select Pitch]
```

### Performance Testing

- **Search Response Time**: < 500ms for typical queries
- **Booking Creation**: < 2 seconds end-to-end
- **History Loading**: < 1 second for 100+ bookings
- **Real-time Updates**: < 300ms for pricing calculations