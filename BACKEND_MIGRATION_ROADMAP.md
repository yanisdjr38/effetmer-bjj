# 🏗️ EFFETMER - BACKEND MIGRATION ROADMAP

## Executive Summary

Transform EFFETMER from a **local-only, offline-first PWA** into a **production-ready full-stack application** with:

- ✅ Cloud-backed data persistence
- ✅ Passwordless Magic Link authentication
- ✅ Multi-device synchronization
- ✅ **Preserved offline-first capabilities**
- ✅ Zero breaking changes to current UX

**Timeline Estimate:** 3-4 weeks for phased implementation  
**Risk Level:** Low (progressive migration, local fallbacks intact)

---

## 1. CURRENT ARCHITECTURE ANALYSIS

### Frontend State (React)

```
Frontend Stack:
├── React 18 + React Router v6
├── Context API (AppContext for global state)
├── SCSS Modules + CSS variables (Zenith Flow Design System)
├── Local Storage (persistent user data)
├── Service Workers (offline, PWA registration)
└── React Icons (FA icons for UI)

Data Storage:
├── localStorage (JSON serialization)
│   ├── profile (user onboarding data)
│   ├── trainingSchedule (weekly schedule)
│   ├── sessions (training records)
│   ├── goals (personal objectives)
│   ├── techniques (learned techniques)
│   ├── achievements (badges)
│   ├── settings (user preferences)
│   └── challenges (active challenges)
└── Service Worker Cache (offline assets, static UI)

Capabilities:
✅ 100% functional offline
✅ Instant load times (cached)
✅ Frictionless UX (no login needed currently)
✅ Data persistence across sessions
✅ Mobile PWA installable
```

### Current Data Flow

```
User Action
    ↓
React Component
    ↓
AppContext (global state)
    ↓
useLocalStorage hook
    ↓
browser localStorage (sync write)
    ↓
Data persisted (no network required)
```

### Current Limitations

- ❌ No user accounts or authentication
- ❌ No server-side data validation
- ❌ No multi-device sync (data siloed per device)
- ❌ No data backup/recovery
- ❌ No sharing between users
- ❌ All features exposed (no paywalls/tiers possible)

---

## 2. REQUIRED FRONTEND CHANGES

### 2.1 Architecture Changes (NOT Breaking)

#### Add Authentication Layer

```
New: Auth Context (in addition to AppContext)
├── authContext.jsx
│   ├── currentUser ({ id, email, profile })
│   ├── sessionToken (JWT)
│   ├── isAuthenticated (boolean)
│   ├── loading (boolean)
│   └── methods: login(), logout(), refreshSession()
└── Used by: ProtectedRoute components
```

#### Add API Communication Layer

```
New: services/ folder
├── apiClient.js (axios + interceptors)
│   ├── Base URL configuration
│   ├── JWT token injection
│   ├── Automatic token refresh
│   ├── Error handling
│   └── Request/response logging
├── authService.js (magic link flow)
├── userService.js (profile CRUD)
├── trainingService.js (sessions sync)
├── goalsService.js (goals sync)
├── techniquesService.js (techniques sync)
├── achievementsService.js (achievements sync)
└── statsService.js (analytics queries)
```

#### Add Sync Engine (Critical for offline-first)

```
New: lib/syncEngine.js
├── Queue management (IndexedDB)
├── Conflict resolution
├── Retry logic
├── Background sync (Service Worker)
├── Optimistic updates
└── Event emission (sync start, success, error)
```

#### Enhanced Hooks

```
Existing hooks (enhanced, not replaced):
├── useLocalStorage.jsx → useSync.jsx (dual-mode)
│   ├── Local fallback if offline
│   ├── Server sync if online
│   ├── Automatic conflict resolution
│   └── Retry on failure
├── useProfile.js → enhanced with server sync
├── useSessions.js → enhanced with server sync
└── etc.

New hooks:
├── useAuth.js (authentication state)
├── useOnlineStatus.js (network detection + event listeners)
└── useSyncStatus.js (queue status, conflict detection)
```

### 2.2 State Management Evolution

#### Before (Local Only)

```
AppContext
├── profile { local data }
├── sessions { local array }
├── goals { local data }
└── All data: localStorage only
```

#### After (Hybrid Local + Cloud)

```
AppContext (unchanged externally)
├── profile { merges local + server }
├── sessions { merges local + server }
├── goals { merges local + server }
└── Transparent sync layer underneath

AuthContext (new)
├── currentUser { from server }
├── sessionToken { JWT }
├── refreshToken { persistent }

SyncContext (new)
├── queue { pending operations }
├── isOnline { network status }
├── syncStatus { syncing/error/idle }
└── conflicts { conflicting updates }
```

### 2.3 UI Changes (Minimal)

#### Add Login/Logout

```
New Pages/Components:
├── LoginPage.jsx (magic link flow)
│   ├── Email input form
│   ├── "Check your email" confirmation
│   └── Magic link validation page
├── ProtectedRoute.jsx (guard authenticated routes)
├── AuthLink.jsx (in NavBar - logout, profile link)
└── SyncIndicator.jsx (WiFi icon showing sync status)
```

#### Notifications

```
New: OptimisticFeedback (toast notifications)
├── "Saving..." (local operation)
├── "Synced ✓" (server confirmed)
├── "⚠️ Sync failed - will retry" (offline/error)
└── "🔄 Syncing X items..." (on reconnect)
```

#### Existing UI enhancements (NO breaking changes)

```
HomePage:
├── Add: "Logged in as: user@example.com" (top-right)
├── Add: Sync status indicator
└── Show: "Last synced: 2 mins ago"

NavBar:
├── Add: Logout button (if authenticated)
├── Add: Account/Settings link
└── Add: Sync indicator
```

### 2.4 Data Migration (Smooth Transition)

#### First Login Flow

```
User lands on app
  ↓
If already has local data:
  ├── Show: "Sign in to sync your data or keep offline"
  └── Two buttons:
      ├── "Sign In & Migrate Data"
      └── "Continue Offline"

If clicks "Sign In & Migrate Data":
  ├── 1. Redirect to LoginPage
  ├── 2. User enters email & receives magic link
  ├── 3. User clicks magic link
  ├── 4. Server creates user account
  ├── 5. Frontend uploads all local data to server
  ├── 6. Merge strategy: server=source (user can re-export if needed)
  └── 7. App refreshes with synced state
```

---

## 3. BACKEND ARCHITECTURE PROPOSAL

### 3.1 Technology Stack

```
Runtime & Framework:
├── Node.js 18+ (LTS)
├── Express.js 4.18+ (lightweight, production-proven)
└── TypeScript optional but recommended

Database:
├── MongoDB Atlas (cloud, pay-as-you-go)
├── Redis (optional, for sessions/rate limiting/jobs)
└── Mongoose 7+ (ODM, schema validation)

Authentication:
├── JWT (JSON Web Tokens)
├── Magic Links (email-based OTP)
├── Refresh Tokens (secure rotation)
└── Bcrypt (password hashing, though passwordless)

Security & DevOps:
├── Helmet (HTTP headers hardening)
├── CORS (whitelist frontend domains)
├── Rate Limiting (express-rate-limit)
├── Compression (gzip responses)
├── Morgan (request logging)
├── Dotenv (environment variables)
└── Joi/Zod (request validation)

Email Service:
├── SendGrid or Nodemailer
├── Magic link generation
└── Transactional emails

Testing & Monitoring:
├── Jest (unit tests)
├── Supertest (API integration tests)
├── Sentry (error tracking)
└── CloudWatch/DataDog (optional)
```

### 3.2 Server Architecture

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js (MongoDB connection)
│   │   ├── email.js (SendGrid setup)
│   │   ├── jwt.js (token secrets & algorithms)
│   │   └── constants.js (time to live, rates, etc.)
│   │
│   ├── models/ (Mongoose schemas)
│   │   ├── User.js
│   │   ├── TrainingSession.js
│   │   ├── TrainingSchedule.js
│   │   ├── Goal.js
│   │   ├── Achievement.js
│   │   ├── Technique.js
│   │   ├── Stat.js
│   │   ├── AuthToken.js (magic links)
│   │   ├── SyncLog.js (audit trail)
│   │   └── RefreshToken.js (for token rotation)
│   │
│   ├── middleware/
│   │   ├── auth.js (JWT verification)
│   │   ├── errorHandler.js (global error catching)
│   │   ├── requestValidator.js (Joi schemas)
│   │   ├── logger.js (request logging)
│   │   ├── rateLimiter.js (per-endpoint + global)
│   │   └── corsHandler.js (CORS config)
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   │   ├── POST /auth/request-magic-link (email)
│   │   │   ├── POST /auth/verify-magic-link (token)
│   │   │   ├── POST /auth/refresh-token
│   │   │   └── POST /auth/logout
│   │   ├── users.js
│   │   │   ├── GET /users/me (current user + profile)
│   │   │   ├── PUT /users/me (update profile)
│   │   │   └── POST /users/me/export (data export)
│   │   ├── training/
│   │   │   ├── GET /training/sessions
│   │   │   ├── POST /training/sessions
│   │   │   ├── PUT /training/sessions/:id
│   │   │   ├── DELETE /training/sessions/:id
│   │   │   ├── POST /training/sessions/bulk-upsert (sync)
│   │   │   └── GET /training/sync-log (what changed)
│   │   ├── schedule.js
│   │   │   ├── GET /schedule
│   │   │   ├── PUT /schedule
│   │   │   └── POST /schedule/bulk-sync
│   │   ├── goals.js
│   │   ├── techniques.js
│   │   ├── achievements.js
│   │   ├── stats.js
│   │   └── health.js (GET /health for monitoring)
│   │
│   ├── controllers/
│   │   ├── authController.js (business logic)
│   │   │   ├── requestMagicLink()
│   │   │   ├── verifyMagicLink()
│   │   │   ├── refreshToken()
│   │   │   └── logout()
│   │   ├── userController.js
│   │   ├── trainingController.js
│   │   ├── scheduleController.js
│   │   ├── goalsController.js
│   │   ├── techniquesController.js
│   │   ├── achievementsController.js
│   │   └── statsController.js
│   │
│   ├── services/
│   │   ├── authService.js (JWT generation, validation)
│   │   ├── emailService.js (send magic links)
│   │   ├── userService.js (user CRUD)
│   │   ├── trainingService.js (sessions logic)
│   │   ├── syncService.js (**critical** - conflict resolution)
│   │   ├── validationService.js (Joi schemas)
│   │   └── cacheService.js (Redis, if implemented)
│   │
│   ├── utils/
│   │   ├── tokenGenerator.js (JWT, refresh tokens)
│   │   ├── hashUtils.js (bcrypt wrappers)
│   │   ├── dateUtils.js (shared date logic)
│   │   ├── errorClasses.js (AppError, ValidationError)
│   │   ├── logger.js (Winston/pino)
│   │   └── constants.js (TTLs, limits)
│   │
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── training.test.js
│   │   └── ...
│   │
│   ├── app.js (Express app setup)
│   └── server.js (entry point)
│
├── package.json
├── .env.example
├── .gitignore
├── jest.config.js
└── README.md
```

### 3.3 Resource Structure

```
Typical backend response structure (all endpoints):

Success (200/201):
{
  "success": true,
  "data": {
    // entity or array of entities
  },
  "meta": {
    "timestamp": "2026-05-14T10:30:00Z",
    "version": "1.0"
  }
}

Error (400/401/500):
{
  "success": false,
  "error": {
    "code": "INVALID_EMAIL",
    "message": "Email is required",
    "details": { ... }
  },
  "meta": { ... }
}

Bulk sync response:
{
  "success": true,
  "data": {
    "synced": [ entity1, entity2 ],
    "conflicts": [ { local, server, resolution } ],
    "created": 5,
    "updated": 3,
    "deleted": 0
  }
}
```

---

## 4. AUTHENTICATION ARCHITECTURE (MAGIC LINKS)

### 4.1 Magic Link Flow (Passwordless)

```
┌─────────────────────────────────────────────────────────────┐
│                 MAGIC LINK AUTHENTICATION FLOW              │
└─────────────────────────────────────────────────────────────┘

