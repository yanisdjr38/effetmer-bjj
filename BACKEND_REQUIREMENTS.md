# 📋 EFFETMER - SPÉCIFICATIONS DU BACKEND

**Stack Recommandée:** Node.js + Express.js + MongoDB + JWT Auth

---

## 🔐 1. AUTHENTICATION & USER MANAGEMENT

### 1.1 Authentification

- **POST `/api/auth/register`** - Inscription nouvel utilisateur
  - Input: `{ email, password, firstName, lastName }`
  - Response: `{ token, userId, user }`
  - Hachage du mot de passe avec bcryptjs
  - Vérification email unique
- **POST `/api/auth/login`** - Connexion
  - Input: `{ email, password }`
  - Response: `{ token, userId, user, expiresIn }`
  - JWT token avec expiration 7 jours
- **POST `/api/auth/logout`** - Déconnexion
  - Blacklist du token

- **POST `/api/auth/refresh-token`** - Renouveler le token
  - Input: `{ refreshToken }`
  - Response: `{ token }`

- **GET `/api/auth/verify`** - Vérifier token actuel
  - Middleware JWT protected
  - Response: `{ isValid, user }`

- **POST `/api/auth/forgot-password`** - Récupération mot de passe
  - Input: `{ email }`
  - Envoi email avec lien de réinitialisation

- **POST `/api/auth/reset-password`** - Réinitialiser mot de passe
  - Input: `{ token, newPassword }`

---

## 👤 2. USER PROFILE MANAGEMENT

### 2.1 Profil Utilisateur

- **GET `/api/user/profile`** - Récupérer le profil
  - Protected route (JWT)
  - Response: `{ userId, firstName, lastName, email, belt, academy, weight, yearsOfPractice, weeklyGoal, joinDate, profilePhoto }`

- **PUT `/api/user/profile`** - Mettre à jour le profil
  - Protected route
  - Input: `{ firstName, lastName, belt, academy, weight, yearsOfPractice, weeklyGoal }`
  - Response: Updated user object

- **POST `/api/user/profile-photo`** - Upload photo de profil
  - Multipart/form-data upload
  - Stockage AWS S3 ou local
  - Response: `{ photoUrl }`

- **DELETE `/api/user/account`** - Supprimer le compte
  - Soft delete (marquer comme supprimé)
  - Suppression de toutes les données associées

---

## 📅 3. TRAINING SCHEDULE MANAGEMENT

### 3.1 Horaires d'Entraînement Récurrents

- **GET `/api/training-schedule`** - Récupérer l'horaire
  - Protected route
  - Response: Array of recurring sessions `[{ id, day, startTime, endTime, trainingType, notes, enabled }]`

- **POST `/api/training-schedule`** - Ajouter une séance
  - Input: `{ day, startTime, endTime, trainingType, notes, enabled }`
  - Validation: Pas de chevauchement d'horaires
  - Response: `{ id, ...session }`

- **PUT `/api/training-schedule/:id`** - Modifier une séance
  - Input: `{ day, startTime, endTime, trainingType, notes, enabled }`
  - Response: Updated session

- **DELETE `/api/training-schedule/:id`** - Supprimer une séance
  - Soft delete

- **POST `/api/training-schedule/update-preferences`** - Mettre à jour préférences globales
  - Input: `{ preferredTrainingDays: ["Lundi", "Mercredi", ...], weeklyGoal }`

---

## 🏋️ 4. TRAINING SESSIONS TRACKING

### 4.1 Sessions d'entraînement complétées

- **GET `/api/training-sessions`** - Liste des séances
  - Query params: `{ from, to, limit, offset }` (pagination + filtrage par dates)
  - Protected route
  - Response: Array of completed sessions

- **POST `/api/training-sessions`** - Enregistrer une séance
  - Input: `{ date, startTime, endTime, duration, trainingType, location, techniques, partners, notes, difficulty, submissionsObtained, submissionsReceived }`
  - Calcul automatique duration
  - Response: `{ id, ...session, createdAt }`

- **PUT `/api/training-sessions/:id`** - Modifier une séance
  - Input: Same as POST
  - Response: Updated session

- **DELETE `/api/training-sessions/:id`** - Supprimer une séance
  - Soft delete

- **GET `/api/training-sessions/:id`** - Détails d'une séance
  - Response: Complete session with all details

---

## 🎯 5. GOALS & CHALLENGES

### 5.1 Objectifs Personnels

- **GET `/api/goals`** - Lister les objectifs
  - Query: `{ status: "active|completed|all" }`
  - Response: Array of goals `[{ id, title, description, category, target, progress, startDate, dueDate, status, createdAt }]`

- **POST `/api/goals`** - Créer un objectif
  - Input: `{ title, description, category, target, dueDate }`
  - Categories: "sessions", "techniques", "duration", "submissions", "other"
  - Response: `{ id, ...goal }`

