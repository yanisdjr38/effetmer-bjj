# 🚀 GUIDE DE DÉPLOIEMENT - EFFETMER V1 AVEC BACKEND

## ⚡ Résumé du Plan

L'application EFFETMER V1 utilise :

- **Frontend**: React + Netlify
- **Backend**: Node.js/Express + MongoDB Atlas + Railway.app
- **Auth**: Magic Link par email (Resend)

---

## 📋 ÉTAPE 1: Configuration Préalable

### 1.1 Créer les services cloud nécessaires

```bash
# A. MongoDB Atlas
# 1. Aller sur https://www.mongodb.com/cloud/atlas
# 2. Créer compte gratuit
# 3. Créer un cluster (Free Tier)
# 4. Créer un utilisateur DB
# 5. Whitelister ton IP (0.0.0.0/0 pour dev)
# 6. Copier la connection string

# B. Resend Email Service
# 1. Aller sur https://resend.dev
# 2. Créer compte (gratuit pour dev)
# 3. Créer une API key
# 4. Vérifier le domaine d'envoi

# C. Railway.app (backend hosting)
# 1. Aller sur https://railway.app
# 2. Login avec GitHub
# 3. Créer nouveau projet
```

### 1.2 Variables d'environnement Backend

Copie `server/.env.example` en `server/.env` et remplis :

```bash
cd server
cp .env.example .env
# Édite .env avec tes vraies valeurs:
```

**Valeurs requises**:

```
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/effetmer_bjj
JWT_ACCESS_SECRET=<génère avec: openssl rand -base64 32>
JWT_REFRESH_SECRET=<génère avec: openssl rand -base64 32>
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=noreply@yourdomain.com
FRONTEND_URL=http://localhost:3000  # Pour dev, à changer en prod
MAGIC_LINK_URL=http://localhost:3000/auth/verify
```

### 1.3 Variables d'environnement Frontend

Copie `my-app/.env.example` en `my-app/.env` :

```bash
cd my-app
cp .env.example .env
# Pour dev:
# REACT_APP_API_BASE_URL=http://localhost:5000/api
# Pour prod:
# REACT_APP_API_BASE_URL=https://your-backend.railway.app/api
```

---

## 🧪 ÉTAPE 2: Test Local (Complet)

### 2.1 Démarrer MongoDB (si local)

```bash
# Option A: MongoDB Community (installé)
mongod

# Option B: Docker
docker run -d -p 27017:27017 mongo:latest
```

### 2.2 Démarrer le Backend

```bash
cd server
npm install
npm run dev
# Vérifier sur http://localhost:5000/api/health
```

### 2.3 Démarrer le Frontend

```bash
cd my-app
npm install
npm start
# Vérifier sur http://localhost:3000
```

### 2.4 Test du Flow Complet

```
1. Voir page de login
2. Entrer un email
3. Voir message "Lien envoyé"
4. Vérifier logs du backend pour le token
5. Cliquer lien de confirmation (ou copier token)
6. Voir onboarding
7. Compléter onboarding
8. Voir dashboard
```

---

## 🌐 ÉTAPE 3: Déployer le Backend

### 3.1 Railway.app (Recommandé)

```bash
# A. Initialiser Git (if not done)
cd /home/yanis/Documents/effetmer_bjj
git init
git add .
git commit -m "Initial commit: EFFETMER V1 with backend"
git remote add origin https://github.com/yanisdjr38/effetmer-bjj.git

# B. Créer Procfile pour Railway
# Dans /server directory:
# Créer fichier: server/Procfile
```

**Procfile content:**

```
web: node server.js
```

```bash
# C. Push à GitHub
git push -u origin main

# D. Connecter Railway
# 1. Sur railway.app: Créer nouveau project
# 2. Sélectionner "Deploy from GitHub"
# 3. Connecter repo
# 4. Ajouter variables d'env (Railway dashboard)
# 5. Railway auto-détecte Procfile et lance le server
```

**Variables à ajouter dans Railway Dashboard**:

