# API Port de plaisance de Russell

API pour gérer les catways, les réservations et les utilisateurs du port de plaisance de Russell.  
Le projet est développé avec **Node.js**, **Express**, **MongoDB** et utilise **JWT** pour l’authentification.

## Prérequis
- Node.js >= 18
- npm
- MongoDB (local ou cluster Atlas)
- Git (pour cloner le dépôt)

## Installation

### 1. Cloner le projet :

```bash
git clone https://github.com/guillaumebertil/port-russell-api
cd port-russell-api
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Copier le fichier exemple :
```bash
cp ./env/env.example .env
```

### 4. Remplir les valeurs
```bash
PORT=3000
URL_MONGO=mongodb+srv://username:password@cluster.mongodb.net/database?appName=cluster
NODE_ENV=production
SECRET_KEY=votre_cle_secrete
```

### 5. Lancer le projet
```bash
npm install
npm run dev
```

Le serveur sera disponible sur http://localhost:3000.

### En production (Render)

- Assurez-vous que les variables d’environnement sont bien configurées sur Render.

- Le serveur démarrera automatiquement via npm start.

### Routes
API REST (JSON) – Protégées par JWT

- /api/users – gestion des utilisateurs

- /api/catways – gestion des catways

- /api/reservations – gestion des réservations

### Interface Web (EJS)

- /users, /catways, /reservations – accès via cookie/session

## Documentation API (Swagger)
La documentation est disponible à l'URL
```bash
/api/docs
```
Elle décrit toutes les routes, paramètres et modèles JSON (User, Catway, Reservation).

### Authentification

- Routes /api : JWT dans l’en-tête Authorization: Bearer <token>.

- Pages Web : authentification via cookie token.