- **PUT `/api/goals/:id`** - Mettre à jour un objectif
  - Input: `{ title, description, target, progress, dueDate, status }`
  - Response: Updated goal

- **DELETE `/api/goals/:id`** - Supprimer un objectif
  - Soft delete

- **POST `/api/goals/:id/complete`** - Marquer comme complété
  - Response: `{ id, status: "completed", completedAt }`

- **POST `/api/goals/:id/progress`** - Mettre à jour la progression
  - Input: `{ progress }`
  - Response: Updated goal with progress

---

## 📊 6. STATISTICS & ANALYTICS

### 6.1 Statistiques Personnelles

- **GET `/api/stats/overview`** - Aperçu général
  - Response: `{ totalSessions, totalHours, totalTechniques, totalSubmissions, lastSessionDate, currentStreak, longestStreak }`

- **GET `/api/stats/weekly`** - Stats hebdomadaires (7 jours)
  - Response: `{ week: { Monday: 1, Tuesday: 0, ... }, averagePerDay }`

- **GET `/api/stats/monthly`** - Stats mensuelles (30 jours)
  - Response: `{ days: [{ date, sessions, hours }], average }`

- **GET `/api/stats/yearly`** - Stats annuelles
  - Response: `{ months: { "Jan": 5, "Feb": 7, ... }, total }`

- **GET `/api/stats/techniques`** - Techniques apprises
  - Response: `[{ name, category, count, lastUsed, dateAdded }]`

- **GET `/api/stats/submissions`** - Stats soulevés
  - Response: `{ byType: { "armbar": 10, "triangle": 8, ... }, total, rate }`

- **GET `/api/stats/progression`** - Progression de ceinture
  - Response: `{ currentBelt, beltHistory: [{ belt, awardedDate, promoter }], estimatedNextPromotion }`

---

## 🏅 7. ACHIEVEMENTS & BADGES

### 7.1 Badges et Distinctions

- **GET `/api/achievements`** - Lister tous les badges
  - Response: `[{ id, name, description, icon, criteria, earned, earnedDate, rarity }]`

- **POST `/api/achievements/check`** - Vérifier nouveaux badges
  - Backend calcule automatiquement les badges gagnés
  - Response: `[{ badgeId, earnedAt }]` (nouveaux badges)

- **Badges Disponibles:**
  - Débutant (1ère séance)
  - Habitué (10 séances)
  - Compétiteur (30 séances)
  - Maître (100 séances)
  - Spécialiste (50 techniques apprises)
  - Soumissionnaire (100 soumissions)
  - Guerrier (7 jours d'affilée)
  - Élève (1 an de pratique)
  - Champion (Objectifs complétés)

---

## 🗂️ 8. MONGODB SCHEMA DESIGN

### User Model

```javascript
{
  _id: ObjectId,
  email: String (unique, lowercase),
  passwordHash: String (bcrypté),
  firstName: String,
  lastName: String,
  belt: String (enum: white, blue, purple, brown, black),
  academy: String,
  weight: Number,
  yearsOfPractice: Number,
  weeklyGoal: Number,
  profilePhoto: String (URL),
  joinDate: Date,
  lastLogin: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date (null if active)
}
```

### TrainingSchedule Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  day: String (Lundi, Mardi, ...),
  startTime: String (HH:mm),
  endTime: String (HH:mm),
  trainingType: String (open mat, fundamentals, advanced, wrestling, conditioning),
  notes: String,
  enabled: Boolean,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date
}
```

### TrainingSession Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  date: Date,
  startTime: String,
  endTime: String,
  duration: Number (minutes),
  trainingType: String,
  location: String,
  techniques: [String],
  partners: [String],
  notes: String,
  difficulty: Number (1-5),
  submissionsObtained: Number,
  submissionsReceived: Number,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date
}
```

### Goal Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  category: String (enum: sessions, techniques, duration, submissions, other),
  target: Number,
  progress: Number,
  startDate: Date,
  dueDate: Date,
  status: String (enum: active, completed, archived),
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date
}
```

### Achievement Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String,
  description: String,
  icon: String (emoji),
  criteria: Object,
  earned: Boolean,
  earnedAt: Date,
  rarity: String (common, uncommon, rare, epic, legendary),
  createdAt: Date
}
```

---

## 🔄 9. ADVANCED FEATURES

### 9.1 Notifications

- **GET `/api/notifications`** - Lister notifications
- **POST `/api/notifications/mark-read`** - Marquer comme lu
- **SIGNALR/WebSocket** - Real-time notifications (optional)

### 9.2 Social Features (Phase 2)

- **GET `/api/community/friends`** - Liste amis
- **POST `/api/community/friend-request`** - Envoyer invitation
- **POST `/api/statistics/compare`** - Comparer avec un ami
- **GET `/api/community/leaderboard`** - Classement

### 9.3 Backup & Export

