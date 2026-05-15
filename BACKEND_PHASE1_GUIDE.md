# EFFETMER Phase 1 Backend - Implementation Guide

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. Generate JWT Secrets

```bash
# On macOS/Linux
openssl rand -base64 32

# Store the output in .env as:
# JWT_ACCESS_SECRET=<generated-value>
# JWT_REFRESH_SECRET=<generated-value>
```

### 4. Configure MongoDB

- Create cluster at mongodb.com/cloud/atlas
- Create user credentials
- Whitelist your IP
- Copy connection string to `DATABASE_URL` in `.env`

### 5. Configure Email Service

- Sign up at [Resend.com](https://resend.com)
- Create API key
- Add to `.env` as `RESEND_API_KEY`
- Set sender email as `FROM_EMAIL`

### 6. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

---

## Architecture Overview

### Data Flow - Magic Link Login

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                       │
│                                                             │
│  User enters email → LoginPage component                   │
│         ↓                                                   │
│  POST /api/auth/request-magic-link (email)                │
└────────────────────┬────────────────────────────────────────┘
                    │ (HTTP)
┌────────────────────↓────────────────────────────────────────┐
│                   BACKEND (Express)                         │
│                                                             │
│  authController.postRequestMagicLink()                     │
│    ↓                                                       │
│  authService.requestMagicLink(email)                      │
│    ├─ generateMagicLinkToken() → 64-char random          │
│    ├─ hash token with bcrypt                             │
│    ├─ store in AuthToken collection (TTL: 15 min)        │
│    └─ sendMagicLinkEmail(email, link)                    │
│          ├─ Resend API sends branded email               │
│          └─ Link: /auth/verify?token=...&email=...       │
│                                                           │
│  Response: 200 OK { email, expiresIn: 900 }             │
└────────────────────┬────────────────────────────────────────┘
                    │ (User clicks email link)
┌────────────────────↓────────────────────────────────────────┐
│                   FRONTEND (React)                          │
│                                                             │
│  URL params extracted: token, email                        │
│         ↓                                                  │
│  POST /api/auth/verify-magic-link (token, email)         │
└────────────────────┬────────────────────────────────────────┘
                    │ (HTTP)
┌────────────────────↓────────────────────────────────────────┐
│                   BACKEND (Express)                         │
│                                                             │
│  authController.postVerifyMagicLink()                     │
│    ↓                                                      │
│  authService.verifyMagicLink(email, token)              │
│    ├─ Find AuthToken by email                           │
│    ├─ Check not used, not expired                       │
│    ├─ Verify token hash with bcrypt.compare             │
│    ├─ Mark token as used                                │
│    ├─ Get or create User                                │
│    ├─ generateAccessToken() → JWT (15 min)             │
│    ├─ generateRefreshToken() → JWT (7 days)            │
│    └─ Store refresh token hash in RefreshToken db       │
│                                                         │
│  Response: 200 OK {                                     │
│    user: { _id, email, profile, settings, stats },      │
│    tokens: { accessToken, refreshToken },              │
│    isNewUser: false                                     │
│  }                                                       │
└────────────────────┬────────────────────────────────────────┘
                    │
┌────────────────────↓────────────────────────────────────────┐
│                   FRONTEND (React)                          │
│                                                             │
│  Store tokens:                                            │
│  ├─ accessToken → sessionStorage ("short-lived")         │
│  └─ refreshToken → localStorage (secure, long-lived)     │
│                                                          │
│  Subsequent requests include:                            │
│  Authorization: Bearer <accessToken>                     │
│                                                          │
│  On 401 Unauthorized →                                  │
│  POST /api/auth/refresh-token (refreshToken)           │
└────────────────────────────────────────────────────────────┘
```

### Database Schemas

#### User Collection

```javascript
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
    profilePicture: String
  },
  settings: {
    theme: "dark" | "light",
    language: "en" | "pt",
    notifications: Boolean,
    privacy: "public" | "private"
  },
  stats: {
    totalSessions: Number,
    totalHours: Number,
    streak: Number,
    longestStreak: Number,
    lastTrainingDate: Date
  },
  hasLocalData: Boolean,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date | null (soft delete)
}
```

#### AuthToken Collection (Magic Links)

```javascript
{
  _id: ObjectId,
  email: String,
  tokenHash: String (bcrypt),
  expiresAt: Date (TTL index - auto delete),
  isUsed: Boolean,
  usedAt: Date | null,
  createdAt: Date
}
```

#### RefreshToken Collection (Sessions)

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref User),
  tokenHash: String (bcrypt of actual token),
  metadata: {
    deviceId: String,
    ipAddress: String,
    userAgent: String
  },
  expiresAt: Date,
  revokedAt: Date | null (logout = set this),
  createdAt: Date
}
```

---

## API Endpoint Reference

### Authentication Endpoints

| Method | Endpoint                       | Auth | Rate Limit | Purpose                |
| ------ | ------------------------------ | ---- | ---------- | ---------------------- |
| POST   | `/api/auth/request-magic-link` | ❌   | 3/hr/email | Request login link     |
| POST   | `/api/auth/verify-magic-link`  | ❌   | 3/hr       | Verify token, get JWTs |
| POST   | `/api/auth/refresh-token`      | ❌   | 3/hr       | Refresh access token   |
| POST   | `/api/auth/logout`             | ✅   | -          | Revoke refresh tokens  |

