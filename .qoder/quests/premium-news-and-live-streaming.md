# Premium News & Live Streaming Feature Design

## Overview

This design document outlines the transformation of the existing "News & Live Scores" page into a premium, subscription-based service featuring personalized content, live match streaming, and a comprehensive revenue generation system for the player-side mobile application.

### Key Objectives
- Transform existing news page into a freemium model with premium content tiers
- Implement subscription-based live streaming for football matches
- Create personalized content experience based on user's favorite club
- Establish new revenue stream through subscription services
- Provide dynamic pricing with first-time user discounts

## Technology Stack Integration

### Mobile Application Stack
- **Framework**: React Native with Expo SDK 53
- **State Management**: Zustand for subscription and user preference states
- **Payment Processing**: Integration with existing Stripe infrastructure
- **Secure Storage**: Expo SecureStore for subscription status and user preferences
- **Navigation**: Expo Router for seamless page transitions
- **Authentication**: Leveraging existing auth system with enhanced user profile fields

### Subscription Infrastructure
- **Payment Gateway**: Stripe subscriptions API (already integrated in web version)
- **Backend Integration**: Extend existing API endpoints for subscription management
- **Data Persistence**: SecureStore for offline subscription status
- **Price Management**: Dynamic pricing calculation with discount logic

## Architecture

### Component Hierarchy

```mermaid
graph TD
    A[Premium News Screen] --> B[Subscription Header]
    A --> C[Paywall Modal]
    A --> D[Club Selection Modal]
    A --> E[Free Content Section]
    A --> F[Premium Content Section]
    A --> G[Live Streaming Section]
    A --> H[Search Component]
    
    B --> B1[Go Premium Button]
    B --> B2[Subscription Status]
    
    C --> C1[Pricing Display]
    C --> C2[First-Time Discount Logic]
    C --> C3[Payment Integration]
    
    D --> D1[Club Search Bar]
    D --> D2[Club List]
    D --> D3[Club Selection Persistence]
    
    F --> F1[Personalized Club News]
    F --> F2[Premium Article Access]
    F --> F3[Advanced Statistics]
    
    G --> G1[Live Match List]
    G --> G2[Watch Live Button]
    G --> G3[Live Stream Player]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style C fill:#ffd,stroke:#333,stroke-width:2px
    style G fill:#dfd,stroke:#333,stroke-width:2px
```

### State Management Architecture

```mermaid
graph LR
    A[Subscription Store] --> B[User Premium Status]
    A --> C[Subscription Tier]
    A --> D[First Purchase Flag]
    
    E[User Preferences Store] --> F[Favorite Club]
    E --> G[Content Personalization]
    E --> H[Notification Settings]
    
    I[Content Store] --> J[Free Articles]
    I --> K[Premium Articles]
    I --> L[Live Match Data]
    
    B --> M[Premium Content Access]
    F --> N[Personalized Feed]
    L --> O[Live Streaming Access]
    
    style A fill:#e1f5fe
    style E fill:#f3e5f5
    style I fill:#e8f5e8
```

## Data Models

### Enhanced User Profile Model
```javascript
interface UserProfile {
  id: string;
  email: string;
  name: string;
  // Existing fields...
  
  // Premium subscription fields
  isPremium: boolean;
  subscriptionTier: 'free' | 'premium';
  subscriptionStatus: 'active' | 'inactive' | 'cancelled' | 'past_due';
  currentPeriodEnd: Date;
  firstPurchaseDate: Date | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  
  // Content personalization
  favoriteClub: {
    id: string;
    name: string;
    league: string;
    logoUrl: string;
  } | null;
  
  // Usage tracking
  contentInteractions: {
    articlesRead: number;
    streamingMinutes: number;
    lastActiveDate: Date;
  };
}
```

### Subscription Model
```javascript
interface Subscription {
  id: string;
  userId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  tier: 'premium';
  pricing: {
    monthly: number; // 450 NGN
    yearly: number;  // 5400 NGN
    firstTimeMonthly: number; // 370 NGN
  };
  stripeSubscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Content Model
```javascript
interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: string;
  publishedAt: Date;
  readTime: number;
  
  // Premium content flags
  isPremium: boolean;
  accessLevel: 'free' | 'premium';
  
  // Club association
  relatedClubs: string[];
  tags: string[];
}