- **GET `/api/export/pdf`** - Exporter rapport PDF
- **GET `/api/export/csv`** - Exporter données CSV
- **POST `/api/backup`** - Créer backup

### 9.4 Admin Features

- **GET `/api/admin/users`** - Lister tous utilisateurs
- **DELETE `/api/admin/users/:id`** - Supprimer utilisateur (admin)
- **GET `/api/admin/analytics`** - Analytics globales

---

## 🔒 10. SECURITY & BEST PRACTICES

### 10.1 Authentification & Autorisation

- ✅ JWT tokens avec expiration
- ✅ Refresh tokens stockés en base de données
- ✅ Bcryptjs pour hachage les mots de passe (salt rounds: 10)
- ✅ HTTPS obligatoire en production
- ✅ CORS configuration stricte
- ✅ Rate limiting sur endpoints d'authentification

### 10.2 Validation des Données

- ✅ Validation input côté serveur (joi ou express-validator)
- ✅ Sanitisation des inputs
- ✅ Protection CSRF
- ✅ Limitation de taille uploads

### 10.3 Base de Données

- ✅ Soft deletes pour préserver données historiques
- ✅ Indexes sur userId, email
- ✅ Transactions MongoDB pour opérations multiples
- ✅ Backup automatique quotidien

### 10.4 Logging & Monitoring

- ✅ Winston ou Bunyan pour logs
- ✅ Logs des erreurs d'authentification
- ✅ Monitoring avec PM2/New Relic
- ✅ Sentry pour error tracking

---

## 📱 11. AUTO-CALCULATED METRICS

Le backend doit calculer automatiquement:

1. **Streak (Série)** - Jours d'affilée avec entraînement
2. **Sessions ce mois** - Nombre de séances actuelles
3. **Heures ce mois** - Total heures entraînement
4. **Techniques apprises** - Nombre unique techniques
5. **Taux de complétion** - Objectifs vs réels
6. **Progression de ceinture** - Estimation date prochaine
7. **Badges gagnés** - Auto-recalculer chaque session
8. **Tendances** - Moyenne mobile 7 jours

---

## 🚀 12. DEPLOYMENT & ENVIRONMENT

### Production Deployment

- Environment variables (.env):

  ```
  NODE_ENV=production
  MONGODB_URI=mongodb+srv://...
  JWT_SECRET=...
  JWT_EXPIRE=7d
  REFRESH_TOKEN_EXPIRE=30d
  API_PORT=4000
  FRONTEND_URL=https://effetmer.com
  SENDGRID_API_KEY=...
  AWS_ACCESS_KEY_ID=...
  AWS_SECRET_ACCESS_KEY=...
  ```

- Server: Node.js 18+
- Database: MongoDB Atlas
- API Rate Limiting: 100 req/min per IP
- CORS: Whitelist only frontend domain

---

## 📚 13. API RESPONSE FORMAT

Toutes les réponses doivent suivre ce format:

```javascript
{
  success: true/false,
  code: 200/400/401/500,
  message: "Description de l'action",
  data: { ... } // Null si erreur,
  timestamp: "2026-05-11T10:30:00Z"
}
```

---

## 🧪 14. TESTING

- ✅ Unit tests (Jest)
- ✅ Integration tests pour endpoints
- ✅ Tests authentication
- ✅ Tests de stress (k6)
- ✅ Coverage minimum: 80%

---

## 📌 INTEGRATION REACT -> BACKEND

### API Client Setup (React)

```javascript
// src/api/apiClient.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

const apiClient = axios.create({
  baseURL: API_URL,
});

// Ajouter token aux headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gérer expiration token
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Rediriger à login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
```

### Usage dans composants

```javascript
// Exemple: ProfilePage
const ProfilePage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    apiClient
      .get("/user/profile")
      .then((res) => setProfile(res.data.data))
      .catch((err) => console.error("Erreur:", err));
  }, []);

  return <>...</>;
};
```

---

## ✅ PRIORITÉS D'IMPLÉMENTATION

### Phase 1 (MVP - Semaines 1-2)

1. Auth endpoints (register, login, logout)
2. User profile CRUD
3. Training sessions CRUD
4. Stats overview

### Phase 2 (Semaines 3-4)

1. Training schedule management
2. Goals CRUD
3. Advanced analytics
4. Badges system

### Phase 3 (Semaines 5-6)

1. Social features (amis, comparaison)
2. Notifications
3. Exports PDF/CSV
4. Admin dashboard

### Phase 4 (Nice to Have)

1. Mobile app (React Native)
2. Wearable integration
3. AI recommendations
4. Auto-schedule suggestions

---

## 📞 SUPPORT & DOCUMENTATION

- Postman Collection: `./api-collection.json`
- API Docs: Swagger/OpenAPI `./swagger.yaml`
- Database Docs: `./db-schema.md`
- Git Flow: Feature branches → Develop → Main
