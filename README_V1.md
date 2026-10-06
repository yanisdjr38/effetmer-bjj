# 🥋 EFFETMER BJJ - Version 1.0 (Backend Ready)

**Status**: ✅ **Version 1.0 FONCTIONNELLE AVEC BACKEND**  
**Date**: Mai 2026  
**Architecture**: React Frontend + Node.js Backend + MongoDB

---

## 🎯 Quoi de Neuf dans V1

### ✅ Intégration Backend Complète

- ✓ **Magic Link Authentication** (Email verification)
- ✓ **MongoDB Persistent Storage** (Données sauvegardées)
- ✓ **API Endpoints Complets**:
  - Authentication (registration, login, logout)
  - Training Schedules (CRUD)
  - Training Sessions (historique)
  - Goals & Achievements
  - User Profile Management

### ✅ Séparation Frontend/Backend

- ✓ Frontend: React sur **http://localhost:3000**
- ✓ Backend: Node.js/Express sur **http://localhost:5000**
- ✓ Communication via API REST + JWT

### ✅ Persistance des Données

- ✓ Données utilisateur sauvegardées sur **MongoDB**
- ✓ Données accessibles sur tous les appareils
- ✓ Sessions utilisateur gérées par JWT tokens

---

## 🚀 Quick Start (3 minutes)

### Prérequis

- Node.js 18+ (`node --version`)
- MongoDB local OU MongoDB Atlas (cloud)
- Compte Resend pour emails

### 1. Configuration

```bash
# Frontend
cd my-app
cp .env.example .env
# REACT_APP_API_BASE_URL=http://localhost:5000/api

# Backend
cd ../server
cp .env.example .env
# Remplir les valeurs:
# - DATABASE_URL: String de connexion MongoDB
# - JWT_ACCESS_SECRET: openssl rand -base64 32
# - JWT_REFRESH_SECRET: openssl rand -base64 32
# - RESEND_API_KEY: De https://resend.dev
# - FROM_EMAIL: noreply@votredomaine.com
```

### 2. Démarrer en 2 terminaux

```bash
# Terminal 1: Backend
cd server && npm install && npm run dev
# → Écoute sur http://localhost:5000

# Terminal 2: Frontend
cd my-app && npm install && npm start
# → Ouvre http://localhost:3000
```

### 3. Tester le Flow

1. Page de login → Entrer email
2. Email reçu → Cliquer lien magic link
3. Onboarding → Compléter profil
4. Dashboard → Voir application

---

## 📋 Architecture V1

```
EFFETMER V1
├── Frontend (React 18)
│   ├── Pages: Home, Profile, Training, Goals, Analytics
│   ├── Components: Auth, NavBar, Forms
│   ├── Context: AuthContext (JWT), AppContext (app state)
│   └── Services: apiClient (JWT interceptors)
│
├── Backend (Express.js)
│   ├── Routes: /auth, /users, /training-schedule, /sessions, /goals
│   ├── Models: User, AuthToken, RefreshToken, TrainingSchedule, etc.
│   ├── Middleware: JWT auth, CORS, Rate limiting
│   └── Services: Auth service, Email service (Resend)
│
└── Database (MongoDB)
    ├── Users (profile, settings)
    ├── AuthTokens (magic link storage)
    ├── RefreshTokens (JWT sessions)
    ├── TrainingSchedules (horaires)
    ├── TrainingSessions (historique)
    └── Goals & Achievements
```

---

## 🔑 Variables d'Environnement

### Frontend: `.env`

```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### Backend: `.env`

```
# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/effetmer_bjj

# JWT
JWT_ACCESS_SECRET=<32+ characters>
JWT_REFRESH_SECRET=<32+ characters>

# Email (Resend)
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=noreply@example.com

# App
FRONTEND_URL=http://localhost:3000
MAGIC_LINK_URL=http://localhost:3000/auth/verify
```

---

## 🧪 Endpoints API

### Auth

```
POST   /api/auth/request-magic-link     → Envoyer lien magic link
POST   /api/auth/verify-magic-link      → Vérifier token et créer session
POST   /api/auth/refresh-token          → Rafraîchir JWT
POST   /api/auth/logout                 → Déconnexion
```

### Users

```
GET    /api/users/me                    → Récupérer profil courant
PUT    /api/users/profile               → Mettre à jour profil
```

### Training Schedule

```
GET    /api/training-schedule           → Tous les horaires
POST   /api/training-schedule           → Créer horaire
PUT    /api/training-schedule/:id       → Mettre à jour
DELETE /api/training-schedule/:id       → Supprimer
```

### Sessions

```
GET    /api/sessions                    → Historique sessions
POST   /api/sessions                    → Créer session
DELETE /api/sessions/:id                → Supprimer session
```

### Goals

```
GET    /api/goals                       → Tous les objectifs
POST   /api/goals                       → Créer objectif
POST   /api/goals/:id/complete          → Marquer comme complet
```

---

## 🐛 Troubleshooting

### "CORS Error"

```
Vérifier FRONTEND_URL au backend .env
```

### "Connection refused"

```
Backend pas démarré?
Lancer: cd server && npm run dev
```

### "No token provided"

```
Vérifier le magic link est cliqué correctement
Check logs du serveur
```

### "Magic link not sent"

```
Vérifier RESEND_API_KEY et FROM_EMAIL
Check Railway/Heroku logs en prod
```

---

## 📦 Next Steps (V1.1+)

- [ ] Tests e2e (Cypress)
- [ ] Refresh token rotation
- [ ] Password reset flow
- [ ] Techniques library API
- [ ] Mobile app (React Native)
- [ ] Performance monitoring

---

## 🚢 Deployment

Voir [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) pour :

- Déployer le backend (Railway/Heroku)
- Déployer le frontend (Netlify/Vercel)
- Configurer MongoDB Atlas
- Configurer emails Resend

---

## 📞 Support

GitHub Issues: https://github.com/yanisdjr38/effetmer-bjj/issues

---

**Code avec ❤️ pour les athlètes of JJB**
