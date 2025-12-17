# 🏭 Gestion de Stock Atlas Manufacturing

Application complète de gestion de stock pour entreprise industrielle développée avec React/Redux.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

## 📋 Fonctionnalités

- ✅ **Gestion complète des articles** (CRUD)
- ✅ **Suivi des mouvements** (entrées/sorties)
- ✅ **Tableau de bord avec KPI en temps réel**
- ✅ **Alertes stock automatiques**
- ✅ **Statistiques et graphiques avancés**
- ✅ **Interface responsive et moderne**
- ✅ **Validation des formulaires**
- ✅ **API mock avec Node.js**

## 🚀 Technologies Utilisées

### Frontend
- **React 18** - Bibliothèque UI
- **Redux Toolkit** - Gestion d'état
- **React Router 6** - Navigation
- **Bootstrap 5** - Framework CSS
- **Recharts** - Graphiques
- **Formik/Yup** - Formulaires & validation

### Backend (Mock API)
- **Node.js** - Serveur API
- **JSON Server** - Base de données simulée

## 📁 Structure du Projet
gestion-stock-atlas/
├── public/ # Fichiers statiques
├── src/ # Code source React
│ ├── app/ # Configuration Redux
│ ├── components/ # Composants réutilisables
│ ├── features/ # Slices Redux
│ ├── pages/ # Pages de l'application
│ └── utils/ # Utilitaires
├── server/ # API serveur Node.js
└── docs/ # Documentation

## 🛠️ Installation et Lancement

### Prérequis
- Node.js (v14+)
- npm ou yarn

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/gestion-stock-atlas.git
cd gestion-stock-atlas

### 2. Installer les dépendances
```bash
npm install

### 3. Démarrer le serveur API
```bash
node server/server.js

### 4. Démarrer l'application React (dans un nouveau terminal)
```bash
npm start
Ou utiliser le script de développement (recommendé)
```bash
npm run dev
L'application sera disponible à l'adresse: http://localhost:3000
L'API sera disponible à l'adresse: http://localhost:5000

🧪 Scripts Disponibles
npm start - Lance l'application React

npm run server - Lance le serveur API

npm run dev - Lance les deux simultanément

npm run build - Crée une build de production

npm test - Lance les tests

npm run eject - Ejecte la configuration

📊 Base de Données
L'application utilise db.json comme base de données simulée avec les collections:

articles - Liste des articles en stock

mouvements - Historique des mouvements

🔗 Routes API
Articles
GET /articles - Liste tous les articles

GET /articles/:id - Récupère un article

POST /articles - Crée un nouvel article

PUT /articles/:id - Met à jour un article

DELETE /articles/:id - Supprime un article

Mouvements
GET /mouvements - Liste tous les mouvements

POST /mouvements - Crée un nouveau mouvement

DELETE /mouvements/:id - Supprime un mouvement

🎨 Interface
Pages principales
Landing Page - Page d'accueil avec présentation

Dashboard - Tableau de bord avec statistiques

Articles - Liste et gestion des articles

Mouvements - Historique des entrées/sorties

Formulaire Article - Ajout/édition d'articles

Formulaire Mouvement - Création de mouvements

👥 Équipe de Développement
Mohamed Mouad Moukrim - UI/UX Designer

Souhail Bahoujabour - Backend Developer