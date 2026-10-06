# EFFETMER Backend - Quick Reference Card

## 🚀 Quick Start (5 Minutes)

```bash
cd server
npm install
cp .env.example .env
# Edit .env with MongoDB URL, JWT secrets, Resend key
npm run dev
```

Visit: `http://localhost:5000/api/health`

## 📋 All API Endpoints (7 total)

### Authentication

```
POST   /api/auth/request-magic-link     # Email login link
POST   /api/auth/verify-magic-link      # Verify & get tokens
POST   /api/auth/refresh-token          # Get new access token
POST   /api/auth/logout                 # Revoke sessions
```

### Users (require JWT)

```
GET    /api/users/me                    # Get current user
PUT    /api/users/profile               # Update profile
PUT    /api/users/settings              # Update settings
```

### System

```
GET    /api/health                      # Server health
```

## 🔐 Auth Flow (4 Steps)

1. `POST /auth/request-magic-link` → Email sent
2. User clicks email link
3. `POST /auth/verify-magic-link` → Get JWT tokens
4. Use `Authorization: Bearer <token>` on protected endpoints

## 🛠️ File Structure

```
/server/
├── src/
│   ├── app.js              # Express setup
│   ├── config/             # JWT, DB, email, constants
│   ├── middleware/         # Auth, errors, validation, rates
│   ├── models/             # User, AuthToken, RefreshToken
│   ├── services/           # Auth, user, email logic
│   ├── controllers/        # Endpoint handlers
│   ├── routes/             # API routes
│   └── utils/              # Tokens, logger, errors
├── tests/                  # Test suite
├── server.js               # Entry point
└── package.json
```

## 💾 Environment Variables

```env
DATABASE_URL=mongodb+srv://...
JWT_ACCESS_SECRET=<32-char-random>
JWT_REFRESH_SECRET=<32-char-random>
RESEND_API_KEY=<key>
FROM_EMAIL=noreply@effetmer.com
FRONTEND_URL=http://localhost:3000
MAGIC_LINK_URL=http://localhost:3000/auth/verify
PORT=5000
NODE_ENV=development
```

Generate JWT secrets:

```bash
openssl rand -base64 32
```

## 🔑 Security Checklist

✅ Helmet headers
✅ CORS whitelist (frontend origin only)
✅ Rate limiting (3/hr auth, 100/15min general)
✅ bcrypt token hashing (10 rounds)
✅ JWT HS256 signing
✅ Input validation (express-validator)
✅ Soft deletes (never delete users)
✅ Token revocation support
✅ MongoDB TTL indexes
✅ Error normalization (no stack traces)
✅ Morgan HTTP logging
✅ Single-use magic links

## 📝 Response Format

### Success (200)

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

### Error (4xx/5xx)

```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "...",
  "details": {},
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🧪 Testing

```bash
npm test                    # Run tests
npm run dev                # Start with watch mode
curl http://localhost:5000/api/health  # Health check
```

## 📦 Dependencies (13)

express, mongoose, jsonwebtoken, bcrypt, helmet, cors, express-rate-limit, express-validator, axios, resend, winston, morgan, dotenv

## 🔗 Token Types

| Token      | Type | Lifetime | Storage        |
| ---------- | ---- | -------- | -------------- |
| Access     | JWT  | 15 min   | sessionStorage |
| Refresh    | JWT  | 7 days   | localStorage   |
| Magic Link | Hex  | 15 min   | Email + DB     |

## 🗄️ Database Schemas

### User

```
email (unique), profile, settings, stats, hasLocalData, timestamps
```

### AuthToken

```
email, tokenHash, expiresAt (TTL), isUsed, createdAt
```

### RefreshToken

```
userId, tokenHash, metadata, expiresAt, revokedAt
```

## 📊 Rate Limits

- **Magic Link**: 3/hour per email
- **Auth**: 3/hour
- **General**: 100/15 minutes

## 🎯 HTTP Status Codes

- 200 OK
- 400 Bad Request (validation)
- 401 Unauthorized (auth)
- 403 Forbidden (permissions)
- 404 Not Found
- 409 Conflict (duplicate)
- 429 Too Many Requests
- 500 Server Error

## 📖 Documentation Files

| File                       | Purpose                | Size      |
| -------------------------- | ---------------------- | --------- |
| API_DOCUMENTATION.md       | Complete API reference | 400 lines |
| BACKEND_PHASE1_GUIDE.md    | Implementation guide   | 500 lines |
| BACKEND_PHASE1_COMPLETE.md | Summary + status       | 300 lines |
| README_BACKEND_PHASE1.md   | This summary           | 250 lines |

## 🚢 Deployment

```bash
# Set environment variables in hosting
npm install
npm start
```

Monitoring: Check `logs/` directory for combined.log and error.log

## 🚫 Common Issues

| Problem             | Solution                                   |
| ------------------- | ------------------------------------------ |
| JWT secret not set  | Generate with `openssl rand -base64 32`    |
| Magic link not sent | Check RESEND_API_KEY, FROM_EMAIL verified  |
| CORS error          | Update FRONTEND_URL in .env                |
| Rate limited        | Adjust limits in middleware/rateLimiter.js |
| DB connection fails | Whitelist IP in MongoDB Atlas console      |

## 🔄 Frontend Integration (Phase 1.5)

Files to create:

- `src/services/apiClient.js` - API client with JWT
- `src/pages/LoginPage.jsx` - Login UI
- `src/context/AuthContext.jsx` - Auth state
- `src/hooks/useAuth.js` - Auth hook

Update:

- `src/App.js` - Add auth layer
- Merge with existing AppContext

## 📞 Help Resources

- See troubleshooting in BACKEND_PHASE1_GUIDE.md
- Check Winston logs in logs/ directory
- Review error response `details` field for specifics

## ✅ Phase 1 Complete

23 files, 7 endpoints, production-ready, fully documented, security hardened

Ready for: Frontend integration, user testing, cloud deployment

---

**Last Updated**: Implementation Complete (Phase 1)
**Status**: ✅ Production-Ready
**Next**: Phase 1.5 - Frontend Integration