interface LiveMatch {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  competition: string;
  matchDate: Date;
  status: 'scheduled' | 'live' | 'finished';
  score: {
    home: number | null;
    away: number | null;
  };
  
  // Streaming configuration
  hasLiveStream: boolean;
  streamUrl: string | null;
  requiresPremium: boolean;
}
```

## Premium Features Implementation

### 1. Dynamic Pricing System

```mermaid
flowchart TD
    A[User Requests Subscription] --> B{Check User History}
    B -->|First Time User| C[Apply Discount Price ₦370]
    B -->|Returning User| D[Regular Price ₦450]
    
    C --> E[Display Pricing Modal]
    D --> E
    
    E --> F{User Selects Plan}
    F -->|Monthly| G[Process Monthly Payment]
    F -->|Yearly| H[Calculate Yearly Price ₦5400]
    
    G --> I[Create Stripe Subscription]
    H --> I
    
    I --> J{Payment Successful?}
    J -->|Yes| K[Update User Profile]
    J -->|No| L[Show Error Message]
    
    K --> M[Enable Premium Features]
    L --> N[Retry Payment Option]
    
    style C fill:#a8e6cf
    style D fill:#ffd3a5
    style M fill:#c8e6c9
```

### 2. Club Selection & Personalization

```mermaid
sequenceDiagram
    participant U as User
    participant App as Mobile App
    participant API as Backend API
    participant Store as Local Storage
    
    U->>App: First Premium Access
    App->>App: Check if club selected
    App->>U: Show Club Selection Modal
    U->>App: Search for club
    App->>API: Fetch club suggestions
    API-->>App: Return club list
    App->>U: Display search results
    U->>App: Select favorite club
    App->>Store: Save club preference
    App->>API: Update user profile
    API-->>App: Confirm update
    App->>App: Refresh content feed
    App->>U: Show personalized content
```

### 3. Content Access Control

```mermaid
graph TD
    A[User Accesses Content] --> B{Check Content Type}
    B -->|Free Content| C[Show Full Content]
    B -->|Premium Content| D{Check Subscription}
    
    D -->|Premium Active| E[Show Full Content]
    D -->|No Subscription| F[Show Paywall Modal]
    D -->|Subscription Expired| G[Show Renewal Prompt]
    
    F --> H[Display Pricing Options]
    G --> I[Offer Reactivation]
    
    H --> J{User Subscribes?}
    I --> J
    
    J -->|Yes| K[Process Payment]
    J -->|No| L[Show Limited Preview]
    
    K --> M[Update Subscription Status]
    M --> E
    
    style E fill:#c8e6c9
    style F fill:#ffcdd2
    style L fill:#fff3e0
```

## User Interface Design

### Premium Landing Page Layout

```mermaid
graph TD
    A[Header Section] --> A1[Premium Badge/Status]
    A --> A2[Go Premium Button - if not subscribed]
    A --> A3[Search Bar]
    
    B[Free Content Teaser] --> B1[General Football Headlines]
    B --> B2[Basic Live Scores]
    B --> B3[Limited Article Previews]
    
    C[Premium Content Preview] --> C1[Club-Specific News - Locked]
    C --> C2[Detailed Match Analysis - Locked]
    C --> C3[Live Streaming Options - Locked]
    
    D[Live Streaming Section] --> D1[Upcoming Matches]
    D --> D2[Watch Live Buttons]
    D --> D3[Premium Stream Quality Info]
    
    E[Subscription CTA] --> E1[Pricing Display]
    E --> E2[Feature Benefits List]
    E --> E3[First-Time Discount Highlight]
    
    style A fill:#e3f2fd
    style C fill:#fff3e0
    style E fill:#f3e5f5
