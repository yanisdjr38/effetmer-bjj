# EFFETMER - PHASE 1 IMPLEMENTATION STRATEGY

## Current Frontend Architecture

```
Frontend State Management:
├─ AppContext (centralized)
│  ├─ useOnboarding() → onboarding.isComplete
│  ├─ useProfile() → userProfile
│  ├─ useSessions() → trainingSessions[]
│  ├─ useSettings() → settings
│  ├─ useAchievements() → achievements
│  ├─ useGoals() → goals[]
│  ├─ useTrainingSchedule() → trainingSchedule
│  └─ useTechniques() → techniques[]
│
├─ localStorage persistence (no backend yet)
│
└─ Router (9 pages)
   ├─ OnboardingPage (gate if !isComplete)
   ├─ HomePage
   ├─ ProfilePage
   ├─ TrainingPage
   ├─ AnalyticsPage
   ├─ TechniquesPage
   └─ etc.

NO API layer currently.
ALL data in memory + localStorage.
```

---

## PHASE 1: INTEGRATION STRATEGY

### Goal

Enable authentication & profile persistence WITHOUT breaking existing offline functionality.

### Approach: Non-Breaking Progressive Integration

```
BEFORE (Current):
User → localStorage → useLocalStorage hooks → Context → Components

AFTER (Phase 1):
User → Auth Optional → API (if online) OR localStorage → Context → Components
```

**Key Principle**: Users work offline by default. Backend is OPTIONAL enhancement.

### Integration Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    PHASE 1 FLOW                             │
└─────────────────────────────────────────────────────────────┘

User Lands on App
  ├─ Load from localStorage (fast, offline-works)
  ├─ Show app immediately (no loading)
  │
  ├─ IF online:
  │  └─ Check if auth token exists
  │     ├─ If yes → auto-login (fetch user profile from API)
  │     └─ If no → show optional "Sign In" button in nav
  │
  └─ IF offline:
     └─ Work normally with localStorage (no changes)

User NOT logged in → Works fully offline
  ├─ All data in localStorage
  ├─ No API calls
  ├─ No interruption
  ├─ Can sign in later

User CLICKS "Sign In" → Magic Link Flow
  ├─ Redirect to LoginPage
  ├─ Enter email
  ├─ Backend sends magic link
  ├─ User clicks link
  ├─ Frontend gets JWT + refreshToken
  ├─ Stores tokens
  ├─ Redirects to app
  ├─ OPTIONAL: Offer to migrate local data to cloud
  └─ Both local data + cloud data in sync

Authenticated User → Hybrid Mode
  ├─ Read: Try API first, fall back to localStorage
  ├─ Write: Write to localStorage + background sync to API
  ├─ Offline: localStorage works, queue syncs when online
  ├─ Online: Real-time sync with server
  └─ Multi-device: Data syncs across devices
```

---

## PHASE 1 DELIVERABLES

### Backend (Node/Express/MongoDB)

```
server/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── jwt.js
│   │   ├── email.js
│   │   └── constants.js
│   ├── models/
│   │   ├── User.js
│   │   └── AuthToken.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── validator.js
│   │   ├── rateLimiter.js
│   │   └── logger.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── index.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── emailService.js
│   │   └── userService.js
│   ├── utils/
│   │   ├── tokenGenerator.js
│   │   ├── errorClasses.js
│   │   └── logger.js
│   ├── app.js
│   └── server.js
├── tests/
│   └── auth.test.js
├── .env.example
├── .env (gitignored)
├── package.json
└── README.md
```

### Frontend (React additions)

```
my-app/src/
├── services/ (NEW)
│   ├── apiClient.js
│   ├── authService.js
│   └── userService.js
├── pages/
│   ├── LoginPage.jsx (NEW)
│   └── (existing)
├── hooks/ (ENHANCED)
│   ├── useAuth.js (NEW)
│   └── (existing)
└── components/
    ├── AuthButton.jsx (NEW)
    └── (existing)
```

---

## ARCHITECTURE DECISIONS

### 1. **Local-First by Default**

- Users can use the app offline
- No forced login
- Auth is enhancement, not requirement
- Users opt-in to cloud sync

### 2. **Token Storage (Secure)**

```
Frontend:
├─ accessToken → Memory (lost on refresh, but refreshToken handles)
├─ refreshToken → localStorage (survives refresh)
└─ User profile → AppContext + localStorage

Backend:
├─ JWT signed (stateless)
├─ RefreshTokens tracked in MongoDB
└─ Email-based (no passwords to compromise)
```

### 3. **Data Synchronization (Later)**

Phase 1: Profile only (lightweight)
Phase 2: Training sessions sync
Phase 3: Advanced sync

### 4. **API Response Format (Consistent)**

```javascript
{
  success: true,
  code: 200,
  message: "Profile loaded successfully",
  data: { userId, email, profile: {...} },
  timestamp: "2026-05-14T10:30:00Z"
}
```

### 5. **Error Handling (User-Friendly)**

```javascript
{
  success: false,
  code: 400,
  message: "Invalid email format",
  details: { field: "email", reason: "not_valid" },
  timestamp: "2026-05-14T10:30:00Z"
}
```

---

## PHASE 1 ENDPOINTS

```
POST   /auth/request-magic-link      → Send login link to email
POST   /auth/verify-magic-link       → Verify token, issue JWT
POST   /auth/refresh-token           → Get new accessToken
POST   /auth/logout                  → Revoke refreshToken

