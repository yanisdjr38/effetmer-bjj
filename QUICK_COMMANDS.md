# ⚡ QUICK REFERENCE - EFFETMER V1 Commands

## 🚀 START LOCAL DEVELOPMENT

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd my-app && npm start

# Terminal 3 - (Optional) Check logs
cd server && tail -f logs/*.log
```

**Access**:

- Backend: http://localhost:5000/api
- Frontend: http://localhost:3000

---

## 🔧 SETUP (First Time)

```bash
# Create environment files
cd server && cp .env.example .env
cd ../my-app && cp .env.example .env

# Edit with your values
nano server/.env
nano my-app/.env

# Install dependencies
cd server && npm install
cd ../my-app && npm install
```

---

## 🧪 TESTING

```bash
# Backend unit tests
cd server && npm test

# Frontend build check
cd my-app && npm run build

# API health check
curl http://localhost:5000/api/health

# Check database connection
cd server && node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.DATABASE_URL).then(() => console.log('✓ DB OK')).catch(e => console.log('✗ DB Error:', e.message))"
```

---

## 📤 BUILD FOR PRODUCTION

```bash
# Frontend
cd my-app && npm run build
# Output: ./build/

# Backend (no build needed, just ensure Node 18+)
node --version  # Check: v18.0.0+

# Create Procfile (already done)
cat server/Procfile  # → web: node server.js
```

---

## 🌐 DEPLOY TO CLOUD

### Backend (Railway)

```bash
# A. Connect to Railway
# 1. https://railway.app
# 2. Create new project
# 3. Deploy from GitHub

# B. Set environment variables in Railway dashboard
RAIL_CLI_ASSUME_YES=1 railway variables set \
  DATABASE_URL="mongodb+srv://..." \
  JWT_ACCESS_SECRET="..." \
  JWT_REFRESH_SECRET="..." \
  RESEND_API_KEY="..." \
  FROM_EMAIL="noreply@..." \
  FRONTEND_URL="https://yourfrontend.netlify.app"

# C. Verify deployment
curl https://your-project.railway.app/api/health
```

### Frontend (Netlify)

```bash
# A. Connect to Netlify
# 1. https://netlify.com
# 2. Deploy from GitHub
# 3. Build: npm run build
# 4. Publish: my-app/build

# B. Set environment variable
REACT_APP_API_BASE_URL=https://your-backend.railway.app/api

# C. Verify deployment
# 1. Check build logs
# 2. Visit: https://yourapp.netlify.app
```

---

## 🔑 ENVIRONMENT VARIABLES

### Backend `.env`

```
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_ACCESS_SECRET=<32+ chars>
JWT_REFRESH_SECRET=<32+ chars>
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=noreply@example.com
FRONTEND_URL=http://localhost:3000
MAGIC_LINK_URL=http://localhost:3000/auth/verify
```

### Frontend `.env`

```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

---

## 🛠️ COMMON FIXES

### Port 5000 Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill it
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

### MongoDB Connection Error

```bash
# Verify connection string
echo $DATABASE_URL

# Test connection
mongosh "$DATABASE_URL"

# Check whitelist in Atlas
# 1. https://cloud.mongodb.com
# 2. Network Access
# 3. Add your IP
```

### Magic Link Not Sending

```bash
# Check Resend API key
echo $RESEND_API_KEY

# Verify sender domain
# 1. https://resend.dev
# 2. Domains
# 3. Verify sender domain

# Check backend logs
cat logs/*.log | tail -20
```

### CORS Error Frontend

```bash
# Verify FRONTEND_URL in backend .env
grep FRONTEND_URL server/.env

# Should match your frontend origin
# Dev: http://localhost:3000
# Prod: https://yourapp.netlify.app

# Restart backend after change
```

---

## 📊 USEFUL API CALLS

### Test Magic Link Flow

```bash
# 1. Request link
curl -X POST http://localhost:5000/api/auth/request-magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 2. Check token in MongoDB
# mongosh
# use effetmer_bjj
# db.authtokens.findOne({email: "test@example.com"})

# 3. Verify magic link
curl -X POST http://localhost:5000/api/auth/verify-magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","token":"TOKEN_FROM_DB"}'
```

### Test Protected Endpoint

```bash
# Get access token first
TOKEN="your_token_here"

# Call protected endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/users/me
```

### Get All Goals

```bash
TOKEN="your_token_here"

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/goals
```

---

## 🗑️ CLEANUP

```bash
# Remove node_modules
rm -rf server/node_modules
rm -rf my-app/node_modules

# Remove build
rm -rf my-app/build

# Remove logs
rm -rf server/logs/*

# Clean git
git clean -fd
```

---

## 📝 GIT WORKFLOW

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Feature: add training sessions API"

# Push to main
git push origin main

# Push to production branch
git push origin production

# Show logs
git log --oneline -10
```

---

## 🐛 DEBUG MODE

### Backend Verbose Logging

```bash
DEBUG=* NODE_ENV=development npm run dev
```

### Frontend React DevTools

- Install: React DevTools Chrome Extension
- Inspect components at http://localhost:3000

### MongoDB Queries

```bash
# Connect to MongoDB
mongosh "$DATABASE_URL"

# List all databases
show dbs

# Use effetmer database
use effetmer_bjj

# List collections
show collections

# View users
db.users.find()

# View goals
db.goals.find()
```

---

## 📞 HELP

### Backend Not Starting?

1. Check Node version: `node --version` (need 18+)
2. Check .env exists: `ls server/.env`
3. Check MongoDB connection: `mongosh "$DATABASE_URL"`
4. Check port available: `lsof -i :5000`

### Frontend Not Building?

1. Check React version: `npm list react`
2. Clear cache: `rm -rf node_modules && npm install`
3. Check for TypeScript errors: `npx tsc --noEmit`

### Database Issues?

1. Verify MongoDB Atlas account
2. Check cluster is running
3. Check IP is whitelisted
4. Verify username/password

---

## ✅ DEPLOYMENT CHECKLIST

Before deploying:

- [ ] All .env files created
- [ ] Build passes: `npm run build`
- [ ] Backend tests pass: `npm test`
- [ ] API health OK: curl /api/health
- [ ] Magic link flow tested
- [ ] No secrets in .gitignore
- [ ] Git commits pushed

---

**Last Updated**: May 15, 2026  
**Version**: V1.0  
**Ready for**: Production
