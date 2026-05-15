# ✅ EFFETMER Backend - Pre-Launch Checklist

## 📋 Pre-Deployment Setup (Do This First)

### Local Development

- [ ] Run `npm install` in `/server` directory
- [ ] Copy `.env.example` to `.env`
- [ ] Generate JWT secrets: `openssl rand -base64 32` (run 2x)
- [ ] Get MongoDB connection string from Atlas
- [ ] Get Resend API key
- [ ] Update `.env` with all values
- [ ] Run `npm run dev` - verify server starts on port 5000
- [ ] Test `curl http://localhost:5000/api/health` - should return OK
- [ ] Review logs in `logs/` directory

### MongoDB Setup

- [ ] Create MongoDB Atlas account
- [ ] Create cluster (free tier OK for dev)
- [ ] Create database user with strong password
- [ ] Whitelist IP address (0.0.0.0/0 for dev OR your IP for security)
- [ ] Copy connection string to .env as DATABASE_URL
- [ ] Verify connection: `npm run dev` - check mongo logs

### Email Service Setup

- [ ] Create Resend.com account
- [ ] Create API key
- [ ] Verify sender domain (or use default)
- [ ] Add API key to .env as RESEND_API_KEY
- [ ] Test magic link email: `npm test` (auth tests)

### JWT Configuration

- [ ] Generate 2 random secrets: `openssl rand -base64 32`
- [ ] Add to .env as JWT_ACCESS_SECRET and JWT_REFRESH_SECRET
- [ ] Verify length is 32+ characters

### CORS & Frontend

