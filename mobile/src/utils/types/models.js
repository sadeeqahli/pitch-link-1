/**
 * Enhanced User Profile Model with Premium Subscription Features
 * Extends the existing user model to support premium subscription functionality
 */

/**
 * Enhanced User Profile Interface
 * @typedef {Object} UserProfile
 * @property {string} id - Unique user identifier
 * @property {string} email - User email address
 * @property {string} name - User display name
 * @property {string} [phone] - User phone number
 * @property {string} [avatar] - User avatar URL
 * @property {Date} createdAt - User registration date
 * @property {Date} updatedAt - Last profile update
 * 
 * Premium subscription fields
 * @property {boolean} isPremium - Current premium subscription status
 * @property {'free'|'premium'} subscriptionTier - Current subscription tier
 * @property {'active'|'inactive'|'cancelled'|'past_due'} subscriptionStatus - Detailed subscription status
 * @property {Date} [currentPeriodEnd] - When current subscription period ends
 * @property {Date} [firstPurchaseDate] - Date of first premium purchase (for discount eligibility)
 * @property {string} [stripeCustomerId] - Stripe customer ID for payment processing
 * @property {string} [stripeSubscriptionId] - Active Stripe subscription ID
 * 
 * Content personalization
 * @property {FavoriteClub} [favoriteClub] - User's selected favorite football club
 * 
 * Usage tracking
 * @property {ContentInteractions} contentInteractions - User content interaction metrics
 */

/**
 * Favorite Club Information
 * @typedef {Object} FavoriteClub
 * @property {string} id - Unique club identifier
 * @property {string} name - Official club name
 * @property {string} league - League/competition the club plays in
 * @property {string} logoUrl - URL to club logo/badge
 * @property {string} [country] - Country where club is based
 * @property {string} [founded] - Year club was founded
 * @property {string} [colors] - Primary club colors
 */

/**
 * Content Interaction Metrics
 * @typedef {Object} ContentInteractions
 * @property {number} articlesRead - Total articles read by user
 * @property {number} streamingMinutes - Total minutes of live streaming watched
 * @property {Date} lastActiveDate - Last content interaction date
 * @property {string[]} [recentCategories] - Recently accessed content categories
 * @property {number} [premiumContentAccessed] - Count of premium content accessed
 */

/**
 * Subscription Model
 * @typedef {Object} Subscription
 * @property {string} id - Unique subscription identifier
 * @property {string} userId - Associated user ID
 * @property {'active'|'cancelled'|'past_due'|'unpaid'|'incomplete'} status - Current subscription status
 * @property {Date} currentPeriodStart - Current billing period start date
 * @property {Date} currentPeriodEnd - Current billing period end date
 * @property {boolean} cancelAtPeriodEnd - Whether subscription will cancel at period end
 * @property {'premium'} tier - Subscription tier (currently only premium)
 * @property {SubscriptionPricing} pricing - Pricing configuration
 * @property {string} stripeSubscriptionId - Stripe subscription identifier
 * @property {Date} createdAt - Subscription creation date
 * @property {Date} updatedAt - Last subscription update
 * @property {PaymentMethod} [paymentMethod] - Associated payment method
 */

/**
 * Subscription Pricing Configuration
 * @typedef {Object} SubscriptionPricing
 * @property {number} monthly - Regular monthly price in kobo (450 NGN = 45000 kobo)
 * @property {number} yearly - Yearly price in kobo (5400 NGN = 540000 kobo)
 * @property {number} firstTimeMonthly - First-time user discount monthly price in kobo (370 NGN = 37000 kobo)
 * @property {string} currency - Currency code (NGN)
 * @property {number} yearlyDiscountPercent - Percentage discount for yearly subscription
 * @property {number} firstTimeDiscountPercent - Percentage discount for first-time users
 */

/**
 * Payment Method Information
 * @typedef {Object} PaymentMethod
 * @property {string} id - Payment method identifier
 * @property {'card'|'bank_transfer'|'mobile_money'} type - Payment method type
 * @property {string} last4 - Last 4 digits of card/account
 * @property {string} [brand] - Card brand (for card payments)
 * @property {Date} expiryDate - Payment method expiry date
 * @property {boolean} isDefault - Whether this is the default payment method
 */