STEP 1: User requests magic link
────────────────────────────────
Request:
  POST /auth/request-magic-link
  {
    "email": "user@example.com"
  }

Server logic:
  ├── 1. Validate email format
  ├── 2. Check rate limit (max 3 attempts per hour per IP)
  ├── 3. Generate token: crypto.randomBytes(32).toString('hex')
  ├── 4. Hash token: bcrypt(token, salt=10)
  ├── 5. Store hashed token in DB:
  │   {
  │     email: "user@example.com",
  │     tokenHash: "bcrypt_hash...",
  │     createdAt: now,
  │     expiresAt: now + 15 minutes,
  │     isUsed: false
  │   }
  ├── 6. Send email with link:
  │   "https://effetmer.app/auth/magic-link?token={rawToken}&email={email}"
  ├── 7. Return: { success: true, message: "Check your email" }
  └── 8. Client stores email in sessionStorage for confirmation screen

Response:
  {
    "success": true,
    "message": "Magic link sent to user@example.com",
    "expiresIn": 900 // 15 minutes
  }

Browser UX:
  └─ Show: "Check your email! Link expires in 15 minutes"
     └─ Allow resend after 30 seconds


STEP 2: User clicks magic link
───────────────────────────────
Link URL: /auth/magic-link?token=<raw_token>&email=<email>

Frontend receives token:
  ├── 1. Extract token & email from URL
  ├── 2. POST /auth/verify-magic-link with { token, email }
  └── 3. Show "Verifying..." spinner


STEP 3: Server verifies token
──────────────────────────────
Request:
  POST /auth/verify-magic-link
  {
    "email": "user@example.com",
    "token": "raw_token_from_url"
  }

Server logic:
  ├── 1. Find AuthToken record with this email
  ├── 2. If not found:
  │   └─ Return 401: "Invalid or expired link"
  ├── 3. If token is expired (now > expiresAt):
  │   └─ Return 401: "Link expired. Request new one"
  ├── 4. If token already used (isUsed = true):
  │   └─ Return 401: "Link already used"
  ├── 5. Verify raw token against hash: bcrypt.compare(token, tokenHash)
  ├── 6. If mismatch:
  │   └─ Return 401: "Invalid token"
  ├── 7. Mark token as used: isUsed = true, usedAt = now
  │
  ├── 8. Check if user exists with this email
  │   If NOT exists:
  │   └─ CREATE new user:
  │       {
  │         email: "user@example.com",
  │         profile: { /* empty */ },
  │         createdAt: now,
  │         hasLocalData: false,
  │         settings: { /* defaults */ }
  │       }
  │
  ├── 9. If user exists but has `hasLocalData=true`:
  │   └─ IMPORTANT: Later will upload local data (in step 4)
  │
  ├── 10. Generate JWT tokens:
  │   ├─ accessToken (15 min expiry):
  │   │   {
  │   │     userId: "mongo_id",
  │   │     email: "user@example.com",
  │   │     type: "access",
  │   │     iat: now,
  │   │     exp: now + 15 min
  │   │   }
  │   └─ refreshToken (7 days expiry):
  │       {
  │         userId: "mongo_id",
  │         type: "refresh",
  │         tokenVersion: 1,
  │         iat: now,
  │         exp: now + 7 days
  │       }
  │
  ├── 11. Store refresh token in DB for revocation:
  │   {
  │     userId: "mongo_id",
  │     tokenHash: bcrypt(refreshToken),
  │     createdAt: now,
  │     expiresAt: now + 7 days,
  │     deviceId: extracted from User-Agent (optional)
  │   }
  │
  ├── 12. Return { accessToken, refreshToken }
  └── 13. Set httpOnly cookie for refreshToken (if web)

Response:
  {
    "success": true,
    "data": {
      "user": {
        "id": "mongo_user_id",
        "email": "user@example.com",
        "profile": { /* profile data */ },
        "createdAt": "2026-05-14T..."
      },
      "tokens": {
        "accessToken": "eyJhbGc...",
        "refreshToken": "eyJhbGc..." // sent in httpOnly cookie
      },
      "shouldMigrateLocalData": false
    }
  }

Frontend:
  ├── Store accessToken in memory
  ├── Store refreshToken in localStorage (web) or secure storage (mobile)
  ├── Set "isAuthenticated = true" in AuthContext
  ├── Redirect to HomePage
  └── If shouldMigrateLocalData:
      ├─ Show: "Migrating your offline data..."
      └─ POST /users/me/migrate-local-data with all local data


STEP 4: Subsequent requests (with JWT)
────────────────────────────────────────
All authenticated requests:
  Authorization: "Bearer eyJhbGc..."

Middleware:
  ├── Extract token from Authorization header
  ├── Verify JWT signature with secret key
  ├── Check expiry
  ├── If expired:
  │   └─ Return 401: "Token expired"
  │   └─ Frontend should use refreshToken to get new accessToken
  ├── If valid:
  │   ├─ Decode payload
  │   ├─ Attach userId to req.user
  │   └─ Continue to route handler
  └─ If invalid:
      └─ Return 401: "Unauthorized"


STEP 5: Token refresh
──────────────────────
When accessToken expires but refreshToken is valid:

Request:
  POST /auth/refresh-token
  {
    "refreshToken": "eyJhbGc..."
  }

Server logic:
  ├── Verify refreshToken signature
  ├── Find matching token in database
  ├── If expired:
  │   └─ Return 401: "Session expired. Login again"
  ├── If token removed (revoked):
  │   └─ Return 401: "Session revoked"
  ├── Generate new accessToken
  ├── Optionally rotate refreshToken (for security):
  │   ├─ Store new refreshToken in DB
  │   ├─ Mark old token as revoked
  │   └─ Return new refreshToken
  └─ Return { accessToken, refreshToken (new if rotated) }

Frontend:
  ├── Update accessToken in memory
  ├── Update refreshToken in localStorage (if rotated)
  └─ Retry original request with new accessToken


STEP 6: Logout
───────────────
Request:
  POST /auth/logout
  Authorization: "Bearer <accessToken>"

Server logic:
  ├── Get userId from JWT
  ├── Find and mark all refreshTokens as revoked:
  │   {
  │     userId: userId,
  │     revokedAt: now
  │   }
  ├── Optionally delete all sessions for this user
  │   (if user clicked "logout from all devices")
  └─ Return { success: true }

Frontend:
  ├── Clear accessToken from memory
  ├── Clear refreshToken from localStorage
  ├── Clear AuthContext
  ├── Clear all cached data (optional, or keep for offline mode)
  └─ Redirect to LoginPage

Response:
  {
    "success": true,
    "message": "Logged out successfully"
  }
```

### 4.2 Token Architecture

```
ACCESS TOKEN (JWT)
├── Type: Short-lived, stateless
├── TTL: 15 minutes
├── Storage: Memory (in frontend)
├── Purpose: Authorization for API requests
├── Renewal: Refresh token
└── Claims:
    {
      "userId": "mongo_id",
      "email": "user@example.com",
      "type": "access",
      "iat": 1684000000,
      "exp": 1684000900
    }

REFRESH TOKEN (JWT/Opaque)
├── Type: Long-lived, stored in database (stateful)
├── TTL: 7 days
├── Storage: httpOnly cookie (web) or secure storage (mobile)
├── Purpose: Issue new access tokens
├── Rotation: Generate new token each use (optional best practice)
├── Database tracking: RefreshToken collection (for revocation)
└── Claims:
    {
      "userId": "mongo_id",
      "type": "refresh",
      "tokenVersion": 1,
      "iat": 1684000000,
      "exp": 1684604800
    }

MAGIC LINK TOKEN (OTP)
├── Type: Single-use, one-time password
├── TTL: 15 minutes
├── Storage: Database only (never sent twice)
├── Purpose: Verification for new login
├── Format: 64 random hex characters
├── Database tracking: AuthToken collection
└── Immutable after use
```

### 4.3 Session Persistence

```
Device Persistence:
├── accessToken:
│   ├─ Storage: Memory (in React state)
│   ├─ Duration: Valid for 15 minutes
│   ├─ Loss: Gone if page refresh
│   └─ Solution: Intercept page refresh → use refreshToken → get new accessToken
│
├── refreshToken:
│   ├─ Storage: localStorage + httpOnly cookie
│   ├─ Duration: Valid for 7 days
│   ├─ Persistence: Survives page refresh, browser close, etc.
│   └─ Renewal: Automatic when accessToken expires
│
└── User profile:
    ├─ Storage: React state + localStorage
    ├─ Duration: Loaded from server on app start
    ├─ Sync: Automatic if data changed elsewhere
    └─ Fallback: Use cachedProfile if offline

Multi-device Behavior:
├── Device A: Login → receives refreshToken_A
├── Device B: Login → receives refreshToken_B (different token)
├── Each token is tracked separately in database
├── Logout on D A: Only revokes refreshToken_A
├── User can have multiple active sessions
├── Logout from all: Server revokes all tokens for user
```

---

## 5. DATABASE ARCHITECTURE

### 5.1 MongoDB Schema Design

```
DATABASE: effetmer_db

┌─────────────────────────────────────────┐
│           USERS Collection              │
├─────────────────────────────────────────┤
{
  _id: ObjectId,
  email: String (unique, indexed),
  profile: {
    firstName: String,
    lastName: String,
    academy: String,
    belt: String (enum: white/blue/purple/brown/black),
    weight: Number,
    yearsOfPractice: Number,
    weeklyGoal: Number,
    preferredTrainingDays: [String],
    profilePicture: String (URL)
  },
  settings: {
    theme: String (light/dark),
    language: String,
    notifications: {
      email: Boolean,
      push: Boolean
    },
    privacy: {
      shareProgressPublicly: Boolean,
      showOnLeaderboard: Boolean
    }
  },
  stats: {
    totalSessions: Number,
    totalHours: Number,
    streak: Number,
    lastTrainingDate: Date
  },
  hasLocalData: Boolean (flag for first login migration),
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date (soft delete),
  v: Number (version field)
}

Indexes:
  - email (unique)
  - createdAt (for listing)
  - deletedAt (soft delete queries)
```

```
┌──────────────────────────────────────────┐
│     TRAINING_SESSIONS Collection         │
├──────────────────────────────────────────┤
{
  _id: ObjectId,
  userId: ObjectId (ref Users, indexed),

  metadata: {
    date: Date (training date),
    type: String (enum: techniques/drill/sparring/openmat/muscu/cardio/competition),
    duration: Number (minutes),
    partner: String (optional, partner name),
    location: String (optional, academy/gym/home)
  },

  content: {
    title: String,
    notes: String,
    techniques: [{
      name: String,
      category: String,
      status: String (learned/drilling/sharpening/teaching),
      notes: String
    }],
    videoLink: String (optional, YouTube/Drive URL)
  },

  physical: {
    weight: Number (optional, weight during session),
    intensity: Number (1-10),
    energy: Number (1-10)
  },

  achievements: {
    prStreak: Boolean (new personal record),
    milestone: String (optional)
  },

  sync: {
    deviceId: String (which device created this),
    localTimestamp: Date (when created locally),
    serverTimestamp: Date (when received by server),
    offline: Boolean (was it created while offline),
    conflictResolution: String (if synced)
  },

  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date (soft delete for sync),
  v: Number (version for conflict detection)
}

Indexes:
  - userId, date (compound, most queries)
  - userId, createdAt
  - userId, type
  - userId, deletedAt