```
DATABASE_URL=mongodb+srv://***
JWT_ACCESS_SECRET=***
JWT_REFRESH_SECRET=***
RESEND_API_KEY=***
FROM_EMAIL=***
FRONTEND_URL=https://yourfrontend.netlify.app
MAGIC_LINK_URL=https://yourfrontend.netlify.app/auth/verify
PORT=5000
NODE_ENV=production
```

### 3.2 Alternative: Heroku

```bash
# A. Installer Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# B. Login
heroku login

# C. Créer app
heroku create effetmer-bjj-backend

# D. Ajouter variables
heroku config:set DATABASE_URL=mongodb+srv://*** --app effetmer-bjj-backend
heroku config:set JWT_ACCESS_SECRET=*** --app effetmer-bjj-backend
# ... (autres variables)

# E. Deploy
git push heroku main
```

**Récupère l'URL**: `https://effetmer-bjj-backend.herokuapp.com`

---

## 🎨 ÉTAPE 4: Déployer le Frontend

### 4.1 Netlify

```bash
# A. Mettre à jour .env avec l'URL du backend déployé
cd my-app
# Éditer .env:
REACT_APP_API_BASE_URL=https://effetmer-bjj-backend.railway.app/api

# B. Build
npm run build

# C. Sur Netlify.com:
# 1. Connecter GitHub
# 2. Sélectionner repo
# 3. Branch: main
# 4. Build command: npm run build
# 5. Publish directory: my-app/build
# 6. Ajouter variable d'env NODE_ENV=production

# D. Déployer
# Netlify auto-build et déploie à chaque push
```

**Récupère l'URL**: `https://effetmer-bjj.netlify.app`

### 4.2 Mettre à jour FRONTEND_URL au backend

Une fois que tu as l'URL du frontend, retour à Railway/Heroku et mets à jour:

```
FRONTEND_URL=https://effetmer-bjj.netlify.app
MAGIC_LINK_URL=https://effetmer-bjj.netlify.app/auth/verify
```

---

## ✅ VÉRIFICATIONS FINALES

### Checklist Production

- [ ] Backend sur Railway/Heroku
- [ ] Frontend sur Netlify
- [ ] MongoDB Atlas créé et connecté
- [ ] CORS configuré (FRONTEND_URL correct)
- [ ] Email Resend fonctionnelle
- [ ] JWT secrets générés (32+ caractères)
- [ ] Pas de secrets en git (.gitignore à jour ✓)
- [ ] Build frontend réussit (`npm run build`)
- [ ] Backend health check OK (`/api/health`)
- [ ] Magic link flow testé en prod
- [ ] Onboarding et dashboard fonctionnels

### Test Production

```bash
1. Aller sur https://effetmer-bjj.netlify.app
2. Entrer un email
3. Vérifier que l'email est reçu
4. Cliquer sur le lien
5. Compléter le profil
6. Compléter l'onboarding
7. Voir le dashboard complet
```

---

## 🔗 LIENS IMPORTANTS

- Frontend: https://effetmer-bjj.netlify.app
- Backend Health: https://effetmer-bjj-backend.railway.app/api/health
- MongoDB Atlas: https://cloud.mongodb.com/v2
- Resend: https://resend.dev
- Railway: https://railway.app
- Netlify: https://netlify.com

---

## 📞 TROUBLESHOOTING

### "CORS Error"

→ Vérifier `FRONTEND_URL` au backend correspond à ta vraie URL frontend

### "Magic link not sent"

→ Vérifier `RESEND_API_KEY` et `FROM_EMAIL` au backend
→ Check Railway/Heroku logs

### "Token expired too fast"

→ Vérifier `JWT_ACCESS_EXPIRY=15m` au backend

### "Connection refused localhost:5000"

→ Backend pas démarré. Lancer: `npm run dev` dans `/server`

---

## 🎉 C'EST BON !

Ton app est maintenant **100% opérationnel** avec :

- ✅ Auth Magic Link intégrée
- ✅ Données persistées MongoDB
- ✅ Frontend & Backend séparés
- ✅ Prêt pour ajouter plus de features