/**
 * News Article Model with Premium Content Support
 * @typedef {Object} NewsArticle
 * @property {string} id - Unique article identifier
 * @property {string} title - Article headline
 * @property {string} summary - Brief article summary/excerpt
 * @property {string} content - Full article content (HTML/markdown)
 * @property {string} imageUrl - Featured image URL
 * @property {string} category - Article category (e.g., "Transfer News", "Match Analysis")
 * @property {Date} publishedAt - Publication date
 * @property {number} readTime - Estimated reading time in minutes
 * @property {string} author - Article author name
 * @property {string} [authorImage] - Author profile image URL
 * 
 * Premium content flags
 * @property {boolean} isPremium - Whether article requires premium subscription
 * @property {'free'|'premium'} accessLevel - Required access level to read full content
 * @property {string} [premiumPreview] - Preview text shown to free users for premium content
 * 
 * Club association for personalization
 * @property {string[]} relatedClubs - Array of club IDs this article relates to
 * @property {string[]} tags - Content tags for categorization and search
 * @property {string} [competition] - Related competition/league
 * 
 * Engagement metrics
 * @property {number} views - Total article views
 * @property {number} shares - Number of times shared
 * @property {number} likes - Article likes/reactions
 */

/**
 * Live Match Model with Streaming Support
 * @typedef {Object} LiveMatch
 * @property {string} id - Unique match identifier
 * @property {Team} homeTeam - Home team information
 * @property {Team} awayTeam - Away team information
 * @property {string} competition - Competition name (e.g., "Premier League", "Champions League")
 * @property {Date} matchDate - Scheduled match date and time
 * @property {'scheduled'|'live'|'half_time'|'finished'|'postponed'|'cancelled'} status - Current match status
 * @property {MatchScore} score - Current match score
 * @property {string} [venue] - Match venue/stadium
 * @property {string} [referee] - Match referee
 * 
 * Streaming configuration
 * @property {boolean} hasLiveStream - Whether live stream is available
 * @property {string} [streamUrl] - Stream URL for premium users
 * @property {boolean} requiresPremium - Whether stream requires premium subscription
 * @property {StreamQuality[]} [availableQualities] - Available stream quality options
 * @property {string} [commentary] - Commentary language/type
 * 
 * Match details
 * @property {MatchEvent[]} [events] - Match events (goals, cards, substitutions)
 * @property {MatchStatistics} [statistics] - Match statistics
 * @property {number} [attendance] - Stadium attendance
 */

/**
 * Team Information
 * @typedef {Object} Team
 * @property {string} id - Unique team identifier
 * @property {string} name - Team name
 * @property {string} shortName - Abbreviated team name
 * @property {string} logoUrl - Team logo/badge URL
 * @property {string} [colors] - Team colors
 * @property {string} [country] - Team country
 */

/**
 * Match Score
 * @typedef {Object} MatchScore
 * @property {number|null} home - Home team score
 * @property {number|null} away - Away team score
 * @property {number} [homeHalfTime] - Home team half-time score
 * @property {number} [awayHalfTime] - Away team half-time score
 * @property {string} [minute] - Current match minute
 * @property {string} [period] - Current match period
 */

/**
 * Stream Quality Option
 * @typedef {Object} StreamQuality
 * @property {string} id - Quality identifier
 * @property {string} label - Quality display name (e.g., "720p HD", "1080p Full HD")
 * @property {number} bitrate - Stream bitrate
 * @property {string} resolution - Video resolution
 * @property {boolean} isDefault - Whether this is the default quality
 */

/**
 * Match Event
 * @typedef {Object} MatchEvent
 * @property {string} id - Event identifier
 * @property {'goal'|'yellow_card'|'red_card'|'substitution'|'penalty'} type - Event type
 * @property {number} minute - Minute when event occurred
 * @property {string} playerId - Player involved in event
 * @property {string} playerName - Player name
 * @property {string} teamId - Team ID
 * @property {string} [description] - Event description
 */