```

```
┌────────────────────────────────────────┐
│    TRAINING_SCHEDULES Collection       │
├────────────────────────────────────────┤
{
  _id: ObjectId,
  userId: ObjectId (ref Users, indexed),

  schedule: {
    Monday: String (time or "off"),
    Tuesday: String,
    Wednesday: String,
    Thursday: String,
    Friday: String,
    Saturday: String,
    Sunday: String
  },

  preferences: {
    weeklyGoal: Number (sessions per week),
    preferredTimes: [String],
    preferredTypes: [String]
  },

  createdAt: Date,
  updatedAt: Date,
  v: Number
}

Indexes:
  - userId (unique, one per user)
```

```
┌────────────────────────────────────────┐
│          GOALS Collection              │
├────────────────────────────────────────┤
{
  _id: ObjectId,
  userId: ObjectId (ref Users, indexed),

  goal: {
    title: String,
    description: String,
    category: String (enum: technique/fitness/consistency/competition/other),
    target: String (description of target),
    deadline: Date,
    priority: String (high/medium/low)
  },

  progress: {
    status: String (enum: active/completed/abandoned),
    completedAt: Date (if completed),
    progressPercentage: Number (0-100)
  },

  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date,
  v: Number
}

Indexes:
  - userId, status
  - userId, createdAt
```

```
┌────────────────────────────────────────┐
│       ACHIEVEMENTS Collection          │
├────────────────────────────────────────┤
{
  _id: ObjectId,
  userId: ObjectId (ref Users, indexed),

  badge: {
    badgeId: String (first_session/week_warrior/consistency_7, etc.),
    name: String,
    description: String,
    icon: String (emoji),
    community: Boolean (shared on leaderboard)
  },

  earnedAt: Date,
  isNew: Boolean (for notifications),

  v: Number
}

Indexes:
  - userId, badgeId (compound, unique per user)
  - userId, earnedAt
```

```
┌────────────────────────────────────────┐
│        TECHNIQUES Collection           │
├────────────────────────────────────────┤
{
  _id: ObjectId,
  userId: ObjectId (ref Users, indexed),

  technique: {
    title: String,
    category: String,
    notes: String,
    status: String (enum: learned/drilling/sharpening/teaching),
    videoLink: String (optional, external URL),
    dateLearned: Date
  },

  proficiency: {
    level: Number (1-5),
    practiceCount: Number
  },

  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date,
  v: Number
}

Indexes:
  - userId, status
  - userId, createdAt
```

```
┌──────────────────────────────────────────┐
│    AUTH_TOKENS Collection (Magic Links)  │
├──────────────────────────────────────────┤
{
  _id: ObjectId,
  email: String (indexed),
  tokenHash: String (bcrypt hash of token),

  expiresAt: Date (15 minutes from creation),
  isUsed: Boolean,
  usedAt: Date (if used),

  createdAt: Date
}

Indexes:
  - email, expiresAt (for cleanup)
  - TTL index: expiresAt (auto-delete after 15 min)
```

```
┌──────────────────────────────────────────┐
│   REFRESH_TOKENS Collection              │
├──────────────────────────────────────────┤
{
  _id: ObjectId,
  userId: ObjectId (ref Users, indexed),
  tokenHash: String (bcrypt hash),

  metadata: {
    deviceId: String (optional, User-Agent hash),
    ipAddress: String (optional, for security audit),
    userAgent: String (optional)
  },

  expiresAt: Date (7 days from creation),
  revokedAt: Date (if revoked),

  createdAt: Date
}

Indexes:
  - userId, expiresAt (compound)
  - userId, revokedAt (for active sessions)
  - TTL index: expiresAt (auto-delete after 7 days of expiry)
```

```
┌──────────────────────────────────────────┐
│      SYNC_LOGS Collection                │
├──────────────────────────────────────────┤
{
  _id: ObjectId,
  userId: ObjectId (ref Users, indexed),

  operation: {
    type: String (enum: create/update/delete),
    entityType: String (session/goal/technique/etc.),
    entityId: ObjectId,
    changes: Object (what changed)
  },

  sync: {
    status: String (enum: pending/synced/conflict),
    conflictWith: String (if conflict),
    resolution: String (auto/manual_server/manual_local)
  },

  device: {
    deviceId: String,
    offline: Boolean,
    timestamp: Date
  },

  createdAt: Date
}

Indexes:
  - userId, status
  - userId, createdAt
  - userId, status, entityType (for queries)
```

### 5.2 Relationships Diagram

```
Users (1) ──── (M) TrainingSessions
  |                \
  |                 - Contains training data
  |
  +── (1) TrainingSchedules
  |       - Weekly schedule per user
  |
  +── (M) Goals
  |       - Multiple personal goals
  |
  +── (M) Achievements
  |       - Multiple earned badges
  |
  +── (M) Techniques
  |       - Multiple learned techniques
  |
  +── (M) AuthTokens (Magic Links)
  |       - Used for login
  |
  +── (M) RefreshTokens
  |       - Multiple active sessions (devices)
  |
  └── (M) SyncLogs
          - Audit trail of changes
```

### 5.3 Indexing Strategy

```
Performance Optimization:

Priority 1 - Most Frequent Queries:
├── users: email (unique)
├── trainingSessions: (userId, date) compound
├── trainingSessions: userId, type (filtering by type)
├── goals: (userId, status) compound
├── techniques: (userId, status) compound
└── refreshTokens: (userId, revokedAt) for session validation

Priority 2 - Common Filters:
├── trainingSessions: (userId, createdAt)
├── goals: (userId, createdAt)
├── achievements: (userId, earnedAt)
├── techniques: (userId, createdAt)
└── authTokens: (email, expiresAt)

Priority 3 - Soft Delete Cleanup:
├── All collections: deletedAt (for filtering out deleted records)

Priority 4 - TTL Indexes (Auto-cleanup):
├── authTokens: expiresAt (remove after 15 minutes)
├── refreshTokens: expiresAt (remove 7 days after logout)

Query Patterns:
├── Get user sessions for date range
│   └─ db.trainingSessions.find({ userId, date: {$gte, $lte} }).sort({date: -1})
│
├── Get user stats
│   └─ db.trainingSessions.aggregate([
│       {$match: {userId, deletedAt: null}},
│       {$group: {_id: $type, count: {$sum: 1}}}
│     ])
│
├── Check if refresh token valid
│   └─ db.refreshTokens.findOne({userId, tokenHash, revokedAt: null})
│
└── Get pending sync operations
    └─ db.syncLogs.find({userId, status: "pending"}).sort({createdAt: 1})
```

---

## 6. API ARCHITECTURE

### 6.1 API Routes Overview

```
Authentication Endpoints:
  POST   /auth/request-magic-link        - Request magic link via email
  POST   /auth/verify-magic-link         - Verify token and create session
  POST   /auth/refresh-token             - Get new access token
  POST   /auth/logout                    - Logout (revoke tokens)

User Endpoints:
  GET    /users/me                       - Get current user + profile
  PUT    /users/me                       - Update user profile
  GET    /users/me/stats                 - Get user statistics
  POST   /users/me/export-data           - Export all data as JSON
  POST   /users/me/migrate-local-data    - Upload local storage data

Training Endpoints:
  GET    /training/sessions              - List sessions (paginated, filtered)
  POST   /training/sessions              - Create new session
  GET    /training/sessions/:id          - Get single session
  PUT    /training/sessions/:id          - Update session
  DELETE /training/sessions/:id          - Delete session
  POST   /training/sessions/bulk-upsert  - **CRITICAL** - sync all sessions (conflict resolution)
  GET    /training/sync-log              - Get what changed since timestamp

Schedule Endpoints:
  GET    /schedule                       - Get user's training schedule
  PUT    /schedule                       - Update schedule
  POST   /schedule/bulk-sync             - Sync schedule

Goals Endpoints:
  GET    /goals                          - List goals
  POST   /goals                          - Create goal
  PUT    /goals/:id                      - Update goal
  DELETE /goals/:id                      - Delete goal
  POST   /goals/bulk-sync                - Bulk sync

Techniques Endpoints:
  GET    /techniques                     - List learned techniques
  POST   /techniques                     - Add technique
  PUT    /techniques/:id                 - Update technique
  DELETE /techniques/:id                 - Delete technique
  POST   /techniques/bulk-sync           - Bulk sync

Achievements Endpoints:
  GET    /achievements                   - List earned badges
  (achievements auto-generated by rules, no CRUD)

Stats Endpoints:
  GET    /stats/dashboard                - Dashboard summary
  GET    /stats/progression              - Progression tier data
  GET    /stats/monthly                  - Monthly breakdown

Health/Monitoring:
  GET    /health                         - Health check (for uptime monitoring)
```

### 6.2 Request/Response Contract

```
All requests must include:
├── Authorization: Bearer <accessToken> (in header)
├── Content-Type: application/json
└── Optional: X-Client-Version (for deprecation handling)

All responses follow this structure:
┌────────────────────────────────────────┐
│ SUCCESS (200/201):                     │
├────────────────────────────────────────┤
{
  "success": true,
  "data": {
    // entity or array of entities
    // structure varies per endpoint
  },
  "meta": {
    "timestamp": "2026-05-14T10:30:00Z",
    "version": "1.0"
  }
}
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ ERROR (4xx/5xx):                       │
├────────────────────────────────────────┤
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",           // machine-readable
    "message": "Human readable",    // user-friendly
    "details": {                    // extra context
      "field": "email",
      "reason": "already exists"
    },
    "requestId": "req_123456"       // for support
  },
  "meta": {
    "timestamp": "2026-05-14T10:30:00Z"
  }
}
└────────────────────────────────────────┘

Bulk sync response (critical for offline-first):
{
  "success": true,
  "data": {
    "synced": [
      // entities that were synced without conflict
    ],
    "conflicts": [
      {
        "entityId": "mongo_id",
        "entityType": "session",
        "local": { /* client version */ },
        "server": { /* server version */ },
        "resolution": "server",  // which one won
        "reason": "server version is newer"
      }
    ],
    "created": 5,        // how many new records
    "updated": 3,        // how many existing updated
    "deleted": 0,        // how many deleted
    "failed": 0
  },
  "meta": { ... }
}
```

### 6.3 Bulk Sync Endpoint (Critical)

```
Endpoint: POST /training/sessions/bulk-upsert
Purpose: Synchronizing offline changes with server

Request:
{
  "operations": [
    {
      "operation": "create",     // or "update" or "delete"
      "entityId": "local_id",    // local ID if offline-created
      "entity": {
        "date": "2026-05-10",
        "type": "sparring",
        "duration": 60,
        "notes": "...",
        "techniques": [...]
      },
      "metadata": {
        "localTimestamp": "2026-05-10T14:30:00Z",
        "deviceId": "device_hash",
        "offline": true
      }
    },
    // ... more operations
  ],
  "clientVersion": "1.2.0",
  "lastSyncTime": "2026-05-08T10:00:00Z"  // for server to detect changes
}

Server Logic:
├── For each operation:
│
│   ├─ IF create:
│   │   ├─ Generate server _id
│   │   ├─ Store with serverTimestamp + v=1
│   │   └─ Return { operation: "create", old: null, new: {...}, conflict: false }
│   │
│   ├─ IF update:
│   │   ├─ Check if entity exists in DB
│   │   ├─ Compare versions:
│   │   │   ├─ If client.v == server.v:
│   │   │   │   └─ Update to server.v+1, accept changes
│   │   │   └─ If client.v != server.v:
│   │   │       ├─ CONFLICT DETECTED
│   │   │       ├─ Compare timestamps
│   │   │       ├─ Server-wins strategy: use server version
│   │   │       └─ Return { conflict: true, resolution: "server", ... }
│   │   └─ Detect server-side merges (other device changed same record)
│   │
│   ├─ IF delete:
│   │   ├─ Soft delete: set deletedAt = now
│   │   ├─ This propagates to client next sync
│   │   └─ Hard delete optional (configurable)
│   │
│   └─ Create SyncLog entry for audit trail
│
├── Return all results:
│   ├─ synced: successful operations
│   ├─ conflicts: what conflicted + resolution
│   └─ failed: any errors

