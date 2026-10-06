# EFFETMER Backend API - Phase 1 Documentation

## Overview

This is the Phase 1 backend implementation for EFFETMER, a Brazilian Jiu-Jitsu training tracker PWA. It provides:

- **Magic Link Authentication** - Passwordless, email-based login
- **JWT Sessions** - Secure token-based authentication
- **User Profiles** - Training stats and personal settings
- **Offline-First Sync** - Designed for hybrid offline/online operation with the frontend

## Architecture

### Technology Stack

- **Runtime**: Node.js 18 LTS
- **Framework**: Express.js 4.18
- **Database**: MongoDB Atlas
- **ORM**: Mongoose 7.5
- **Auth**: JWT (HS256) with Magic Link
- **Email**: Resend
- **Validation**: express-validator + Joi
- **Logging**: Winston
- **Testing**: Jest + Supertest

### Directory Structure

```
server/
├── src/
│   ├── app.js                    # Express app initialization
│   ├── config/
│   │   ├── database.js           # MongoDB connection
│   │   ├── jwt.js                # JWT configuration
│   │   ├── email.js              # Resend email service
│   │   └── constants.js          # App constants
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   ├── errorHandler.js       # Error normalization
│   │   ├── validator.js          # Input validation
│   │   ├── rateLimiter.js        # Rate limiting
│   │   └── logger.js             # HTTP request logging
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── AuthToken.js          # Magic link tokens
│   │   └── RefreshToken.js       # Session management
│   ├── services/
│   │   ├── authService.js        # Auth business logic
│   │   ├── userService.js        # User operations
│   │   └── emailService.js       # Email wrapper
│   ├── controllers/
│   │   ├── authController.js     # Auth endpoints
│   │   └── userController.js     # User endpoints
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── users.js              # User routes
│   │   └── index.js              # Route aggregation
│   └── utils/
│       ├── tokenGenerator.js     # JWT utilities
│       ├── logger.js             # Winston logger
│       └── errorClasses.js       # Custom errors
├── tests/
│   └── auth.test.js              # Test suite
├── server.js                     # Entry point
├── package.json
└── .env.example
```

## API Endpoints

### Authentication

#### POST `/api/auth/request-magic-link`

Request a magic link for login.

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Magic link sent to email",
  "data": {
    "email": "user@example.com",
    "expiresIn": 900
  }
}
```

**Rate Limit**: 3 per hour per email

---

#### POST `/api/auth/verify-magic-link`

Verify magic link token and receive JWT tokens.

**Request:**

```json
{
  "email": "user@example.com",
  "token": "64-character-hex-token"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": {
      "_id": "mongo-id",
      "email": "user@example.com",
      "profile": { ... },
      "settings": { ... },
      "stats": { ... }
    },
    "tokens": {
      "accessToken": "jwt-token",
      "refreshToken": "jwt-token"
    },
    "isNewUser": false
  }
}
```

**Rate Limit**: 3 per hour per email

---

#### POST `/api/auth/refresh-token`

Get new access token using refresh token.

**Request:**

```json
{
  "refreshToken": "refresh-jwt-token"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "new-jwt-token"
  }
}
```

---

#### POST `/api/auth/logout`

Revoke all refresh tokens for current user.

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Users

#### GET `/api/users/me`

Get current authenticated user.

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "mongo-id",
    "email": "user@example.com",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "academy": "Academy Name",
      "belt": "Brown",
      "weight": 80,
      "yearsOfPractice": 5,
      "weeklyGoal": 3,
      "preferredTrainingDays": ["Monday", "Wednesday", "Friday"],
      "profilePicture": "url"
    },
    "settings": {
      "theme": "dark",
      "language": "en",
      "notifications": true,
      "privacy": "public"
    },
    "stats": {
      "totalSessions": 150,
      "totalHours": 300,
      "streak": 5,
      "longestStreak": 12,
      "lastTrainingDate": "2024-01-15"
    }
  }
}
```

---

#### PUT `/api/users/profile`