/**
 * Match Statistics
 * @typedef {Object} MatchStatistics
 * @property {TeamStats} home - Home team statistics
 * @property {TeamStats} away - Away team statistics
 */

/**
 * Team Statistics
 * @typedef {Object} TeamStats
 * @property {number} possession - Possession percentage
 * @property {number} shots - Total shots
 * @property {number} shotsOnTarget - Shots on target
 * @property {number} corners - Corner kicks
 * @property {number} fouls - Fouls committed
 * @property {number} yellowCards - Yellow cards received
 * @property {number} redCards - Red cards received
 * @property {number} passes - Total passes
 * @property {number} passAccuracy - Pass accuracy percentage
 */

/**
 * Club Search Result for Club Selection
 * @typedef {Object} ClubSearchResult
 * @property {string} id - Club identifier
 * @property {string} name - Club name
 * @property {string} league - League name
 * @property {string} logoUrl - Club logo URL
 * @property {string} country - Country
 * @property {number} [popularity] - Popularity ranking for search ordering
 * @property {boolean} [isVerified] - Whether club is verified/official
 */

/**
 * Content Filter Options
 * @typedef {Object} ContentFilter
 * @property {string[]} categories - Filter by content categories
 * @property {string[]} clubs - Filter by related clubs
 * @property {string[]} competitions - Filter by competitions
 * @property {'free'|'premium'|'all'} accessLevel - Filter by access level
 * @property {Date} [dateFrom] - Filter articles from this date
 * @property {Date} [dateTo] - Filter articles to this date
 * @property {string} [searchQuery] - Text search query
 */

/**
 * Subscription Analytics
 * @typedef {Object} SubscriptionAnalytics
 * @property {Date} subscriptionStartDate - When user first subscribed
 * @property {number} totalSubscriptionMonths - Total months subscribed
 * @property {number} totalSpent - Total amount spent on subscriptions
 * @property {number} articlesReadPremium - Premium articles read
 * @property {number} streamingHours - Total streaming hours
 * @property {Date} lastBillingDate - Last billing date
 * @property {Date} nextBillingDate - Next billing date
 * @property {boolean} hasEverCancelled - Whether user has ever cancelled
 */

// Export default pricing configuration
export const DEFAULT_PRICING = {
  monthly: 45000, // 450 NGN in kobo
  yearly: 540000, // 5400 NGN in kobo
  firstTimeMonthly: 37000, // 370 NGN in kobo
  currency: 'NGN',
  yearlyDiscountPercent: 20, // 20% discount for yearly
  firstTimeDiscountPercent: 18, // 18% discount for first-time users
};

// Export subscription statuses
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  PAST_DUE: 'past_due',
  UNPAID: 'unpaid',
  INCOMPLETE: 'incomplete',
};

// Export access levels
export const ACCESS_LEVEL = {
  FREE: 'free',
  PREMIUM: 'premium',
};

// Export match statuses
export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  HALF_TIME: 'half_time',
  FINISHED: 'finished',
  POSTPONED: 'postponed',
  CANCELLED: 'cancelled',
};

// Export content categories
export const CONTENT_CATEGORIES = {
  TRANSFER_NEWS: 'Transfer News',
  MATCH_ANALYSIS: 'Match Analysis',
  CHAMPIONS_LEAGUE: 'Champions League',
  PREMIER_LEAGUE: 'Premier League',
  LA_LIGA: 'La Liga',
  BUNDESLIGA: 'Bundesliga',
  SERIE_A: 'Serie A',
  YOUTH_FOOTBALL: 'Youth Football',
  WOMENS_FOOTBALL: "Women's Football",
  INTERNATIONAL: 'International',
  BREAKING_NEWS: 'Breaking News',
};

export default {
  DEFAULT_PRICING,
  SUBSCRIPTION_STATUS,
  ACCESS_LEVEL,
  MATCH_STATUS,
  CONTENT_CATEGORIES,
};