Response:
{
  "success": true,
  "data": {
    "synced": [
      {
        "operation": "create",
        "entityId": "mongo_id_assigned",
        "entity": { /* full entity with _id */ },
        "serverTimestamp": "2026-05-14T..."
      },
      {
        "operation": "update",
        "entityId": "mongo_id",
        "entity": { /* updated entity */ },
        "conflict": false
      }
    ],
    "conflicts": [
      {
        "entityId": "mongo_id",
        "entityType": "session",
        "local": {
          "notes": "My version",
          "v": 1
        },
        "server": {
          "notes": "Synced from other device",
          "v": 2
        },
        "resolution": "server",
        "reason": "Server version is newer (v2 > v1)"
      }
    ],
    "created": 2,
    "updated": 3,
    "deleted": 0,
    "conflicts": 1,
    "failed": 0
  }
}
```

### 6.4 Pagination & Filtering

```
List endpoints support pagination for performance:

Query parameters:
  ?page=1
  &limit=25
  &sort=-date           // - for descending
  &filter=type:sparring
  &filter=date:gte:2026-05-01
  &search=keywords

Example:
  GET /training/sessions?page=2&limit=20&sort=-date&filter=type:sparring

Response:
{
  "success": true,
  "data": [
    // array of entities
  ],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "hasNext": true,
    "hasPrev": true
  }
}
```

---

## 7. OFFLINE-FIRST SYNC STRATEGY

### 7.1 Local Cache & Queue Architecture

```
Frontend Storage Layers (Priority Order):
┌─────────────────────────────────────────────────────┐
│ Layer 1: Memory (React State)                       │
│ ├─ Fastest access                                   │
│ ├─ Lost on page refresh                            │
│ └─ Contains: active user data, UI state            │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Layer 2: localStorage (Browser)                     │
│ ├─ Persistent across page refreshes                │
│ ├─ ~5-10MB limit (usually)                         │
│ ├─ Sync bottleneck (JSON serialization)            │
│ └─ Contains: profile, settings, serialized data    │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Layer 3: IndexedDB (Browser)                        │
│ ├─ Persistent, much larger (~50MB+)                │
│ ├─ Async access (more efficient for large data)    │
│ ├─ Better for bulk operations                      │
│ └─ Purpose: Sync queue, full data cache            │
└─────────────────────────────────────────────────────┘

Frontend Data Architecture:

const useSync = (entityType, localKey) => {
  // Returns data with intelligent fallback

  // Priority 1: Server (if online & fresh)
  // Priority 2: Memory cache
  // Priority 3: IndexedDB cache
  // Priority 4: localStorage (fallback)
  // Priority 5: Empty/placeholder

  return {
    data,
    isOnline,
    isSynced,
    isPending,
    lastSync,
    addToQueue,
    markForSync
  }
}

// Usage in component:
const { data, isPending } = useSync('sessions', 'trainingSessions');
// Automatically handles offline/online transitions
```

### 7.2 Sync Queue & Reconciliation

```
┌──────────────────────────────────────────────────────┐
│              OFFLINE → ONLINE FLOW                   │
└──────────────────────────────────────────────────────┘

OFFLINE PHASE:
──────────────
User Action
  ├─ Component calls: session.save() or session.update()
  │
  ├─ Operation:
  │   ├─ Assign local optimistic ID: "offline_uuid_123"
  │   ├─ Add timestamp: Date.now()
  │   ├─ Mark: { offline: true, pending: true }
  │   └─ Store in IndexedDB Sync Queue
  │
  ├─ UI Update:
  │   ├─ Show: "⏱️ Saving..."
  │   └─ Update optimistically (local object updates)
  │
  ├─ User sees the change immediately (perception of speed)
  │   └─ App remains responsive
  │
  └─ Queue entry:
      {
        id: "offline_uuid_123",
        operation: "create",
        entityType: "session",
        entity: { /* data */ },
        offlineTimestamp: 1684000000,
        synced: false,
        attempts: 0
      }


ONLINE TRANSITION:
──────────────────
Network Status Change
  ├─ Detected: navigator.onLine = true
  │   OR fetch to /health succeeds
  │   OR event: 'online'
  │
  ├─ Trigger: syncEngine.startSync()
  │
  ├─ UI Update:
  │   └─ Show: "🔄 Syncing X changes..."
  │
  └─ Begin bulk sync

SYNC PHASE (Bulk Upsert):
─────────────────────────
GET IndexedDB Sync Queue
  ├─ Read all pending operations
  ├─ Build request payload:
      {
        "operations": [
          {
            "operation": "create",
            "entityId": "offline_uuid_123",
            "entity": {...},
            "metadata": {...}
          },
          // more operations
        ]
      }
  │
  └─ POST /training/sessions/bulk-upsert with full payload

Server Response
  ├─ For each operation:
  │   ├─ If no conflict:
  │   │   └─ Generate server _id, sync done
  │   └─ If conflict:
  │       ├─ Compare versions
  │       ├─ Server-wins by default
  │       ├─ Return conflict details
  │       └─ Client can choose strategy
  │
  ├─ Return:
      {
        "synced": [ /* successful ops */ ],
        "conflicts": [ /* conflicts */ ]
      }

Client Reconciliation:
├─ For each synced operation:
│   ├─ Replace local optimistic ID with server _id
│   ├─ Update version number (v)
│   ├─ Set: offline=false, synced=true
│   └─ Remove from Sync Queue
│
├─ For each conflict:
│   ├─ If auto-resolution strategy:
│   │   ├─ Accept server version (discard local changes)
│   │   ├─ Notify user: "⚠️ This record was edited on another device"
│   │   └─ Update in memory
│   └─ If manual resolution required:
│       ├─ Show conflict resolution UI
│       ├─ Let user choose: "Keep Mine" or "Accept Server"
│       └─ Re-sync choice to server if local kept
│
├─ Update IndexedDB:
│   ├─ Mark queue items as synced
│   ├─ Delete completed operations
│   └─ Keep conflicts for retry
│
├─ Update React state:
│   ├─ Merge synced data into AppContext
│   ├─ Show synced feedback
│   └─ Auto-hide spinner after 2s
│
└─ Event: emit 'sync:complete'
    ├─ Propagate to components
    └─ Refresh UI if needed


RETRY LOGIC:
─────────────
If sync fails (network error):
  ├─ Failed operation:
      {
        ...item,
        attempts: attempts + 1,
        lastError: error,
        nextRetry: now + exponentialBackoff(attempts)
      }
  │
  ├─ Show: "⚠️ Sync failed. Will retry later."
  │
  └─ Automatic retry:
      ├─ After 5 seconds (attempt 1)
      ├─ After 30 seconds (attempt 2)
      ├─ After 2 minutes (attempt 3)
      ├─ After 15 minutes (attempt 4+)
      └─ Max attempts: 10, then alert user
```

### 7.3 Conflict Resolution Strategy

```
Conflict Detection:
─────────────────
Scenario: User A and User B both editing same session on different devices

Device A (Offline):           Device B (Online):
├─ Load session v=5           ├─ Load session v=5
├─ Edit notes                 ├─ Edit notes
├─ Update v=5                 ├─ Save: PATCH /sessions/123
├─ Offline, queued            ├─ Server: v=5 → v=6
└─ Wait for sync              └─ User B has latest

Later, Device A comes online:
├─ Send PATCH /sessions/123 with v=5 (old version)
├─ Server receives v=5 but current is v=6
├─ CONFLICT: 5 ≠ 6
├─ Server rejects: "Version mismatch"
└─ Client receives conflict details

Resolution Strategies:
─────────────────────

Strategy 1: SERVER-WINS (Default)
├─ Action: Discard local changes
├─ Update local to server version (v=6)
├─ Notify: "⚠️ This was edited elsewhere. Server version restored."
├─ User can manually re-edit if needed
└─ Minimal data loss, simple logic

Strategy 2: LOCAL-MERGE (for specific fields)
├─ Action: Merge non-conflicting fields
├─ Example:
│   ├─ Server changed: notes_field, duration
│   ├─ Local changed: techniques, tags
│   └─ Merge: keep all changes (no conflict)
│
└─ Use case: Last-write-wins could lose important server data

Strategy 3: OPERATIONAL TRANSFORMATION (Complex)
├─ Action: Transform local ops against server ops
├─ Pro: Fewer conflicts, data not lost
├─ Con: Complex to implement, CRDTs required
├─ Skip for MVP, add later if needed

EFFETMER Strategy (Recommended - MVP):
├─ Use: SERVER-WINS for v1
├─ Reason: Simple, predictable, data safe on server
├─ Fallback: If user needs their changes, they can re-edit
├─ Future: Add field-level granularity if needed

Example Conflict Resolution Code:
────────────────────────────────
{
  "conflicts": [
    {
      "entityId": "session_123",
      "entityType": "session",
      "local": {
        "v": 5,
        "notes": "My notes",
        "techniques": ["RNC", "Triangle"],
        "localTimestamp": "2026-05-14T10:00:00Z"
      },
      "server": {
        "v": 6,
        "notes": "Notes from another device",
        "techniques": ["RNC"],
        "techniques_added": ["Armbar"],
        "serverTimestamp": "2026-05-14T09:55:00Z"
      },
      "resolution": "server",
      "reason": "Server version is newer",
      "userNotification": "This record was modified on another device. Latest version restored."
    }
  ]
}
```

### 7.4 Offline Data Visibility

```
Critical: User must still see/work with data while offline

Display Rules:

Data that was synced (on server):
  ├─ Show: ✓ (no indicator needed)
  └─ Flag: synced=true

Data that's pending sync:
  ├─ Show: ⏱️ (small clock icon)
  ├─ Tooltip: "Saving... (2 mins ago)"
  └─ Flag: pending=true, offlineTimestamp

Data that failed sync:
  ├─ Show: ⚠️ (warning icon)
  ├─ Tooltip: "Failed to sync. Will retry."
  └─ Flag: failed=true, lastError

Data that conflicts:
  ├─ Show: ⚔️ (conflict icon)
  ├─ Tooltip: "Conflicting changes. Tap to resolve."
  └─ Allow user to choose version

Component Example:
──────────────────
<SessionCard
  session={session}
  status={status}  // synced/pending/failed/conflict
>
  <p>{session.notes}</p>
  {status.pending && <div className="icon_pending" />}  // ⏱️
  {status.failed && <div className="icon_failed" />}    // ⚠️
  {status.conflict && <div className="icon_conflict" />} // ⚔️
</SessionCard>
```

---

## 8. SECURITY ARCHITECTURE

### 8.1 Authentication Security

```
Magic Link Security:

Token Generation:
├─ Use: crypto.randomBytes(32) → 64 hex characters
├─ Never: sequential IDs, predictable patterns
├─ Length: 256 bits (strong enough for brute force resistance)
├─ Entropy: ~1.3 × 10^19 combinations

Token Storage:
├─ DO NOT store raw token in database
├─ Store: bcrypt hash of token (cost factor = 10)
├─ Raw token sent only in email link
├─ Token never logged, never exposed in errors

Token Usage:
├─ Single-use: Once claimed, mark isUsed = true
├─ Expiration: 15 minutes (reasonable time to check email)
├─ No token reuse: If user clicks twice, reject second attempt
├─ Rate limiting: Max 3 magic link requests per hour per IP

Email Security:
├─ Verify email ownership (user must access email)
├─ Prevent email enumeration:
│   └─ Always say "Check your email" even if not found
├─ Rate limit per email: max 5 requests per day
├─ Log all attempts: for security audit

Brute Force Protection:
├─ Rate limit by IP: 10 requests per hour
├─ Rate limit by email: 3 requests per hour
├─ Exponential backoff after failures
├─ Lock account temporarily after 5 failed attempts
```

### 8.2 JWT Security

```
Token Generation:

Secret Management:
├─ Access Secret: Generate strong secret (min 32 chars, Random)
├─ Refresh Secret: Separate secret from Access secret
├─ Storage: Environment variables (.env)
│   ├─ NEVER commit .env to git
│   ├─ Use: .env.example with blank values
│   └─ Rotate secrets every 90 days in production
├─ Encryption: If using KMS, encrypt at rest

Token Structure:

Header:
{
  "alg": "HS256",           // HMAC-SHA256
  "typ": "JWT"
}

Payload:
{
  "userId": "mongo_id",
  "email": "user@example.com",
  "type": "access",         // access or refresh
  "iat": 1684000000,        // issued at (server time)
  "exp": 1684000900,        // expiration (15 min for access)
  "aud": "effetmer-app",    // audience (which app)
  "iss": "effetmer-backend" // issuer
}

Signature:
  HMAC-SHA256(
    base64url(header) + "." + base64url(payload),
    secret_key
  )

Token Lifespan:
├─ Access Token: 15 minutes (short-lived)
├─ Refresh Token: 7 days (long-lived, can be rotated)
├─ Reasoning: Compromise of access token limited to 15 mins

Refresh Token Rotation:
├─ Each use of refresh token generates NEW refresh token
├─ Old token marked as used (optional, for extra security)
├─ Prevents: Token replay attacks
├─ Client always has latest token

Token Revocation:
├─ Store refresh token hash in database
├─ Cross-reference on each use
├─ Allow revocation before expiry
├─ Use case: Logout, security breach, suspicious activity
```

### 8.3 Session Security

```
HttpOnly Cookies:

Refresh Token Storage (Web):
  Set-Cookie: refreshToken=eyJhbGc...;
    Path=/;
    HttpOnly;           // JS cannot access (prevents XSS theft)
    Secure;             // HTTPS only
    SameSite=Strict;    // CSRF protection
    Max-Age=604800;     // 7 days

Benefits:
├─ XSS Vulnerability: Attacker cannot steal via document.cookie
├─ Automatic Sending: Browser auto-includes in all requests to origin
├─ Automatic Validation: Server verifies signature

Mobile PWA Storage:

Refresh Token Storage (Mobile Web):
├─ localStorage (encrypted by system?)
│   └─ Risk: Can be stolen by XSS
├─ Native app secure storage preferred
│   ├─ iOS: Keychain
│   ├─ Android: EncryptedSharedPreferences
│   └─ Requires: Wrapper app (not just PWA)

Access Token Storage (All):
├─ Memory only (in React state)
├─ Lost on page refresh (solved by refresh token)
├─ Not vulnerable to XSS (no localStorage)

Multi-Device Sessions:

Device A Logout:
├─ Revoke refreshToken_A only
├─ Device B unaffected (still has refreshToken_B)

Global Logout (all devices):
├─ Find all RefreshTokens for userId
├─ Mark all as revoked
├─ All devices lose access simultaneously

Device Identification:
├─ Optional: Hash of User-Agent + IP
├─ Purpose: Identify suspicious logins
├─ Example: "New login from Nigeria (your usual: USA)"
├─ Alert to user: Allow/Block new location
```

### 8.4 Request Validation & Sanitization

```
Input Validation:

Email Validation:
├─ Regex: RFC 5322 compliant email regex
├─ Also: Verify domain exists (DNS MX check optional)
├─ Normalize: lowercase, trim whitespace
├─ Library: joi or zod

JSON Schema Validation:

Example for creating training session:
├─ date: required, ISO date format, <= today
├─ type: required, enum (techniques/drill/sparring/...)
├─ duration: required, number, 1-480 minutes
├─ notes: optional, string, max 5000 chars
├─ techniques: optional, array of objects
│   ├─ name: required, string, max 100
│   ├─ category: required, string, enum
│   └─ status: required, enum

Sanitization:

String Fields:
├─ Trim whitespace
├─ Remove HTML tags (DOMPurify)
├─ Escape special characters
├─ Check length limits (prevent 1GB strings)

Number Fields:
├─ Coerce to number, reject non-numeric
├─ Validate range (min/max)
├─ Reject NaN, Infinity

Array Fields:
├─ Validate length (max items)
├─ Validate each item
├─ Reject circular references

Library: Joi validation on every endpoint

Example:
────────
const schema = joi.object({
  email: joi.string().email().required(),
  date: joi.date().iso().max('now').required(),
  duration: joi.number().min(1).max(480).required()
});

const { error, value } = schema.validate(req.body);
if (error) return res.status(400).json({ error });
```

### 8.5 CORS & Origin Protection

```
CORS Configuration:

Allowed Origins:
├─ https://effetmer.app (production)
├─ https://www.effetmer.app
├─ http://localhost:3000 (dev)
├─ http://localhost:3001 (dev)
├─ NOT: http://attacker.com
├─ NOT: wildcard * (too permissive)

Allowed Methods:
├─ GET, POST, PUT, DELETE, OPTIONS

Allowed Headers:
├─ Content-Type
├─ Authorization
├─ X-Client-Version
├─ X-Request-ID

Credentials:
├─ Allow: true (include cookies)
├─ Necessary for httpOnly cookie to work

Max Age:
├─ 86400 (24 hours, browser caches CORS result)

Implementation:
───────────────
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

### 8.6 Additional Security Measures

```
Rate Limiting:

API Rate Limits:
├─ Per User: 100 requests per minute
├─ Per IP: 1000 requests per minute
├─ Per Endpoint: some endpoints have stricter limits
│   ├─ /auth/request-magic-link: 3 per hour
│   ├─ /auth/verify-magic-link: 10 per hour
│   └─ /training/sessions/bulk-upsert: 60 per hour

Implementation:
├─ Redis store (for distributed rate limiting)
├─ express-rate-limit middleware
├─ Return: 429 Too Many Requests

helmet:
├─ X-Content-Type-Options: nosniff
├─ X-Frame-Options: DENY (no iframe embedding)
├─ X-XSS-Protection: 1; mode=block
├─ Strict-Transport-Security: HSTS header
├─ Content-Security-Policy: Restrict resource loading

HTTPS/TLS:
├─ AllowedOrigins: https:// only (except localhost)
├─ Certificates: Let's Encrypt (free)
├─ Redirect: http → https
├─ HSTS: Preload list for browsers

SQL/NoSQL Injection Prevention:

MongoDB (doesn't have SQL injection):
├─ But: Operator injection possible
├─ Example: {"$ne": null} in JSON
├─ Solution: Use Mongoose schema validation
├─ Prevent: Raw $where operations
├─ Validate: all inputs before queries

Environment Variables:

Never expose:
├─ Secret keys
├─ Database URLs
├─ API keys
├─ Passwords

Store in .env file:
├─ Database connection strings
├─ JWT secrets
├─ SendGrid API key
├─ External API keys

Logging:

Avoid logging:
├─ Passwords
├─ Tokens
├─ Sensitive data (email in logs ok, but not in stack traces)

Best practice:
├─ Log: what happened, who did it, when, result
├─ Example: "User user@example.com login successful at 10:30 UTC"
├─ Use: Winston or Pino logger with levels (debug/info/warn/error)
```

---

## 9. DEPLOYMENT STRATEGY

### 9.1 Environment Setup

```
Local Development:
├─ .env.local file (never committed)
├─ MongoDB: Local instance or MongoDB Atlas dev cluster
├─ Node version: 18 LTS
├─ npm or yarn
├─ Git

Staging Environment:
├─ Separate database (MongoDB Atlas staging cluster)
├─ Same code as production (test everything)
├─ Separate API keys
├─ Limited access (team only)

Production Environment:
├─ MongoDB Atlas: Production cluster, backups enabled
├─ Managed hosting: Heroku, Railways, Render, or DigitalOcean
├─ Environment variables: Set in platform dashboard
├─ Monitoring: Sentry, DataDog, or similar
├─ Backups: Daily backups,  30-day retention
```

### 9.2 MongoDB Atlas Setup

```
Step-by-step:

1. Create MongoDB Atlas Account
   └─ https://www.mongodb.com/cloud/atlas

2. Create Organization & Project
   ├─ Project name: effetmer
   └─ Create project

3. Create Database Cluster
   ├─ Cluster name: effetmer-prod
   ├─ Cloud provider: AWS, GCP, or Azure
   ├─ Region: Closest to users (e.g., us-east-1 for North America)
   ├─ Machine type: M0 Free tier for MVP, M10+ for production
   ├─ Backup: Enable automated backups
   └─ Create cluster (takes 5-10 mins)

4. Configure Network Access
   ├─ IP Whitelist:
   │   ├─ 0.0.0.0/0 (for Heroku/serverless) or
   │   ├─ Specific IPs of your servers
   │   └─ Important for security
   ├─ Database Access:
   │   ├─ Create user: "effetmer_app"
   │   ├─ Password: Strong random password
   │   ├─ Built-in Roles: "readWriteAnyDatabase"
   │   └─ Save credentials

5. Get Connection String
   ├─ Format: mongodb+srv://user:password@cluster.mongodb.net/dbname
   ├─ Store in: process.env.MONGODB_URI
   └─ Never commit to git

6. Create Application Database
   ├─ If using MongoDB shell or Compass
   ├─ Create: effetmer_db
   ├─ Collections: Mongoose will create automatically

Monitoring:
├─ Atlas Dashboard: Monitor metrics, alerts
├─ Alerts: Email when metrics exceed thresholds
├─ Metrics: Storage, connections, throughput
```

### 9.3 Backend Hosting Options

```
Option 1: Heroku (Easiest for MVP)
├─ Pros:
│   ├─ Simple deployment (git push)
│   ├─ Free tier available
│   ├─ Good for small scale
│   └─ Integrated logging
├─ Cons:
│   ├─ Pricing increases with scale
│   ├─ Dyno sleeps if inactive (free tier)
│   └─ Limited customization
├─ Pricing: Free tier or ~$50/month for hobby
├─ Setup: Authentication via GitHub, git push to deploy

Option 2: Railway (Cost-effective)
├─ Pros:
│   ├─ Pay-per-use pricing
│   ├─ Simple deployment
│   ├─ Good Node.js support
│   └─ Lower cost than Heroku
├─ Cons:
│   ├─ Smaller platform
│   └─ Less documentation
├─ Pricing: ~$0.07/GB/day for compute
├─ Setup: Connect GitHub repo, auto-deploy

Option 3: DigitalOcean
├─ Pros:
│   ├─ More control
│   ├─ Predictable pricing
│   ├─ App Platform (PaaS) or Droplets (VPS)
│   └─ Good documentation
├─ Cons:
│   ├─ More setup required
│   └─ Need to manage some aspects
├─ Pricing: ~$12/month for basic app
├─ Setup: Manual or via App Platform

Option 4: AWS
├─ Pros:
│   ├─ Highly scalable
│   ├─ Extensive services
│   └─ Pay-as-you-go
├─ Cons:
│   ├─ Complex setup
│   ├─ Pricing can be confusing
│   └─ Overkill for MVP
├─ Options: EC2, Lambda, App Runner, Elastic Beanstalk

Recommendation for MVP:
├─ Use: Heroku or Railway
├─ Reason: Fast to deploy, good for learning
├─ Later: Migrate to DigitalOcean or AWS if scaling needed
```

### 9.4 Frontend/Backend Communication

```
Frontend Configuration:

Environment Variables (.env):
├─ REACT_APP_API_URL=https://api.effetmer.app (production)
│   or http://localhost:4000 (development)
├─ REACT_APP_API_TIMEOUT=30000
├─ REACT_APP_LOG_LEVEL=warn (or debug for dev)

API Client Setup:

src/services/apiClient.js:
├─ Create axios instance with:
│   ├─ Base URL from env variable
│   ├─ Default headers
│   ├─ Request timeout
│   └─ Interceptors
├─ Interceptors:
│   ├─ Request: Add Authorization header (JWT)
│   ├─ Response: Handle errors, retry logic
│   ├─ Token refresh: Auto-refresh if 401
│   └─ Logging: Log requests/responses (dev only)

Token Refresh Interceptor:
├─ On 401 response:
│   ├─ Check if refreshToken exists
│   ├─ Call POST /auth/refresh-token
│   ├─ Get new accessToken
│   ├─ Retry original request with new token
│   └─ If refresh also fails, redirect to login
├── Prevent infinite loops (track retried requests)

Error Handling:
├─ 4xx: User error, show message
├─ 5xx: Server error, show generic message
├─ Network: Show "Connection lost" with retry
├─ Timeout: Show "Request timed out"
```