```

### Paywall Modal Components

```mermaid
graph LR
    A[Paywall Modal] --> B[Pricing Header]
    A --> C[Plan Options]
    A --> D[Payment Form]
    A --> E[Benefits List]
    
    B --> B1[Monthly ₦450]
    B --> B2[First-Time ₦370]
    B --> B3[Yearly ₦5400]
    
    C --> C1[Monthly Plan Selection]
    C --> C2[Yearly Plan Selection]
    C --> C3[Plan Comparison]
    
    D --> D1[Stripe Payment Integration]
    D --> D2[Payment Method Selection]
    D --> D3[Security Notice]
    
    E --> E1[Live Streaming Access]
    E --> E2[Personalized Content]
    E --> E3[Ad-Free Experience]
    E --> E4[Exclusive Analysis]
    
    style A fill:#f5f5f5
    style D1 fill:#e8f5e8
```

## Live Streaming Integration

### Stream Access Control Flow

```mermaid
flowchart TD
    A[User Taps "Watch Live"] --> B{Check Subscription Status}
    B -->|Premium Active| C[Verify Stream Availability]
    B -->|No Subscription| D[Show Subscription Modal]
    
    C -->|Stream Available| E[Load Video Player]
    C -->|Stream Unavailable| F[Show "Coming Soon" Message]
    
    D --> G{User Subscribes?}
    G -->|Yes| H[Process Payment]
    G -->|No| I[Return to Content]
    
    H --> J{Payment Success?}
    J -->|Yes| K[Update Subscription Status]
    J -->|No| L[Show Payment Error]
    
    K --> C
    L --> D
    
    E --> M[Full-Screen Video Player]
    M --> N[Live Commentary]
    M --> O[Match Statistics]
    
    style E fill:#c8e6c9
    style D fill:#ffcdd2
    style M fill:#e1f5fe
```

### Live Stream Player Features

```mermaid
graph TD
    A[Live Stream Player] --> B[Video Controls]
    A --> C[Match Information]
    A --> D[Interactive Features]
    
    B --> B1[Play/Pause]
    B --> B2[Quality Selection]
    B --> B3[Fullscreen Toggle]
    B --> B4[Volume Control]
    
    C --> C1[Team Information]
    C --> C2[Live Score Updates]
    C --> C3[Match Timeline]
    C --> C4[Competition Details]
    
    D --> D1[Live Text Commentary]
    D --> D2[Real-time Statistics]
    D --> D3[Social Sharing]
    D --> D4[Match Highlights Replay]
    
    style A fill:#e3f2fd
    style D fill:#f3e5f5
```

## Search & Discovery Features

### Enhanced Search Implementation

```mermaid
graph TD
    A[Search Input] --> B[Search Processing]
    B --> C[Content Filtering]
    
    C --> D[Free Content Results]
    C --> E[Premium Content Results]
    C --> F[Live Match Results]
    
    E --> G{User Subscription Check}
    G -->|Premium| H[Show Full Results]
    G -->|Free| I[Show Premium Teasers]
    
    F --> J{Match Status Check}
    J -->|Live| K[Show "Watch Live" Option]
    J -->|Upcoming| L[Show "Notify Me" Option]
    J -->|Finished| M[Show Highlights Option]
    
    I --> N[Upgrade Prompt]
    K --> O{Subscription Check}
    O -->|Premium| P[Direct Stream Access]
    O -->|Free| Q[Subscription Prompt]
    
    style A fill:#e8f5e8
    style H fill:#c8e6c9
    style N fill:#ffcdd2
    style P fill:#e1f5fe
```

## Payment Integration Architecture

### Stripe Integration Flow

```mermaid
sequenceDiagram
    participant U as User
    participant App as Mobile App
    participant StripeSDK as Stripe SDK
    participant Backend as Backend API
    participant Stripe as Stripe Server
    
    U->>App: Select Subscription Plan
    App->>Backend: Create Payment Intent
    Backend->>Stripe: Create Subscription
    Stripe-->>Backend: Return Client Secret
    Backend-->>App: Send Client Secret
    
    App->>StripeSDK: Initialize Payment Sheet
    StripeSDK->>U: Show Payment Form
    U->>StripeSDK: Enter Payment Details
    StripeSDK->>Stripe: Process Payment
    
    Stripe-->>StripeSDK: Payment Result
    StripeSDK-->>App: Payment Status
    
    alt Payment Successful
        App->>Backend: Confirm Subscription
        Backend->>Backend: Update User Profile
        Backend-->>App: Subscription Confirmed
        App->>App: Update Local State
        App->>U: Show Success & Enable Features
    else Payment Failed
        App->>U: Show Error Message
        App->>U: Option to Retry
    end