GET    /users/me                     → Get current user profile
PUT    /users/me                     → Update user profile
GET    /health                       → Health check (for monitoring)
```

---

## SECURITY IMPLEMENTATION

### Magic Link Flow

- Token: 64-char random hex
- Hash: bcrypt (cost=10) stored in DB
- Expiry: 15 minutes
- Single-use: isUsed flag
- Rate limiting: 3 per hour per IP

### JWT Tokens

- Algorithm: HS256
- Access: 15 minutes
- Refresh: 7 days
- Signature verified on every request
- Refresh token tracked in DB (revocation)

### CORS & Rate Limiting

- Whitelist: Frontend domain only
- Rate limit: 100 req/min per IP
- Auth endpoints: stricter limits (3 auth attempts/hour)

### Input Validation

- Email: RFC 5322 compliant
- Request body: Joi validation
- All inputs sanitized

---

## DATABASE SCHEMA (Phase 1)

```
Users Collection:
{
  _id: ObjectId,
  email: String (unique, indexed),
  profile: {
    firstName: String,
    lastName: String,
    academy: String,
    belt: String,
    weight: Number,
    yearsOfPractice: Number,
    weeklyGoal: Number,
    preferredTrainingDays: [String],
    profilePicture: String (URL)
  },
  settings: {
    theme: String,
    language: String,
    notifications: { email: Boolean }
  },
  hasLocalData: Boolean (flag for migration),
  createdAt: Date,
  updatedAt: Date,
  v: Number
}

AuthTokens Collection (Magic Links):
{
  _id: ObjectId,
  email: String (indexed),
  tokenHash: String,
  expiresAt: Date,
  isUsed: Boolean,
  usedAt: Date,
  createdAt: Date
}

RefreshTokens Collection (Sessions):
{
  _id: ObjectId,
  userId: ObjectId,
  tokenHash: String,
  expiresAt: Date,
  revokedAt: Date,
  createdAt: Date
}
```

---

## MIGRATION PATH (Non-Breaking)

### Step 1: User Not Authenticated

```
No changes to frontend.
App loads from localStorage.
Optional "Sign In" button added to nav.
```

### Step 2: User Clicks "Sign In"

```
New LoginPage appears.
Email input.
Magic link flow.
```

### Step 3: After Magic Link

```
JWT tokens stored.
User profile fetched from API.
OPTIONAL: "Migrate offline data to cloud?"
├─ If YES: Upload all localStorage to server
├─ If NO: Keep both (sync later)
└─ User redirected to app
```

### Step 4: Authenticated + Local Data

```
LocalStorage still used (offline-works).
New API calls for profile CRUD.
User can export data.
```

---

## FILE CREATION ORDER

### Backend (Server Root)

1. `/server/package.json` → dependencies
2. `/server/.env.example` → config template
3. `/server/src/config/*` → Configuration
4. `/server/src/utils/*` → Utilities
5. `/server/src/models/*` → Database schemas
6. `/server/src/middleware/*` → Express middleware
7. `/server/src/services/*` → Business logic
8. `/server/src/controllers/*` → Route handlers
9. `/server/src/routes/*` → API routes
10. `/server/src/app.js` → Express app
11. `/server/src/server.js` → Entry point

### Frontend (React app)

1. `src/services/apiClient.js` → HTTP communicator
2. `src/services/authService.js` → Auth API calls
3. `src/services/userService.js` → User API calls
4. `src/hooks/useAuth.js` → Auth state management
5. `src/context/AuthContext.jsx` → Auth context
6. `src/pages/LoginPage.jsx` → Login UI
7. `src/components/AuthButton.jsx` → Logout button
8. Update `App.js` to include AuthContext
9. Update `.env` with API URL

---

## NEXT STEPS

1. Create backend directory structure
2. Implement configuration files
3. Create Mongoose models
4. Implement auth middleware
5. Create services (JWT, email)
6. Implement controllers
7. Create routes
8. Test all endpoints
9. Create frontend integration
10. Test end-to-end flow

---

## SUCCESS CRITERIA FOR PHASE 1

✅ User can request magic link  
✅ User receives email with link  
✅ User clicks link, gets redirected  
✅ Backend validates token  
✅ JWT + refresh token issued  
✅ User profile stored in DB  
✅ Frontend can fetch user profile  
✅ Logout revokes token  
✅ Offline mode still works  
✅ No breaking changes to existing app  
✅ All endpoints tested  
✅ Production-ready code

---

## IMPORTANT NOTES

- **No forced migration**: Users work offline until they choose to login
- **Backward compatible**: All existing features work without changes
- **Progressive**: Can be rolled out gradually
- **Secure**: Magic links, no passwords, JWT validated
- **Testable**: All endpoints have tests
- **Monitorable**: Logging + error tracking
- **Production-ready**: Follows Node/Express best practices

Ready to implement? The backend code is scalable, secure, and production-ready.