Update user profile.

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Request:**

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "academy": "New Academy",
  "belt": "Black",
  "weight": 65,
  "yearsOfPractice": 10
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile updated",
  "data": { ... }
}
```

---

#### PUT `/api/users/settings`

Update user settings.

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Request:**

```json
{
  "theme": "light",
  "language": "pt",
  "notifications": false,
  "privacy": "private"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Settings updated",
  "data": { ... }
}
```

---

#### GET `/api/health`

Health check endpoint.

**Response (200):**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Authentication Flow

### Magic Link Login

1. **User initiates login**

   ```
   POST /api/auth/request-magic-link
   { "email": "user@example.com" }
   ```

2. **Backend generates & sends token**
   - Generate 64-char random token
   - Hash with bcrypt
   - Store in AuthToken collection (15-min TTL)
   - Send email with magic link

3. **User clicks email link**
   - Extracts token and email from URL
   - Calls verify endpoint with token

4. **Backend verifies & creates session**

   ```
   POST /api/auth/verify-magic-link
   { "email": "user@example.com", "token": "..." }
   ```

   - Finds AuthToken record
   - Compares token hash with bcrypt
   - Validates expiry
   - Marks as used
   - Creates User if new
   - Generates JWT tokens

5. **Frontend receives tokens**

   ```json
   {
     "accessToken": "expires in 15 minutes",
     "refreshToken": "expires in 7 days"
   }
   ```

6. **Frontend stores tokens**
   - AccessToken: sessionStorage (short-lived)
   - RefreshToken: secure HTTP-only cookie (preferred)

7. **Subsequent requests**
   - Include `Authorization: Bearer <accessToken>` header
   - On 401: refresh using `/auth/refresh-token`

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "Human readable message",
  "details": {},
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common Error Codes

| Code                 | Status | Meaning                              |
| -------------------- | ------ | ------------------------------------ |
| VALIDATION_ERROR     | 400    | Input validation failed              |
| AUTHENTICATION_ERROR | 401    | Invalid/expired token or credentials |
| AUTHORIZATION_ERROR  | 403    | Insufficient permissions             |
| NOT_FOUND_ERROR      | 404    | Resource not found                   |
| DUPLICATE_ENTRY      | 409    | Email or unique field already exists |
| RATE_LIMIT_ERROR     | 429    | Too many requests                    |
| INTERNAL_ERROR       | 500    | Server error                         |

---

## Environment Setup

### 1. Create `.env` file

```bash
cp .env.example .env
```

### 2. Configure environment variables

```env
# Database
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/effetmer

# JWT Secrets (generate: openssl rand -base64 32)
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-secret-key

# Email Service
RESEND_API_KEY=your-resend-key
FROM_EMAIL=noreply@effetmer.com

# Frontend
FRONTEND_URL=http://localhost:3000
MAGIC_LINK_URL=http://localhost:3000/auth/verify

# Server
PORT=5000
NODE_ENV=development
LOG_LEVEL=info
```

---

## Running the Server

### Development

```bash
npm install
npm run dev
```

### Production

```bash
npm install
npm start
```

### Tests

```bash
npm test
```

---

## Security Considerations

### ✅ Implemented

- **HTTPS**: Helmet security headers (set HTTPS_ONLY in production)
- **Password Hash**: bcrypt (10 rounds) for tokens
- **JWT**: HS256 with strong secrets, 15-min access + 7-day refresh
- **CORS**: Whitelist frontend origin only
- **Rate Limiting**:
  - Magic link: 3/hour per email
  - Auth endpoints: 3/hour
  - General: 100/15 minutes
- **Input Validation**: express-validator + Joi schemas
- **Soft Deletes**: Users never deleted, just marked deleted
- **Revocation**: Refresh tokens can be revoked on logout
- **MongoDB Injection**: Mongoose prevents injection attacks
- **TTL**: Magic links expire after 15 minutes (MongoDB TTL index)

### 📋 To-Do (Phase 2+)

- [ ] 2FA (TOTP via authenticator app)
- [ ] Account recovery (secondary email)
- [ ] Session device management
- [ ] Audit logging
- [ ] API key management
- [ ] Webhook support for sync

---

## Frontend Integration

### 1. Setup API Client

```javascript
// services/apiClient.js
const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add JWT to requests
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        const res = await axios.post("/api/auth/refresh-token", {
          refreshToken,
        });
        sessionStorage.setItem("accessToken", res.data.data.accessToken);
        // Retry original request
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
```

### 2. Initialize Auth Flow Frontend

```javascript
// Add to App.js after OnboardingPage check
const userId = sessionStorage.getItem("userId");
const isAuthenticated = !!sessionStorage.getItem("accessToken");

// If authenticated, try cloud sync
if (isAuthenticated) {
  // Fetch remote data and merge with local
}
```

### 3. Create LoginPage Component

```javascript
// pages/LoginPage.jsx
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email"); // 'email' | 'verify'

  const handleRequestMagicLink = async () => {
    await apiClient.post("/auth/request-magic-link", { email });
    setStep("verify");
  };

  const handleVerifyToken = async (token) => {
    const res = await apiClient.post("/auth/verify-magic-link", {
      email,
      token,
    });
    sessionStorage.setItem("accessToken", res.data.data.tokens.accessToken);
    sessionStorage.setItem("userId", res.data.data.user._id);
    // Redirect to app
  };

  // Render form based on step
};
```

---

## Deployment

### Heroku / Vercel

```bash
git push heroku main
```

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

---

## Monitoring & Logs

Logs are written to:

- **Console**: Colored output (development)
- **`logs/combined.log`**: All requests
- **`logs/error.log`**: Errors only

Configure with `LOG_LEVEL` in `.env`:

- `debug`: Detailed diagnostics
- `info`: General information
- `warn`: Warnings only
- `error`: Errors only

---

## Next Steps (Phase 2)

1. **Frontend Integration**: Connect LoginPage to this API
2. **Data Migration**: Build `/api/sync` endpoint for local→cloud
3. **Database Backups**: Set up MongoDB Atlas backups
4. **Analytics**: Add Posthog or Amplitude
5. **Multi-Device**: Improve session/device management
6. **Testing**: Increase coverage to 80%+