### 9.5 Deployment Workflow

```
Git Workflow:

main branch:
├─ Production code
├─ Only merge via pull request
├─ Requires code review
├─ Automatic tests must pass
└─ Deploy to production

staging branch:
├─ Testing environment
├─ Deploy automatically
├─ Test before merging to main

feature branches:
├─ Local development
├─ Never deploy directly
├─ Merge via PR to staging first

Deployment Process:

For Heroku/Railway:
├─ Push to staging branch
├─ Auto-deployment to staging
├─ Run tests (if configured)
├─ If passes, create PR to main
├─ Code review
├─ Merge to main
├─ Auto-deployment to production

For Manual Deployment:
├─ Test locally
├─ Run tests: npm test
├─ Build: npm run build
├─ Commit & push to hosting platform
├─ Monitor logs after deployment

Pre-deployment Checklist:
├─ All tests pass (npm test)
├─ Linting passes (npm run lint)
├─ Environment variables set
├─ Database migrations run
├─ No console.log statements in production code
├─ Secrets not committed
└─ Documentation updated
```

---

## 10. MIGRATION PHASES

### 10.1 Phase 0 - Preparation (Week 1)

**Goal:** Set up infrastructure, design APIs, prepare groundwork. No user-facing changes yet.

```
Tasks:
├─ Create backend project structure
├─ Set up Node.js + Express
├─ Set up MongoDB Atlas
├─ Design database schemas (Mongoose models)
├─ Create API route structure (empty handlers)
├─ Set up authentication middleware
├─ Configure environment variables
├─ Set up code formatting (Prettier, ESLint)
├─ Set up basic logging (Winston)
├─ Create documentation (API specs, setup guide)

Deliverables:
├─ Backend repository with skeleton code
├─ API documentation (route names, parameters)
├─ Database schema documentation
├─ Setup instructions for local dev

Testing:
├─ Manual: Can spin up backend locally
├─ Manual: MongoDB connection works
└─ Manual: Basic health endpoint returns 200

User Impact: ZERO (nothing deployed)
```

### 10.2 Phase 1 - Core Authentication (Week 1-2)

**Goal:** Implement Magic Link authentication. User can login BUT data remains local.

```
Backend Tasks:
├─ Implement: POST /auth/request-magic-link
├─ Implement: POST /auth/verify-magic-link
├─ Implement: POST /auth/refresh-token
├─ Implement: POST /auth/logout
├─ Set up email service (SendGrid or Nodemailer)
├─ Create User model and schema
├─ Create AuthToken and RefreshToken models
├─ Generate test users for testing
└─ Write tests for auth endpoints

Frontend Tasks:
├─ Create: LoginPage.jsx (email input form)
├─ Create: AuthContext (manages auth state)
├─ Create: useAuth() hook
├─ Create: apiClient.js (axios setup)
├─ Add: ProtectedRoute component
├─ Add: Optional auth UI (don't force login yet)
│   ├─ "Sign in to sync your data" button
│   ├─ Continue offline button
│   └─ Logout button if signed in
├─ Store tokens (localStorage, memory)
└─ Handle logout flow

Integration:
├─ Connect frontend LoginPage to backend auth endpoints
├─ Test magic link flow end-to-end
├─ Test token refresh
├─ Test logout

Deliverables:
├─ Working Magic Link authentication
├─ User can login/logout
├─ JWT tokens generated and validated
├─ Email service sends magic links

Testing:
├─ Request magic link → email received ✓
├─ Click magic link → login successful ✓
├─ Refresh token → new access token ✓
├─ Token expiry → re-login required ✓
├─ Logout → tokens revoked ✓

User Impact: OPTIONAL LOGIN (still works fully offline)
├─ New "Sign In" button in nav
├─ If not logged in: shows nothing, app works offline
├─ If logged in: shows email + logout button but data still local
```

### 10.3 Phase 2 - Server-Side Data Persistence (Week 2-3)

**Goal:** User profile + other data syncs to server. But NOT active training sessions yet.

```
Backend Tasks:
├─ Implement: GET /users/me
├─ Implement: PUT /users/me
├─ Implement: POST /users/me/migrate-local-data (CRITICAL)
├─ Create User model (profile fields)
├─ Create TrainingSchedule model
├─ Create Goals, Techniques models
├─ Create Sync endpoints for each entity
├─ Implement version tracking (v field)
├─ Write tests for all endpoints

Frontend Tasks:
├─ Create: syncEngine.js (queue + reconciliation)
├─ Create: useSync.js hook (replaces useLocalStorage)
├─ Create: SyncContext (queue status, online status)
├─ Add: NetworkDetection (navigator.onLine + polling)
├─ Add: SyncIndicator UI component
├─ Implement: Offline-first fallback
├─ Handle: First login migration flow
│   ├─ Detect local data
│   ├─ Ask: "Migrate to cloud? or keep offline?"
│   ├─ Upload local data to server
│   └─ Merge strategy: server wins (can re-export)
├─ Add: Sync notifications (toasts)
└─ Add: Conflict resolution UI

Migration Flow (Critical):
├─ User logs in for first time
├─ Frontend detects localStorage has profile data
├─ Show: "You have offline data. Sync to cloud?"
├─ If yes:
│   ├─ POST /users/me/migrate-local-data with all local data
│   ├─ Server creates records with serverTimestamp
│   ├─ Frontend receives merged data
│   ├─ Clear local cache
│   └─ Data now lives on server
├─ If no:
│   ├─ Keep offline,  don't migrate yet
│   └─ Ask again on next login

Deliverables:
├─ User profile stored on server
├─ Schedule syncs to server
├─ Goals syncs to server
├─ Techniques syncs to server
├─ Migration flow works
├─ Offline mode still works
├─ Sync notifications show

Testing:
├─ Create profile locally, login → data syncs ✓
├─ Edit profile → sync to server ✓
├─ Offline edit → syncs when online ✓
├─ Server edit on Device B → reflected on Device A ✓

User Impact: OPTIONAL SYNC
├─ Logged-in users see sync indicator
├─ Can now access data on multiple devices
├─ Still fully functional offline
├─ One-time migration on first login
```

### 10.4 Phase 3 - Training Sessions Sync (Week 3-4)

**Goal:** The big one - training sessions sync with offline queue + conflict resolution.

```
Backend Tasks:
├─ Implement: GET /training/sessions (paginated)
├─ Implement: POST /training/sessions
├─ Implement: PUT /training/sessions/:id
├─ Implement: DELETE /training/sessions/:id
├─ Implement: POST /training/sessions/bulk-upsert (CRITICAL)
├─ Implement: GET /training/sync-log (delta sync)
├─ Create TrainingSession model with v field
├─ Implement version conflict detection
├─ Implement sync logging (audit trail)
├─ Write comprehensive tests

Frontend Tasks:
├─ Integrate useSync() with TrainingPage
├─ Implement Sync Queue in IndexedDB
│   ├─ Queue operations when offline
│   ├─ Send bulk-upsert when online
│   ├─ Handle conflicts
│   └─ Retry failed ops
├─ Implement Conflict Resolution UI
│   ├─ Show conflicts when they occur
│   ├─ Let user choose version
│   └─ Re-sync if local kept
├─ Add status indicators:
│   ├─ ⏱️ Pending (not synced)
│   ├─ ✓ Synced
│   ├─ ⚠️ Failed
│   └─ ⚔️ Conflict
├─ Optimistic updates (UI updates immediately)
├─ Background sync on reconnect
└─ Bulk sync retry logic

Testing:
├─ Create session offline → queued ✓
├─ Go online → sync ✓
├─ Multiple offline operations → all sync ✓
├─ Conflict detection → works ✓
├─ Conflict resolution → user chooses ✓
├─ Multi-device sync → data consistent ✓
├─ Retry logic → failed sync retries ✓

User Impact: FULL SYNC + OFFLINE
├─ All training data syncs across devices
├─ Fully functional offline
├─ Sync happens in background
├─ No data loss (queue + retry)
├─ Conflict resolution if edited on multiple devices

Performance:
├─ Bulk sync reduces API calls
├─ IndexedDB faster than localStorage for large data
├─ Compression optional (reduce payload size)
└─ Pagination for large datasets
```

### 10.5 Phase 4 - Analytics & Advanced Features (Week 4+)

**Goal:** Stats, achievements, export, advanced sync.

```
Backend Tasks:
├─ Implement: GET /stats/dashboard
├─ Implement: GET /stats/progression
├─ Implement: GET /stats/monthly
├─ Create Stats model (pre-computed)
├─ Implement: GET /users/me/export-data (JSON/CSV)
├─ Implement: Achievement calculation (trigger on session sync)
├─ Set up caching (Redis) for stats
├─ Implement delta sync optimization
└─ Performance optimizations

Frontend Tasks:
├─ Use stats from backend (don't compute locally)
├─ Implement data export feature
├─ Add achievement notifications
├─ Display progression tier
├─ Cache stats in memory + IndexedDB
└─ Implement periodic stats refresh

User Impact: ENHANCED EXPERIENCE
├─ Faster stats (computed on server)
├─ Multi-device achievement sync
├─ Data export capability
└─ Progression tier always accurate

Optional Enhancements:
├─ Leaderboard (compare with other users - optional)
├─ Social sharing (achievements)
├─ Notifications (milestones reached)
├─ Advanced analytics (trends, patterns)
└─ API for third-party integrations
```

### 10.6 Phase Timeline

```
Total Duration: 3-4 weeks

Week 1:
├─ Days 1-3: Phase 0 (Setup)
├─ Days 4-7: Phase 1 (Auth) - 50%

Week 2:
├─ Days 1-3: Phase 1 (Auth) - complete
├─ Days 4-7: Phase 2 (Profiles)

Week 3:
├─ Days 1-4: Phase 2 - complete
├─ Days 5-7: Phase 3 (Sessions) - 50%

Week 4:
├─ Days 1-4: Phase 3 - complete
├─ Days 5-7: Phase 4 (Analytics) + Polish

Parallel Tasks (all phases):
├─ Testing + QA
├─ Documentation
├─ Performance optimization
├─ Security audit
└─ Deployment preparation
```

---

## 11. RISKS & SCALABILITY CONCERNS

### 11.1 Technical Risks

