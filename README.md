# EventSync

Application de gestion d’événements avec panneau d’administration (React Admin) et interface utilisateur (Next.js).

---

## 🚀 Stack

- Next.js (App Router)
- React Admin
- Prisma ORM
- PostgreSQL
- JWT Authentication

---

## ⚙️ Installation du projet

### 1. Cloner le projet

- git clone https://github.com/M-B-O-T/EventSync.git
- cd EventSync

### 2. Installer les dépendances
- npm install

### 3. Configurer les variables d’environnement

- Créer un fichier .env :

- DATABASE_URL="postgresql://user:password@localhost:5432/eventsync"
- JWT_SECRET="super_secret_key"

### 4. Créer la base de données PostgreSQL

Avant de lancer Prisma, il faut créer une base de données nommée :

- eventsync

### 5. Base de données Prisma
- npx prisma generate
- npx prisma migrate dev

### 6. Créer une donnée de test (IMPORTANT)

**Créer une donnée de test && une compte admin via seed :**
- npx prisma db seed

## 🧑‍💻 Lancer le projet

- npm run dev

## 🔐 Accès admin
Connexion via login admin uniquement

### ⚠️ Le register est désactivé pour des raisons de sécurité.


# N.B: Compte Admin par défaut:
- --------------------------------------
- Admin Email: admin@eventsync.com
- Admin Password: admin123
---------------------------------------