```

### Subscription State Management

```mermaid
stateDiagram-v2
    [*] --> Free: Default State
    Free --> PendingPayment: User Initiates Subscription
    PendingPayment --> Active: Payment Successful
    PendingPayment --> Failed: Payment Failed
    Failed --> Free: User Cancels
    Failed --> PendingPayment: User Retries
    
    Active --> PastDue: Payment Issue
    Active --> Cancelled: User Cancels
    Active --> Active: Renewal Success
    
    PastDue --> Active: Payment Resolved
    PastDue --> Cancelled: Grace Period Expired
    
    Cancelled --> Free: Subscription Ends
    Cancelled --> Active: Reactivation
    
    note right of Active
        Premium features enabled
        Live streaming access
        Personalized content
    end note
    
    note right of Free
        Limited content access
        Paywall prompts
        Basic features only
    end note
```

## Error Handling & Edge Cases

### Subscription Management Error Handling

```mermaid
flowchart TD
    A[Subscription Action] --> B{Network Available?}
    B -->|No| C[Show Offline Message]
    B -->|Yes| D[Process Request]
    
    D --> E{API Response}
    E -->|Success| F[Update Local State]
    E -->|Error 4xx| G[Show User Error]
    E -->|Error 5xx| H[Show Server Error]
    E -->|Timeout| I[Show Retry Option]
    
    C --> J[Cache Action for Later]
    G --> K[Provide Resolution Steps]
    H --> L[Auto-retry Logic]
    I --> M[Manual Retry Button]
    
    J --> N[Sync When Online]
    L --> O{Retry Successful?}
    O -->|Yes| F
    O -->|No| P[Escalate to Support]
    
    style C fill:#ffcdd2
    style F fill:#c8e6c9
    style P fill:#ff8a65
```

### Content Loading States

```mermaid
graph TD
    A[Content Request] --> B[Loading State]
    B --> C{Content Available?}
    
    C -->|Cached| D[Show Cached Content]
    C -->|Network Required| E[Fetch from API]
    
    E --> F{API Response}
    F -->|Success| G[Update Cache & Display]
    F -->|Error| H[Show Error State]
    F -->|Subscription Required| I[Show Paywall]
    
    D --> J[Background Refresh]
    J --> K{Updated Content?}
    K -->|Yes| L[Silent Update]
    K -->|No| M[Keep Current]
    
    H --> N[Retry Button]
    H --> O[Offline Fallback]
    
    style B fill:#fff3e0
    style G fill:#c8e6c9
    style H fill:#ffcdd2
    style I fill:#e1bee7
```

## Testing Strategy

### Unit Testing Components

| Component | Test Coverage | Key Test Cases |
|-----------|---------------|----------------|
| PremiumNewsScreen | 90%+ | Subscription status display, content filtering, paywall triggers |
| PaywallModal | 95%+ | Pricing calculations, discount logic, payment flow initiation |
| ClubSelectionModal | 85%+ | Search functionality, club selection persistence, API integration |
| LiveStreamPlayer | 80%+ | Stream loading, quality selection, premium access control |
| SubscriptionStore | 95%+ | State management, persistence, sync operations |

### Integration Testing Scenarios

```mermaid
graph TD
    A[Integration Tests] --> B[Payment Flow Tests]
    A --> C[Content Access Tests]
    A --> D[Club Selection Tests]
    A --> E[Live Streaming Tests]
    
    B --> B1[First-time User Discount]
    B --> B2[Subscription Renewal]
    B --> B3[Payment Failure Handling]
    B --> B4[Subscription Cancellation]
    
    C --> C1[Free vs Premium Content]
    C --> C2[Paywall Triggers]
    C --> C3[Content Personalization]
    C --> C4[Search Functionality]
    
    D --> D1[Club Search & Selection]
    D --> D2[Preference Persistence]
    D --> D3[Content Feed Updates]
    
    E --> E1[Stream Access Control]
    E --> E2[Video Player Integration]
    E --> E3[Quality Adaptation]
    E --> E4[Commentary Sync]
    
    style A fill:#e3f2fd
    style B fill:#fff3e0
    style C fill:#f3e5f5
    style D fill:#e8f5e8
    style E fill:#fce4ec
