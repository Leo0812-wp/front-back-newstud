# NewStud Admin - Interface d'administration React

Interface d'administration moderne pour gérer les promos (vouchers) de NewStud, construite avec React, TypeScript et Tailwind CSS.

## 🚀 Fonctionnalités

- **Tableau de bord** : Vue d'ensemble des statistiques (produits, entreprises)
- **Gestion des produits** : Visualisation de tous les produits avec leurs détails
- **Gestion des entreprises** : Liste complète des entreprises partenaires
- **Création de promos** : Formulaire complet pour créer de nouvelles promos (vouchers)
- **Interface moderne** : Design responsive avec Tailwind CSS

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn
- Le backend NewStud doit être en cours d'exécution sur le port 3500 (ou configurer l'URL dans `.env`)

## 🛠️ Installation

1. Installer les dépendances :
```bash
npm install
```

2. Créer un fichier `.env` à la racine du projet :
```env
VITE_API_URL=http://localhost:3500/api
```

3. Démarrer l'application en mode développement :
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

4. Pour construire l'application pour la production :
```bash
npm run build
```

5. Pour prévisualiser la version de production :
```bash
npm run preview
```

## 📁 Structure du projet

```
src/
├── components/          # Composants React (TSX)
│   ├── Dashboard.tsx
│   ├── ProductsList.tsx
│   ├── CompaniesList.tsx
│   ├── VouchersList.tsx
│   └── CreateVoucher.tsx
├── services/            # Services API
│   └── api.ts
├── types/              # Types TypeScript
│   └── index.ts
├── App.tsx             # Composant principal
└── index.tsx           # Point d'entrée
```

## 🎨 Technologies utilisées

- **React 18** : Bibliothèque UI
- **TypeScript 5** : Typage statique
- **Vite** : Build tool moderne et rapide
- **Tailwind CSS** : Framework CSS utilitaire
- **React Router** : Navigation
- **Axios** : Client HTTP

## 📝 Structure des données

### Voucher (Promo)
- `productId` : ID du produit associé
- `companyId` : ID de l'entreprise
- `activationTime` : Heure d'activation (format HH:MM)
- `desactivationTime` : Heure de désactivation (format HH:MM)
- `dayOfWeek` : Jour de la semaine (lundi, mardi, etc.)
- `nbUtilisation` : Nombre de vouchers à générer (1-3)

## 🔧 Configuration

L'URL de l'API peut être configurée via la variable d'environnement `VITE_API_URL`. Par défaut, elle pointe vers `http://localhost:3500/api`.

**Note :** Avec Vite, toutes les variables d'environnement doivent être préfixées par `VITE_` pour être accessibles dans le code client.

## 📦 Build de production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

## ⚡ Avantages de Vite

- **Démarrage ultra-rapide** : HMR (Hot Module Replacement) instantané
- **Build optimisé** : Utilise Rollup pour des bundles optimisés
- **Support TypeScript natif** : Pas de configuration supplémentaire nécessaire
- **Compatibilité moderne** : Supporte les dernières fonctionnalités ES modules