- [ ] Know frontend URL (e.g., http://localhost:3000)
- [ ] Add to .env as FRONTEND_URL
- [ ] Verify MAGIC_LINK_URL is correct (frontend URL + /auth/verify)

---

## 🧪 Testing Checklist

### Unit Tests

- [ ] Run `npm test` from `/server` directory
- [ ] All tests pass (auth flow, rate limiting, validation)
- [ ] No console errors
- [ ] Check for warnings

### Manual API Tests

#### Health Check

```bash
curl http://localhost:5000/api/health
# Expected: { "status": "ok", "timestamp": "..." }
```

#### Request Magic Link

```bash
curl -X POST http://localhost:5000/api/auth/request-magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
# Expected: { "success": true, "data": { "email": "...", "expiresIn": 900 } }
```

#### Check Database

```javascript
// Connect to MongoDB and run:
db.authtokens.findOne({ email: "test@example.com" });
// Should show one record with tokenHash (bcrypt)
```

#### Request with Invalid Email

```bash
curl -X POST http://localhost:5000/api/auth/request-magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid"}'
# Expected: { "success": false, "code": "VALIDATION_ERROR", ... }
```

#### Rate Limiting

```bash
# Run request 4 times in quick succession
for i in {1..4}; do
  curl -X POST http://localhost:5000/api/auth/request-magic-link \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com"}'
done
# 4th response should be 429 Too Many Requests
```

### Logging Verification

- [ ] Check `logs/combined.log` - should have HTTP requests
- [ ] Check `logs/error.log` - should be empty or minimal
- [ ] Winston logger is working correctly

### Error Handling

- [ ] Test with invalid JSON → 400 error
- [ ] Test with missing email → 400 error
- [ ] Test with invalid token → 401 error
- [ ] Test protected endpoint without auth → 401 error
- [ ] All errors return standardized format

---

## 🔒 Security Checklist

### Code Security

- [ ] No plaintext passwords in .env
- [ ] No API keys committed to git
- [ ] .env.example has no real values
- [ ] All tokens hashed before storage
- [ ] Rate limiting enabled

### Database Security

- [ ] MongoDB user has minimal permissions (database-only)
- [ ] Connection string is secure (use strong password)
- [ ] No direct admin access in production .env
- [ ] TTL indexes are set (auto-expire magic links)
- [ ] Soft deletes working (deletedAt field used)

### API Security

- [ ] CORS restricted to frontend origin (not \*)
- [ ] Helmet headers enabled
- [ ] Rate limits in place
- [ ] Input validation on all routes
- [ ] No stack traces in error responses
- [ ] JWT secrets are strong (32+ chars random)

### Email Security

- [ ] Magic links are single-use
- [ ] Links expire after 15 minutes
- [ ] Email template is branded (not generic)
- [ ] No sensitive data in email headers

---

## 🚀 Pre-Production Checklist

### Environment

- [ ] .env file is NOT in git (check .gitignore)
- [ ] NODE_ENV is "development" for dev testing
- [ ] NODE_ENV will be "production" in deployed environment
- [ ] LOG_LEVEL is set appropriately
- [ ] HTTPS_ONLY is ready for production

### Performance

- [ ] Database indexes are created
- [ ] No N+1 queries identified
- [ ] Connection pooling is configured
- [ ] Logging doesn't print sensitive data
- [ ] Error handling doesn't block requests

### Monitoring & Logs

- [ ] Winston logger is configured
- [ ] Morgan HTTP logger is active
- [ ] Logs are written to files
- [ ] Log rotation is set up (for production)
- [ ] Error tracking service ready (e.g., Sentry)

### Documentation

- [ ] API_DOCUMENTATION.md is complete
- [ ] BACKEND_PHASE1_GUIDE.md explains everything
- [ ] QUICK_REFERENCE.md is accessible
- [ ] README in backend folder explains setup
- [ ] All API endpoints are documented

---

## 📦 Deployment Checklist

### Code Readiness

- [ ] All tests pass
- [ ] No console errors
- [ ] Dependencies are specified in package.json
- [ ] Production dependencies only (devDependencies not in production)

### Environment Variables

- [ ] DATABASE_URL is production MongoDB
- [ ] JWT secrets are strong (32+ chars)
- [ ] RESEND_API_KEY is valid production key
- [ ] FROM_EMAIL is verified in Resend
- [ ] FRONTEND_URL is production frontend URL
- [ ] MAGIC_LINK_URL is production link handler
- [ ] All required variables are set
- [ ] No .env file in git

### Hosting Configuration

#### For Heroku

- [ ] Procfile exists: `web: npm start`
- [ ] package.json has "start" script
- [ ] Environment variables added to Heroku config
- [ ] Node.js version specified
- [ ] MongoDB connection from Atlas works

#### For Docker

- [ ] Dockerfile is created
- [ ] .dockerignore includes node_modules, logs
- [ ] PORT is read from environment
- [ ] Build and run commands tested
- [ ] Image runs without errors

#### For AWS/DigitalOcean/Other

- [ ] Node.js 18 LTS is installed
- [ ] npm dependencies installed
- [ ] SSL/TLS certificate obtained (Letsencrypt)
- [ ] Reverse proxy configured (nginx/Apache)
- [ ] Environment variables set

### Database Preparation

- [ ] MongoDB Atlas cluster running
- [ ] Backups enabled for production
- [ ] Indexes are created
- [ ] Database user has minimal permissions
- [ ] IP whitelist is set (NOT 0.0.0.0/0 in production)

### Email Service

- [ ] Resend API key is production key
- [ ] Sender email/domain is verified
- [ ] Email templates are tested
- [ ] Reply-to address is configured

### Monitoring & Alerting

- [ ] Error tracking service setup (Sentry, etc.)
- [ ] Log aggregation service setup (if needed)
- [ ] Alerting configured for errors
- [ ] Performance monitoring ready
- [ ] Database backup monitoring

### Post-Launch

- [ ] Health endpoint responding
- [ ] Database connectivity verified
- [ ] Email service working
- [ ] JWT tokens generating correctly
- [ ] Rate limiting active
- [ ] Logs being written
- [ ] Error handling working

---

## 🧩 Frontend Integration Checklist

### Frontend API Client

- [ ] `src/services/apiClient.js` created
- [ ] Base URL is correct backend URL
- [ ] JWT interceptor is working
- [ ] 401 errors trigger token refresh
- [ ] Tokens are stored securely

### Authentication UI

- [ ] `src/pages/LoginPage.jsx` created
- [ ] Email input field works
- [ ] Magic link request succeeds
- [ ] Email verification flow works
- [ ] Forgot password flow ready (Phase 2)

### Auth Context

- [ ] `src/context/AuthContext.jsx` created
- [ ] Auth state is global
- [ ] useAuth hook is available
- [ ] Protected routes implemented
- [ ] Logout functionality works

### App Integration

- [ ] `src/App.js` updated with auth layer
- [ ] Auth gate before main app
- [ ] Optional login (not forcing registration)
- [ ] Navigation updated for auth state
- [ ] Error handling for auth failures

### Data Sync

- [ ] Local data survives page refresh
- [ ] Cloud data syncs on login
- [ ] Conflict resolution works
- [ ] Offline mode works without auth
- [ ] Online mode uses cloud data

---

## ✅ Final Verification

### Code Quality

- [ ] No `console.log()` statements (use logger)
- [ ] No hardcoded secrets
- [ ] No commented-out code
- [ ] Error messages are user-friendly
- [ ] Code follows consistent style

### Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual API tests pass
- [ ] Error cases tested
- [ ] Rate limiting tested

### Documentation

- [ ] API documentation is complete
- [ ] Setup guide is clear
- [ ] Troubleshooting guide helps
- [ ] Examples are accurate
- [ ] Deployment steps are documented

### Performance

- [ ] Response times are acceptable
- [ ] Database queries are optimized
- [ ] Memory usage is reasonable
- [ ] Logging overhead is minimal
- [ ] No obvious bottlenecks

---

## 🚨 Troubleshooting (If Something Breaks)

### Common Issues

| Issue                    | Cause                           | Solution                                  |
| ------------------------ | ------------------------------- | ----------------------------------------- |
| Can't connect to MongoDB | Wrong URL or IP not whitelisted | Check DATABASE_URL, whitelist IP in Atlas |
| JWT secret error         | Secrets not set or empty        | Generate with openssl, add to .env        |
| Magic links not sending  | Resend API error                | Check RESEND_API_KEY, verify FROM_EMAIL   |
| CORS error from frontend | Frontend URL not whitelisted    | Add correct frontend URL to FRONTEND_URL  |
| Rate limit too strict    | No adjustments made             | Increase RATE_LIMIT_MAX_REQUESTS in .env  |
| 404 on health check      | Server not running              | Run `npm run dev`, check PORT             |

### Check Logs

```bash
# Development logs (console output)
npm run dev

# File logs
tail -f logs/combined.log     # All requests
tail -f logs/error.log        # Errors only
```

### Database Debug

```bash
# Check if collections exist
db.collections()

# Check user count
db.users.countDocuments()

# Check magic links
db.authtokens.find()

# Check refresh tokens
db.refreshtokens.find()
```

---

## ✨ Go Live Checklist

Before deploying to production:

- [ ] Code review completed
- [ ] Security review completed
- [ ] All tests green
- [ ] Documentation reviewed
- [ ] Backup strategy planned
- [ ] Rollback plan documented
- [ ] Monitoring configured
- [ ] Error tracking enabled
- [ ] Team is trained on deployment
- [ ] Post-launch verification plan ready

---

## 📞 Quick Help

**Health Check**: `curl http://localhost:5000/api/health`
**Server Logs**: `tail -f logs/combined.log`
**Test Suite**: `npm test`
**Stop Server**: `Ctrl+C` in terminal

**API Base**: http://localhost:5000/api

---

## 🎯 Success Criteria

✅ Server starts without errors
✅ All tests pass
✅ Health endpoint responds
✅ Magic link emails send
✅ JWT tokens generate correctly
✅ Rate limiting blocks after threshold
✅ Errors return standardized format
✅ Logs are written to files
✅ Frontend can connect to backend
✅ Full authentication flow works end-to-end

---

**Status**: 🚀 Ready to launch when all checkboxes are checked!

_If you encounter any issues, check the troubleshooting section in BACKEND_PHASE1_GUIDE.md_