### User Endpoints

| Method | Endpoint              | Auth | Purpose          |
| ------ | --------------------- | ---- | ---------------- |
| GET    | `/api/users/me`       | ✅   | Get current user |
| PUT    | `/api/users/profile`  | ✅   | Update profile   |
| PUT    | `/api/users/settings` | ✅   | Update settings  |

### System Endpoints

| Method | Endpoint      | Auth | Purpose      |
| ------ | ------------- | ---- | ------------ |
| GET    | `/api/health` | ❌   | Health check |

---

## Testing

### Run Tests

```bash
npm test
```

### Manual Testing with cURL

#### 1. Request Magic Link

```bash
curl -X POST http://localhost:5000/api/auth/request-magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

#### 2. Check Magic Link in Database

```javascript
// Connect to MongoDB and run:
db.authtokens.findOne({ email: "test@example.com" });
// Note the tokenHash for testing
```

#### 3. Verify Magic Link (requires actual token from email)

```bash
curl -X POST http://localhost:5000/api/auth/verify-magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","token":"actual-64-char-token"}'
```

#### 4. Get Current User (requires access token)

```bash
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer <your-access-token>"
```

---

## Error Handling Patterns

### HTTP Status Codes

- **200 OK**: Request succeeded
- **400 Bad Request**: Invalid input/validation failed
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Duplicate entry (email exists)
- **429 Too Many Requests**: Rate limited
- **500 Internal Server Error**: Server error

### Error Response Example

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": {
    "email": "Invalid email format"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Middleware Chain

Each request goes through this middleware pipeline:

```
Request
  ↓
1. Helmet (security headers)
  ↓
2. CORS (check origin)
  ↓
3. Morgan (logging)
  ↓
4. Body Parser (JSON)
  ↓
5. Rate Limiter (general)
  ↓
6. Routes
  ├─ Form Middleware (per-route)
  │  ├─ Rate Limiter (specific, e.g., authLimiter)
  │  ├─ Validator (input validation)
  │  └─ Authenticate (JWT check, if protected)
  │
  └─ Controller → Service → Database
       ↓
7. Error Handler (catches all errors, normalizes response)
  ↓
Response
```

---

## Logging

### Log Levels (set via `LOG_LEVEL` in `.env`)

- `debug`: All including request details
- `info`: General info, request summaries
- `warn`: Warnings (validation, token issues)
- `error`: Errors only

### Log Output

```
✓ From console (development):
  [2024-01-15T10:30:00Z] info: Server running on port 5000
  [2024-01-15T10:30:15Z] info: GET /api/health 200 1.2ms
  [2024-01-15T10:30:30Z] info: User authenticated: user@example.com

✓ From logs/combined.log:
  0:0:1 - - [15/Jan/2024:10:30:00 +0000] "GET /api/health HTTP/1.1" 200 35 "-"

✓ From logs/error.log:
  [2024-01-15T10:30:45Z] error: Validation Error [VALIDATION_ERROR]: email is required
```

---

## Environment Variables Reference

```env
# Database Connection
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/effetmer

# JWT Configuration
JWT_ACCESS_SECRET=<32-char-random-base64>  # 15-minute tokens
JWT_REFRESH_SECRET=<32-char-random-base64> # 7-day tokens

# Email Service (Resend)
RESEND_API_KEY=<your-resend-api-key>
FROM_EMAIL=noreply@effetmer.com

# Frontend Configuration
FRONTEND_URL=http://localhost:3000              # For CORS
MAGIC_LINK_URL=http://localhost:3000/auth/verify # For email links

# Server Configuration
PORT=5000                    # Server port
NODE_ENV=development         # development|production
LOG_LEVEL=info              # debug|info|warn|error

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100  # per window

# Security (Production)
HTTPS_ONLY=false             # Set true in production
SECURE_COOKIES=false         # Set true in production
```

---

## Production Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets (32+ chars random)
- [ ] Configure MongoDB with backups enabled
- [ ] Set `HTTPS_ONLY=true` (requires reverse proxy)
- [ ] Configure CORS to exact frontend domain
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Enable request logging to persistent storage
- [ ] Configure SMTP for production email
- [ ] Set rate limits appropriate to scale
- [ ] Monitor database connections
- [ ] Setup database indexes for queries
- [ ] Configure CI/CD pipeline
- [ ] Setup health monitoring/alerting

---

## Troubleshooting

### "Cannot find module 'express'"

```bash
npm install
```

### "JWT_ACCESS_SECRET is not set"

Check `.env` file exists and contains both JWT secrets.

### "Database connection failed"

- Verify MongoDB connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure MongoDB user has database access

### "Magic link email not received"

- Check `RESEND_API_KEY` is valid
- Verify `FROM_EMAIL` domain is verified in Resend
- Check spam folder
- Review backend logs for email errors

### "CORS error from frontend"

Update `FRONTEND_URL` in `.env` to match frontend origin.

### "Rate limit too strict"

Adjust `RATE_LIMIT_MAX_REQUESTS` in `.env` or specific limiters in `middleware/rateLimiter.js`.

---

## Next Steps

1. **Frontend Integration**: Update React App to use this backend
2. **Data Sync**: Build bilateral sync between localStorage and server
3. **Testing**: Run full E2E test with mock email service
4. **Deployment**: Deploy to production environment
5. **Monitoring**: Setup error tracking and performance monitoring