```
Risk 1: Sync Conflicts
├─ Problem: Multiple devices editing same record
├─ Impact: Data loss if not handled correctly
├─ Mitigation:
│   ├─ Implement version tracking (v field)
│   ├─ Server-wins strategy (safe, predictable)
│   ├─ Log all conflicts (audit trail)
│   ├─ User notification when conflict occurs
│   └─ Allow manual re-sync if needed
├─ Testing: Edge cases, multi-device conflict tests

Risk 2: Large Data Migration
├─ Problem: User with 5+ years of data (thousands of records)
├─ Impact: Slow migration, timeout if not batched
├─ Mitigation:
│   ├─ Batch migration in chunks (e.g., 100 records/request)
│   ├─ Show progress UI ("Syncing 2000 records... 50%")
│   ├─ Run in background (don't block app)
│   ├─ Resume if interrupted
│   └─ Timeout handling (show "Complete later" option)
├─ Testing: Generate 10k+ test records, migrate

Risk 3: Offline Queue Explosion
├─ Problem: User offline for days, adds 1000s of operations
├─ Impact: Huge queue, slow sync, memory issues
├─ Mitigation:
│   ├─ Limit queue size: ~5000 operations max
│   ├─ Warn user: "Too many changes offline, data may not fully sync"
│   ├─ Offer export: "Download your data before syncing?"
│   ├─ Rate-limit sync: Don't bombard server
│   └─ Compression: Reduce queue size
├─ Testing: Go offline for week, add thousands of items

Risk 4: Token Expiry Edge Cases
├─ Problem: Token expires mid-sync, refresh fails, network down
├─ Impact: Data loss, user stuck in bad state
├─ Mitigation:
│   ├─ Save last good token to secure storage
│   ├─ Implement exponential backoff (5s → 30s → 2m)
│   ├─ Max retries: 10, then alert user
│   ├─ Fallback:  Keep data locally until sync possible
│   └─ Manual refresh option: "Try Again" button
├─ Testing: Simulate network failures during sync

Risk 5: Database Performance
├─ Problem: 100k users, each with 1000s of sessions
├─ Impact: Slow queries, timeouts, high cost
├─ Mitigation:
│   ├─ Indexing strategy (see section 5.3)
│   ├─ Pagination: Always paginate large datasets
│   ├─ Caching: Redis for frequently accessed data
│   ├─ Analytics: Pre-compute stats, don't compute on request
│   ├─ Archiving: Move old data to separate collection
│   └─ Read replicas: For scaling reads
├─ Testing: Load test with realistic data volume

Risk 6: Security Breach
├─ Problem: Attacker steals auth token or database
├─ Impact: User data exposed, accounts compromised
├─ Mitigation:
│   ├─ Token rotation: Tokens only valid 15 mins
│   ├─ Rate limiting: Prevent brute force
│   ├─ Encryption: Sensitive data encrypted at rest (optional)
│   ├─ Audit logs: Track all data access
│   ├─ Incident response: Plan for breach
│   └─ Backup: Daily backups, separate storage
├─ Testing: Security audit, penetration testing

Risk 7: Email Delivery Failures
├─ Problem: Magic link email doesn't arrive
├─ Impact: User can't login
├─ Mitigation:
│   ├─ Use reliable service: SendGrid, AWS SES
│   ├─ Monitor delivery: Check bounce rate
│   ├─ Fallback: SMS or backup email
│   ├─ Resend option: After 60 seconds
│   └─ Support: Help users troubleshoot
├─ Testing: Spam folder checks, retry logic

Risk 8: Frontend-Backend Mismatch
├─ Problem: Frontend and backend versions out of sync
├─ Impact: API contract broken, app crashes
├─ Mitigation:
│   ├─ Versioning: API v1, v2, etc.
│   ├─ Backward compatibility: Support old versions
│   ├─ Feature flags: Gradual rollout of new features
│   ├─ Client version header: Server can detect version
│   └─ Testing: Integration tests (frontend + backend)
```

### 11.2 Scalability Concerns

```
Current Architecture (Local Only):
├─ Load: Single device
├─ Data: Stored locally (device limit)
├─ Scaling: Not applicable (pre-scaling)
└─ Cost: Zero backend cost

After Backend Integration (Small Scale, Few Users):

Database Size:
├─ Estimate: 100 users, 1000 sessions each = 100,000 records
├─ MongoDB size: ~100MB (rough estimate)
├─ Feasible: Yes, within free tier

Sync Overhead:
├─ Estimate: 100 users, 50 active, batch-sync every 10 min
├─ API calls: ~500 requests/day
├─ Feasible: Yes, well within rate limits

Bottleneck: Token generation (bcrypt) is CPU-intensive
├─ At 10 magic link requests/minute: ~600 bcrypt ops
├─ Solution: Implement job queue (Bull, Celery) if needed

Medium Scale (1000+ Users):

Database Optimization:
├─ Issue: Sorting/filtering on large collections
├─ Solution: Indexes (see section 5.3)
├─ Further: MongoDB aggregation pipeline for complex queries

API Optimization:
├─ Issue: Bulk syncs from many users at same time
├─ Solution:
│   ├─ Horizontal scaling: Multiple API instances
│   ├─ Load balancer: Distribute requests
│   ├─ Queue jobs: Process sync in background
│   └─ Caching: Redis for hot data

Server Scaling Strategy:
├─ Load Balancer (nginx or cloud provider)
│   ├─ Route requests to multiple Node.js instances
│   ├─ Health checks
│   └─ Auto-scaling groups (cloud)
│
├─ Backend Servers (Horizontal)
│   ├─ Multiple Express instances
│   ├─ Stateless (no session on single instance)
│   └─ Database: Single MongoDB (or replica set)
│
├─ Database Scaling
│   ├─ MongoDB Atlas: Sharding available
│   ├─ Replica Sets: HA + read scale-out
│   └─ Indexes: Critical for performance
│
└─ Caching Layer
    ├─ Redis: Cache frequently accessed data
    ├─ CDN: Cache static assets (frontend)
    └─ Query caching: Cache expensive queries

Large Scale (100k+ Users):

Considerations:
├─ Microservices: Separate auth, data sync, stats services
├─ Event Streaming: Kafka/RabbitMQ for async operations
├─ Master-Slave DB: Read replicas for read-heavy workload
├─ CDN: Global content delivery network
├─ Monitoring: Comprehensive observability (APM tools)
└─ Multi-region: Distribute to multiple data centers

Cost Analysis:

MVP (1 backend + MongoDB):
├─ Heroku: Free-$50/month
├─ MongoDB Atlas M0: Free
├─ SendGrid:  Free (100 emails/day)
└─ Total: ~$0-50/month

Small Scale (100-1000 users):
├─ Backend: 2-3 Heroku dynos: ~$150-250/month
├─ MongoDB M10: ~$50/month
├─ SendGrid: ~$30/month (more emails)
└─ Total: ~$250-330/month

Medium Scale (1000-10k users):
├─ Backend: Auto-scaling, AWS ECS: ~$500-1500/month
├─ MongoDB M30: ~$200-300/month
├─ Email: SendGrid more volume: ~$100-200/month
├─ Caching/CDN: ~$100-200/month
└─ Total: ~$1000-2000/month

Large Scale (10k+ users):
├─ Engineering team required
├─ Infrastructure budget: $5k+/month
└─ Focus shifts to optimization + compliance
```

---

## 12. RECOMMENDED IMPLEMENTATION ORDER

### 12.1 Week 1 Priority

```
MOST IMPORTANT FIRST (Do these, don't skip):

1. Backend Setup
   └─ Node/Express skeleton, basic structure
   └─ Priority: CRITICAL (foundation for everything)
   └─ Time: 4-6 hours

2. AUTH: Magic Link Endpoint
   ├─ POST /auth/request-magic-link
   ├─ Email service setup
   └─ Priority: CRITICAL (blocks everything)
   └─ Time: 6-8 hours

3. AUTH: Verify Magic Link Endpoint
   ├─ POST /auth/verify-magic-link
   ├─ JWT generation
   └─ Priority: CRITICAL
   └─ Time: 4-6 hours

4. Frontend: LoginPage
   ├─ Email input form
   ├─ Verification screen
   └─ Priority: CRITICAL
   └─ Time: 3-4 hours

5. Frontend: Auth Context + API Client
   ├─ Token storage
   ├─ Request interceptors
   └─ Priority: CRITICAL
   └─ Time: 4-6 hours

6. Testing: End-to-end Auth Flow
   ├─ Request link → Email received
   ├─ Click link → Login successful
   ├─ Token stored → API request works
   └─ Priority: CRITICAL
   └─ Time: 2-3 hours

Total Week 1: ~24-33 hours (3-4 full days)

Outcome: Users can login, logout, tokens work
```

### 12.2 Must-Have vs Nice-to-Have

```
MUST-HAVE (MVP Cannot Launch Without):
├─ ✅ Authentication (Magic Links)
├─ ✅ JWT Token management
├─ ✅ User profile persistence
├─ ✅ Offline-first sync queue
├─ ✅ Conflict detection (basic server-wins)
├─ ✅ Multi-device data sync
├─ ✅ Error handling + retry logic
├─ ✅ Rate limiting (prevent abuse)
├─ ✅ Input validation (security)
└─ ✅ HTTPS + secure storage

NICE-TO-HAVE (Post-MVP Features):
├─ ⚪ Achievement leaderboard
├─ ⚪ Social sharing
├─ ⚪ Advanced analytics
├─ ⚪ Partner matching
├─ ⚪ Export PDF/CSV
├─ ⚪ Mobile app (iOS/Android)
├─ ⚪ Real-time notifications
├─ ⚪ Two-factor authentication
├─ ⚪ Data encryption at rest
└─ ⚪ GraphQL API option

PERFORMANCE OPTIMIZATIONS (Phase 4+):
├─ ⚪ Caching layer (Redis)
├─ ⚪ Horizontal scaling
├─ ⚪ Query optimization
├─ ⚪ CDN for frontend
├─ ⚪ Database sharding
└─ ⚪ Monitoring/APM tools
```

---

## 13. FILES & FOLDERS TO CREATE

