# 🥋 EffetMer BJJ

Application web progressive (PWA) pour suivre ta progression en **Jiu-Jitsu Brésilien**.

## 🎯 Concept & Objectif

**EffetMer BJJ** est une application conçue pour les pratiquants de JJB qui souhaitent structurer leur progression et maintenir une trace de leur parcours martial.

L'objectif principal est de fournir un outil complet permettant de :

- **Suivre ses entraînements** et visualiser sa progression au fil du temps
- **Documenter les techniques** apprises avec notes, images et vidéos
- **Optimiser ses sessions** avec un timer d'entraînement configurable
- **Atteindre ses objectifs** grâce au suivi hebdomadaire motivant

## ✨ Fonctionnalités

### 📊 Dashboard (Page d'accueil)

- Aperçu complet de ta progression avec des statistiques clés
- Objectif hebdomadaire visualisé avec un cercle de progression
- Compteur total d'entraînements et temps cumulé
- Nombre de techniques enregistrées
- Affichage du dernier entraînement

### 🏋️ Suivi d'entraînement

- Création de sessions avec date, type et durée
- Notes personnalisées pour chaque entraînement
- Système de filtres par date et type
- Modification et suppression des sessions
- Persistance des données en local

### 📚 Bibliothèque de techniques

- Catalogue de techniques organisé par catégories :
  - 🔴 **Soumissions** (armbar, triangle, etc.)
  - 🔵 **Passages de garde**
  - 🟢 **Gardes**
  - 🟡 **Renversements**
  - ⚪ **Autres**
- Statut de maîtrise pour chaque technique (à réviser, en cours, maîtrisé)
- Support d'images et vidéos pour illustrer les mouvements
- Notes personnelles détaillées
- Filtres par catégorie, titre et statut

### ⏱️ Timer d'entraînement

- Programmes préconfigurés :
  - **Sparring** : 5 rounds de 5 min travail / 1 min repos
  - **Drill** : 4 rounds de 3 min travail / 30s repos
- Création de programmes personnalisés illimitée
- Gestion automatique work/rest avec compteur de rounds
- Signal sonore à chaque transition
- Contrôles pause/reprise et arrêt
- Barre de progression visuelle

## 🛠️ Stack Technique

| Technologie         | Utilisation                                       |
| ------------------- | ------------------------------------------------- |
| **React 18**        | Framework UI - Composants fonctionnels avec Hooks |
| **React Router v6** | Navigation SPA avec routes déclaratives           |
| **React Icons**     | Icônes Font Awesome intégrées                     |
| **LocalStorage**    | Persistance des données côté client               |
| **Service Worker**  | Fonctionnalités PWA et cache offline              |
| **CSS3**            | Styles personnalisés responsive                   |
| **GitHub Pages**    | Hébergement statique gratuit                      |
| **gh-pages**        | Déploiement automatisé                            |

## 📱 PWA (Progressive Web App)

L'application peut être **installée** sur ton appareil (mobile ou desktop) pour :

- Un accès rapide depuis l'écran d'accueil
- Une utilisation hors-ligne
- Une expérience native sans navigateur visible

## 🚀 Installation & Démarrage

```bash
# Cloner le projet
git clone https://github.com/yanisdjr38/effetmer-bjj.git

# Accéder au dossier de l'application
cd effetmer-bjj/my-app

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 📦 Déploiement

```bash
# Build de production et déploiement sur GitHub Pages
npm run deploy
```

## 🌐 Démo en ligne

👉 [https://yanisdjr38.github.io/effetmer-bjj](https://yanisdjr38.github.io/effetmer-bjj)

## 📁 Structure du projet

```
my-app/
├── public/              # Fichiers statiques (index.html, manifest.json)
├── src/
│   ├── assets/          # Images (logo) et sons (beep)
│   ├── components/      # Composants réutilisables
│   │   ├── InstallPrompt.js   # Prompt d'installation PWA
│   │   ├── NavBar.js          # Barre de navigation
│   │   ├── ProgressCircle.js  # Cercle de progression
│   │   ├── StatCard.js        # Carte de statistique
│   │   └── TrainingForm.js    # Formulaire d'entraînement
│   ├── data/            # Données JSON (techniques de base)
│   ├── pages/           # Pages de l'application
│   │   ├── HomePage.js        # Dashboard principal
│   │   ├── TechniquesPage.js  # Bibliothèque de techniques
│   │   ├── TimerPage.js       # Timer d'entraînement
│   │   └── TrainingPage.js    # Suivi d'entraînement
│   ├── App.js           # Composant racine avec routing
│   ├── index.js         # Point d'entrée React
│   ├── styles.css       # Styles globaux
│   └── serviceWorkerRegistration.js  # Config PWA
└── build/               # Build de production
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésite pas à :

- Ouvrir une **issue** pour signaler un bug ou proposer une idée
- Soumettre une **pull request** pour améliorer le code

## 👤 Auteur

Développé par **yanisdjr38**

## 📄 Licence

Ce projet est open source.

---

_Développé avec passion pour la communauté JJB_ 🥋
_OSS! 🤙_