```

### Performance Testing Requirements

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| App Launch Time | < 2 seconds | Automated performance tests |
| Content Load Time | < 1.5 seconds | API response monitoring |
| Video Stream Start | < 3 seconds | Video player analytics |
| Payment Processing | < 5 seconds | Stripe webhook monitoring |
| Search Response | < 500ms | Search query performance |
| Club Selection | < 1 second | Modal interaction timing |

## Security Considerations

### Data Protection Measures

```mermaid
graph TD
    A[Security Implementation] --> B[Authentication]
    A --> C[Data Encryption]
    A --> D[Payment Security]
    A --> E[API Security]
    
    B --> B1[JWT Token Validation]
    B --> B2[Biometric Authentication]
    B --> B3[Session Management]
    
    C --> C1[SecureStore for Sensitive Data]
    C --> C2[HTTPS Communication]
    C --> C3[Local Data Encryption]
    
    D --> D1[PCI DSS Compliance via Stripe]
    D --> D2[No Local Card Storage]
    D --> D3[Secure Payment Tokenization]
    
    E --> E1[API Key Management]
    E --> E2[Rate Limiting]
    E --> E3[Input Validation]
    
    style A fill:#ffebee
    style D fill:#e8f5e8
    style C fill:#e3f2fd
```

### Privacy & Compliance

| Aspect | Implementation | Compliance Standard |
|--------|----------------|-------------------|
| User Data Collection | Explicit consent for personalization | GDPR Article 6 |
| Payment Information | Stripe-hosted, no local storage | PCI DSS Level 1 |
| Viewing Analytics | Anonymized usage tracking | Privacy by Design |
| Data Retention | Configurable retention periods | GDPR Article 17 |
| User Rights | Data export and deletion options | GDPR Chapter 3 |

## Deployment & Rollout Strategy

### Feature Rollout Phases

```mermaid
gantt
    title Premium News Feature Rollout
    dateFormat  YYYY-MM-DD
    section Phase 1
    Basic Paywall Implementation    :active, p1, 2024-01-01, 2w
    Subscription State Management   :p1-2, after p1, 1w
    
    section Phase 2
    Club Selection Feature         :p2, after p1-2, 2w
    Content Personalization       :p2-2, after p2, 1w
    
    section Phase 3
    Live Streaming Integration     :p3, after p2-2, 3w
    Advanced Search Features       :p3-2, after p3, 1w
    
    section Phase 4
    Performance Optimization       :p4, after p3-2, 2w
    Full Feature Testing          :p4-2, after p4, 1w
    
    section Launch
    Beta Release                  :milestone, beta, after p4-2, 0d
    Production Launch             :milestone, launch, after beta, 1w
```

### Monitoring & Analytics

```mermaid
graph TD
    A[Analytics Dashboard] --> B[Subscription Metrics]
    A --> C[Content Engagement]
    A --> D[Technical Performance]
    A --> E[User Experience]
    
    B --> B1[Conversion Rates]
    B --> B2[Churn Analysis]
    B --> B3[Revenue Tracking]
    B --> B4[Discount Effectiveness]
    
    C --> C1[Content Views]
    C --> C2[Time Spent]
    C --> C3[Search Usage]
    C --> C4[Club Preferences]
    
    D --> D1[App Performance]
    D --> D2[API Response Times]
    D --> D3[Stream Quality]
    D --> D4[Error Rates]
    
    E --> E1[User Satisfaction]
    E --> E2[Feature Adoption]
    E --> E3[Support Tickets]
    E --> E4[App Store Ratings]
    
    style A fill:#e3f2fd
    style B fill:#c8e6c9
    style C fill:#fff3e0
    style D fill:#ffcdd2
    style E fill:#f3e5f5
```