### 13.1 Backend Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   ├── email.js             # SendGrid setup
│   │   ├── jwt.js               # JWT secrets & algorithms
│   │   └── constants.js         # Environment constants
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── TrainingSession.js
│   │   ├── TrainingSchedule.js
│   │   ├── Goal.js
│   │   ├── Achievement.js
│   │   ├── Technique.js
│   │   ├── Stat.js
│   │   ├── AuthToken.js
│   │   ├── RefreshToken.js
│   │   └── SyncLog.js
│   │
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── errorHandler.js      # Global error catching
│   │   ├── validator.js         # Input validation (Joi)
│   │   ├── logger.js            # Request logging
│   │   ├── rateLimiter.js       # Rate limiting
│   │   └── cors.js              # CORS config
│   │
│   ├── routes/
│   │   ├── auth.js              # /auth endpoints
│   │   ├── users.js             # /users endpoints
│   │   ├── training.js          # /training endpoints
│   │   ├── schedule.js          # /schedule endpoints
│   │   ├── goals.js             # /goals endpoints
│   │   ├── techniques.js        # /techniques endpoints
│   │   ├── achievements.js      # /achievements endpoints
│   │   ├── stats.js             # /stats endpoints
│   │   ├── health.js            # /health endpoint
│   │   └── index.js             # Route aggregation
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── trainingController.js
│   │   ├── scheduleController.js
│   │   ├── goalsController.js
│   │   ├── techniquesController.js
│   │   ├── achievementsController.js
│   │   └── statsController.js
│   │
│   ├── services/
│   │   ├── authService.js       # JWT generation/validation
│   │   ├── emailService.js      # Email sending
│   │   ├── userService.js       # User CRUD logic
│   │   ├── trainingService.js   # Training logic
│   │   ├── syncService.js       # Sync & conflict resolution
│   │   ├── validationService.js # Joi schemas
│   │   └── cacheService.js      # Redis caching (optional)
│   │
│   ├── utils/
│   │   ├── tokenGenerator.js    # JWT utilities
│   │   ├── hashUtils.js         # Bcrypt wrappers
│   │   ├── dateUtils.js         # Date logic
│   │   ├── errorClasses.js      # Custom error classes
│   │   ├── logger.js            # Winston logger
│   │   └── constants.js         # TTLs, limits, etc.
│   │
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── training.test.js
│   │   ├── sync.test.js
│   │   └── fixtures/            # Test data
│   │
│   ├── app.js                   # Express app setup
│   └── server.js                # Entry point
│
├── .env.example                 # Template (no secrets)
├── .env                         # Local config (gitignored)
├── .gitignore
├── package.json
├── package-lock.json
├── .eslintrc.js
├── .prettierrc.js
├── jest.config.js
├── README.md                    # Backend setup docs
└── docker-compose.yml           # Optional: Local dev with Docker
```

### 13.2 Frontend Project Structure (New/Modified)

```
my-app/src/
├── services/ (NEW)
│   ├── apiClient.js             # Axios instance + interceptors
│   ├── authService.js           # Auth API calls
│   ├── userService.js           # User API calls
│   ├── trainingService.js       # Training API calls
│   ├── goalsService.js
│   ├── techniquesService.js
│   ├── statsService.js
│   └── syncService.js           # Sync logic
│
├── hooks/ (MODIFIED + NEW)
│   ├── useAuth.js               # Auth state (NEW)
│   ├── useSync.js               # Sync logic (NEW, replaces useLocalStorage)
│   ├── useOnlineStatus.js       # Network detection (NEW)
│   ├── useSyncStatus.js         # Sync queue status (NEW)
│   ├── useLocalStorage.jsx      # Keep for backward compatibility
│   ├── useProfile.js            # Enhanced for sync
│   ├── useSessions.js           # Enhanced for sync
│   └── etc.
│
├── context/
│   ├── AppContext.jsx           # Existing
│   ├── AuthContext.jsx          # NEW
│   └── SyncContext.jsx          # NEW
│
├── components/ (NEW/MODIFIED)
│   ├── LoginPage/               # NEW
│   │   ├── LoginPage.jsx
│   │   └── LoginPage.module.scss
│   ├── ProtectedRoute.jsx       # NEW
│   ├── AuthLink.jsx             # NEW (logout button)
│   ├── SyncIndicator.jsx        # NEW (sync status)
│   ├── ConflictResolution/      # NEW
│   │   ├── ConflictModal.jsx
│   │   └── ConflictModal.module.scss
│   ├── NavBar.jsx               # MODIFIED (add logout)
│   └── (other existing components)
│
├── lib/
│   ├── syncEngine.js            # NEW (queue + sync logic)
│   ├── conflictResolver.js      # NEW (conflict resolution)
│   ├── offlineUtils.js          # NEW (offline helpers)
│   └── (existing helpers)
│
├── styles/
│   ├── _sync-status.scss        # NEW (sync styling)
│   └── (existing styles)
│
├── App.js                       # MODIFIED (add AuthContext provider, ProtectedRoutes)
├── index.js                     # MODIFIED (add sync engine init)
└── (existing pages)
```

---

## 14. FINAL ARCHITECTURE OVERVIEW

### 14.1 High-Level Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    PRODUCTION ARCHITECTURE                   │
└──────────────────────────────────────────────────────────────┘

                      FRONTEND (React PWA)
                    ┌─────────────────────┐
                    │   React Components  │
                    │  + State Management │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Auth Context       │
                    │  AppContext         │
                    │  SyncContext        │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Services Layer     │
                    │  (apiClient,        │
                    │   authService, etc) │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Local Storage      │
                    │  (IndexedDB Queue,  │
                    │   localStorage)     │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
            ┌───────▶│  NETWORK CHECK     │◀───────┐
            │        │  (online/offline)  │        │
            │        └────────────────────┘        │
            │                                      │
            │          IF ONLINE                  │
            │          Send requests              │
            │          Sync queue                 │
            │                                      │
            ▼                                      │
        ┌───────────────────────────────────┐     │
        │   INTERNET / LOAD BALANCER        │     │
        └──────────────┬──────────────────┬─┘     │
                       │                  │       │
       ┌───────────────▼──┐  ┌───────────▼──┐    │
       │ Express Server 1 │  │ Express Server 2..N│  │
       ├──────────────────┤  ├───────────────┤   │
       │ Routes (auth,    │  │ Stateless     │   │
       │  training, etc)  │  │ (state in DB) │   │
       │                  │  │               │   │
       │ Controllers →    │  │ Duplicated    │   │
       │ Services →       │  │ across all    │   │
       │ Database Logic   │  │ instances     │   │
       └────────┬─────────┘  └───────┬───────┘   │
                │                    │            │
                └────────┬───────────┘            │
                       │  (Load Balancer         │
                       │   routes requests)      │
                       │                         │
                    ┌──▼──────────┐             │
                    │ MongoDB     │             │
                    │ Atlas       │             │
                    │             │             │
                    │ Collections:│             │
                    │ - Users     │             │
                    │ - Sessions  │             │
                    │ - Goals     │             │
                    │ - etc       │             │
                    └─────────────┘             │
                                                 │
                    (IF OFFLINE → Queue Saved)   │
                    (Data in local IndexedDB)    │
                                                 │
                                                 └─ Cached Response


OFFLINE MODE DETAILS:

User Goes Offline:
  ├─ Create operation
  ├─ Store in IndexedDB Sync Queue
  ├─ Show to user immediately (optimistic)
  ├─ Mark: offline=true, pending=true
  └─ Queue: { operation, entity, timestamp, deviceId }

User Goes Online:
  ├─ Detect: navigator.onLine = true
  ├─ Get all pending operations from IndexedDB
  ├─ POST /training/sessions/bulk-upsert (all at once)
  ├─ Server processes, returns conflicts
  ├─ Client reconciles
  ├─ Update IndexedDB (mark synced)
  ├─ Update React state (show ✓)
  └─ Clear completed queue items


MULTI-DEVICE SYNC:

Device A:
  ├─ User creates session
  ├─ POST /training/sessions
  ├─ Server stores with v=1
  ├─ Response: { _id: mongo_id, v: 1 }

Device B:
  ├─ Next API call (e.g., GET /training/sessions)
  ├─ Server returns all sessions
  ├─ B sees Device A's session
  ├─ Update local cache
  ├─ Show to user

Device A later:
  ├─ Edits session (v=1 → local v=2 on update)
  ├─ PUT /training/sessions/mongo_id
  ├─ Server: if v=1, update to v=2, accept
  ├─ Success: version incremented

Device B also edits (had v=1):
  ├─ PUT /training/sessions/mongo_id
  ├─ Server: receives v=1, but current is v=2
  ├─ CONFLICT: version mismatch
  ├─ Server response: 409 Conflict
  ├─ Client receives conflict
  ├─ Show to user: "Edited on another device"
  ├─ Default: Accept server (v=2)
  └─ Update local to v=2
```

### 14.2 Security Model

```
┌──────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
└──────────────────────────────────────────────────────────────┘

Layer 1: AUTHENTICATION
  Magic Link Flow:
  ├─ User email → random token → hash stored
  ├─ Token sent via email (not logged)
  ├─ User clicks → server verifies hash
  ├─ JWT issued (stateless, signed with secret)
  └─ Token short-lived (15 min access, 7 day refresh)

Layer 2: AUTHORIZATION
  JWT Verification:
  ├─ Middleware: Check Authorization header
  ├─ Verify signature (confirm not tampered)
  ├─ Check expiry
  ├─ Check userId in payload
  └─ If valid → continue; if invalid → 401

Layer 3: DATA ISOLATION
  Per-User Queries:
  ├─ Every database query includes userId
  ├─ Example: db.sessions.find({ userId })
  ├─ No global queries (hard-coded per-user)
  ├─ Prevents: User A seeing User B's data
  └─ Verified at: controller + service layers

Layer 4: RATE LIMITING
  Per-Endpoint:
  ├─ /auth/request-magic-link: 3 per hour (per IP)
  ├─ /auth/verify-magic-link: 10 per hour
  ├─ /training/sessions: 60 per hour
  ├─ Global: 1000 requests/minute per IP
  └─ Returns: 429 Too Many Requests if exceeded

Layer 5: INPUT VALIDATION
  Schema Validation:
  ├─ Every request validated (Joi)
  ├─ Type checking (string, number, array)
  ├─ Length limits (prevent 1GB payloads)
  ├─ Enum validation (only allowed values)
  ├─ Regex patterns (email, date formats)
  └─ Returns: 400 Bad Request if invalid

Layer 6: ENCRYPTION (Transport)
  HTTPS/TLS:
  ├─ All data in transit encrypted
  ├─ Man-in-the-middle attacks prevented
  ├─ Certificates: Let's Encrypt (free)
  ├─ Redirect: http → https
  └─ HSTS: Force HTTPS in future requests

Layer 7: CORS PROTECTION
  Origin Whitelist:
  ├─ Only https://effetmer.app (and variants)
  ├─ Browser enforces (cannot bypass from FE)
  ├─ Backend verifies Origin header
  ├─ Prevents: Attacks from third-party sites
  └─ Config: Specific, not wildcard (*)

Layer 8: XSS PROTECTION
  Content-Security-Policy:
  ├─ Frontend: Sanitize user input (DOMPurify)
  ├─ Backend: No inline scripts in responses
  ├─ Header: Content-Security-Policy (restrict sources)
  └─ HttpOnly cookies: JS cannot access

Layer 9: SESSION REVOCATION
  Logout / Token Revocation:
  ├─ Refresh token stored (hash) in DB
  ├─ On logout: Mark isRevoked = true
  ├─ On next request: Check refreshToken status
  ├─ If revoked: 401 Unauthorized
  └─ Prevents: Stolen tokens from working after logout

Layer 10: AUDIT LOGGING
  SyncLog & Analytics:
  ├─ Log all data modifications
  ├─ Who (userId), What (operation), When (timestamp)
  ├─ Track sync conflicts, failures
  ├─ Retention: 90 days (legal requirement)
  └─ Use: Detect suspicious activity, debug issues
```

### 14.3 Deployment Architecture

```
┌───────────────────────────────────────────────────────┐
│                  PRODUCTION DEPLOYMENT                │
└───────────────────────────────────────────────────────┘

Load Balancer (nginx / AWS Load Balancer)
  ├─ HTTP → HTTPS redirect
  ├─ Distributes traffic to backend servers
  ├─ Health checks (every 30 seconds)
  └─ Auto-removes unhealthy instances

Backend Servers (Auto-Scaling Group)
  ├─ Express.js instances (Node.js)
  ├─ Min: 2 instances
  ├─ Max: 10 instances (scale up under load)
  ├─ Environment: Same code, different env vars
  ├─ Stateless: No session stored locally
  └─ Logs: Centralized (CloudWatch / Datadog)

MongoDB Atlas (Cloud Database)
  ├─ Replicated (3-node replica set for HA)
  ├─ Automated backups (daily, 30-day retention)
  ├─ Encryption at rest (default)
  ├─ Encryption in transit (TLS)
  ├─ Monitoring: Atlas dashboard + alerts
  └─ Scaling: Vertical (M10, M20, etc) or sharding

CDN (Optional, for frontend)
  ├─ CloudFlare or AWS CloudFront
  ├─ Caches static assets (CSS, JS, images)
  ├─ Global distribution (faster for users)
  ├─ DDoS protection (Cloudflare free tier)
  └─ Reduces backend load

Monitoring & Observability
  ├─ Sentry: Error tracking + alerts
  ├─ DataDog/New Relic: APM (performance)
  ├─ Google Analytics or Mixpanel: User analytics
  ├─ Uptime monitoring: StatusPage.io or Pingdom
  ├─ Logs: Aggregated to Logz.io or ELK
  └─ Alerts: Slack notifications for critical issues

Deployment Pipeline (CI/CD)
  ├─ GitHub Actions or GitLab CI/CD
  ├─ Trigger: Push to main branch
  ├─ Tests: Run automated tests
  ├─ Build: Build Docker image (optional)
  ├─ Deploy: Update backend servers
  ├─ Smoke tests: Verify deployment worked
  └─ Rollback: If tests fail, revert to previous version
```

---

## Conclusion

EFFETMER's transformation to a full-stack application is **achievable within 3-4 weeks** using a phased approach that:

✅ **Preserves all existing functionality** (offline-first, PWA, UX)  
✅ **Adds cloud capabilities** gradually (no big-bang migration)  
✅ **Maintains data integrity** (sync with conflict resolution)  
✅ **Ensures security** (JWT, rate limiting, validation)  
✅ **Supports multi-device** sync seamlessly  
✅ **Scales** from MVP to 100k+ users

**No code refactoring needed** — just add layers on top of existing architecture.

Next step: **Review this roadmap, confirm scope, and proceed with implementation!**
