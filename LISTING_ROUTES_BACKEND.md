# Listing des Routes Backend - NewStud API

## 📋 Vue d'ensemble

**Base URL** : `/api` (sauf routes d'authentification : `/auth`)  
**Port** : 3500 (par défaut)  
**Documentation Swagger** : `/api-docs`

---

## 🔐 Routes d'Authentification (`/auth`)

### POST `/auth/register`
- **Description** : Créer un compte utilisateur
- **Authentification** : Requise (Bearer Token)
- **Body** :
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Retour** : Compte utilisateur créé

### POST `/auth/login`
- **Description** : Se connecter
- **Authentification** : Non requise
- **Body** :
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Retour** : Token d'authentification

---

## 🏢 Routes des Entreprises (`/api/company`)

### GET `/api/company`
- **Description** : Récupère la liste de toutes les entreprises
- **Authentification** : Non requise
- **Retour** : Liste d'entreprises avec :
  - `id` : Identifiant de l'entreprise
  - `name` : Nom de l'entreprise
  - `description` : Description
  - `category` : ID de la catégorie
  - `place` : Emplacement
  - `urlImage` : URL de l'image Firebase

### GET `/api/company/:id`
- **Description** : Récupère une entreprise par son identifiant
- **Authentification** : Non requise
- **Paramètres** :
  - `id` (path) : Identifiant de l'entreprise
- **Retour** : Détails de l'entreprise

### GET `/api/company/category/:category`
- **Description** : Récupère des entreprises par catégorie
- **Authentification** : Non requise
- **Paramètres** :
  - `category` (path) : ID de la catégorie
- **Retour** : Liste d'entreprises filtrées par catégorie

### POST `/api/company/create`
- **Description** : Créer une nouvelle entreprise
- **Authentification** : Requise (Bearer Token)
- **Body** :
  ```json
  {
    "description": "string",
    "category": "string",  // ID de la companyCategory
    "name": "string",
    "place": "string",
    "urlImage": "string"    // URL Firebase (optionnel, défaut: noImage)
  }
  ```
- **Retour** : Entreprise créée

### DELETE `/api/company/:id`
- **Description** : Supprimer une entreprise
- **Authentification** : Requise (Bearer Token)
- **Paramètres** :
  - `id` (path) : Identifiant de l'entreprise à supprimer
- **Retour** : Confirmation de suppression

### POST `/api/update/company/:id`
- **Description** : Modifier une entreprise
- **Authentification** : Requise (Bearer Token)
- **Paramètres** :
  - `id` (path) : Identifiant de l'entreprise à modifier
- **Body** : Même structure que la création
- **Retour** : Entreprise mise à jour

### POST `/api/company/addToFavorite`
- **Description** : Ajouter une entreprise aux favoris d'un utilisateur
- **Authentification** : Non requise
- **Body** :
  ```json
  {
    "companyId": "string",
    "userId": "string"
  }
  ```
- **Retour** :
  - `200` : Succès (ajout ou retrait si déjà en favoris)
  - `400` : Déjà dans les favoris
  - `404` : Utilisateur ou entreprise non trouvé

### GET `/api/company/getFavorites/:id`
- **Description** : Récupère la liste des favoris selon l'ID de l'utilisateur
- **Authentification** : Non requise
- **Paramètres** :
  - `id` (path) : Identifiant de l'utilisateur
- **Retour** : Liste des entreprises favorites

---

## 📦 Routes des Produits (`/api/products`)

### GET `/api/products`
- **Description** : Récupère la liste de tous les produits
- **Authentification** : Non requise
- **Retour** : Liste de produits avec :
  - `id` : Identifiant du produit
  - `name` : Nom du produit
  - `description` : Description
  - `priceInit` : Prix initial
  - `priceFinal` : Prix final
  - `promotion` : Réduction appliquée
  - `companyId` : ID de l'entreprise
  - `usable` : Nombre d'utilisations par jour
  - `urlImageCompanyPage` : URL image pour page entreprise
  - `urlImageProductPage` : Tableau d'URLs d'images pour page produit

### GET `/api/products/:id`
- **Description** : Récupère un produit par son identifiant
- **Authentification** : Non requise
- **Paramètres** :
  - `id` (path) : Identifiant du produit
- **Retour** : Détails du produit

### GET `/api/products/category/:category`
- **Description** : Récupère des produits par catégorie
- **Authentification** : Non requise
- **Paramètres** :
  - `category` (path) : ID de la catégorie
- **Retour** : Liste de produits filtrés par catégorie

### GET `/api/products/company/:companyId`
- **Description** : Récupère tous les produits d'une entreprise
- **Authentification** : Non requise
- **Paramètres** :
  - `companyId` (path) : Identifiant de l'entreprise
- **Retour** : Liste de produits de l'entreprise

### POST `/api/products/create`
- **Description** : Créer un nouveau produit
- **Authentification** : Requise (Bearer Token)
- **Body** :
  ```json
  {
    "priceInit": "string",
    "priceFinal": "string",
    "promotion": "string",
    "name": "string",
    "description": "string",
    "companyId": "string",
    "usable": "int",
    "urlImageCompanyPage": "string",
    "urlImageProductPage": ["string"]  // Tableau d'URLs
  }
  ```
- **Retour** : Produit créé

### DELETE `/api/products/:id`
- **Description** : Supprimer un produit
- **Authentification** : Requise (Bearer Token)
- **Paramètres** :
  - `id` (path) : Identifiant du produit à supprimer
- **Retour** : Confirmation de suppression

### POST `/api/update/products/:id`
- **Description** : Modifier un produit
- **Authentification** : Requise (Bearer Token)
- **Paramètres** :
  - `id` (path) : Identifiant du produit à modifier
- **Body** : Même structure que la création
- **Retour** : Produit mis à jour

---

## 🎫 Routes des Coupons/Vouchers (`/api/vouchers`)

### GET `/api/vouchers`
- **Description** : Récupère la liste de tous les vouchers
- **Authentification** : Non requise
- **Retour** : Liste de vouchers avec :
  - `id` : Identifiant du voucher
  - `productId` : ID du produit associé
  - `companyId` : ID de l'entreprise
  - `activationTime` : Heure d'activation
  - `desactivationTime` : Heure de fin
  - `dayOfWeek` : Jour d'utilisation
  - `nbUtilisation` : Nombre d'utilisations possibles

### GET `/api/vouchers/:id`
- **Description** : Récupère un voucher par son identifiant
- **Authentification** : Non requise
- **Paramètres** :
  - `id` (path) : Identifiant du voucher
- **Retour** : Détails du voucher

### POST `/api/vouchers/create`
- **Description** : Créer un coupon de réduction
- **Authentification** : Non requise
- **Body** :
  ```json
  {
    "productId": "string",
    "companyId": "string",
    "activationTime": "string",
    "desactivationTime": "string",
    "dayOfWeek": "string",
    "nbUtilisation": "int"
  }
  ```
- **Retour** : Voucher créé

### POST `/api/vouchers/askVouchers`
- **Description** : Demander un coupon de réduction disponible pour un utilisateur
- **Authentification** : Non requise
- **Body** :
  ```json
  {
    "productId": "string",
    "userId": "string"
  }
  ```
- **Retour** :
  - `200` : Succès avec `voucherValue` (valeur du coupon)
  - `400` : Paramètres manquants
  - `404` : Aucun coupon disponible
  - `500` : Erreur serveur

### POST `/api/vouchers/useVouchers`
- **Description** : Utiliser un voucher (écriture sur le document utilisateur)
- **Authentification** : Non requise
- **Body** :
  ```json
  {
    "userId": "string",
    "voucherId": "string"
  }
  ```
- **Retour** :
  - `200` : Voucher utilisé avec succès
  - `400` : Requête invalide
  - `404` : Utilisateur non trouvé
  - `500` : Erreur serveur

### PUT `/api/vouchers/:id`
- **Description** : Met à jour un voucher
- **Authentification** : Non requise
- **Paramètres** :
  - `id` (path) : Identifiant du voucher à modifier
- **Body** : Même structure que la création
- **Retour** : Voucher mis à jour

### DELETE `/api/vouchers/:id`
- **Description** : Supprime un voucher
- **Authentification** : Non requise
- **Paramètres** :
  - `id` (path) : Identifiant du voucher à supprimer
- **Retour** : Confirmation de suppression

---

## 🏷️ Routes des Catégories d'Entreprises (`/api/companyCategory`)

### GET `/api/companyCategory`
- **Description** : Récupère la liste de toutes les catégories d'entreprises
- **Authentification** : Non requise
- **Retour** : Liste de catégories avec :
  - `id` : Identifiant de la catégorie
  - `name` : Nom de la catégorie
  - Autres propriétés selon le modèle

---

## 🏷️ Routes des Catégories de Produits (`/api/productCategory`)

### GET `/api/productCategory`
- **Description** : Récupère la liste de toutes les catégories de produits
- **Authentification** : Non requise
- **Retour** : Liste de catégories avec :
  - `id` : Identifiant de la catégorie
  - `name` : Nom de la catégorie
  - Autres propriétés selon le modèle

---

## ⭐ Routes des Mises en Avant (`/api/highlight`)

### GET `/api/highlight`
- **Description** : Récupère le produit mis en avant
- **Authentification** : Non requise
- **Retour** : Produit mis en avant avec toutes ses propriétés

### POST `/api/highlight/:id`
- **Description** : Mettre en avant un produit
- **Authentification** : Non requise
- **Paramètres** :
  - `id` (path) : Identifiant du produit à mettre en avant
- **Retour** : Confirmation de mise en avant

---

## 👤 Routes des Utilisateurs (`/api/user`)

### GET `/api/user`
- **Description** : Récupérer la liste de tous les utilisateurs
- **Authentification** : Requise (Bearer Token)
- **Retour** : Liste d'utilisateurs avec :
  - `id` : Identifiant de l'utilisateur
  - `username` : Nom d'utilisateur
  - Autres propriétés selon le modèle

### POST `/api/user/create`
- **Description** : Créer un utilisateur
- **Authentification** : Non requise (contradiction dans le code)
- **Body** :
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Retour** : Utilisateur créé

---

## 📊 Résumé des Données Retournées

### Structure des Entreprises
- Identifiant unique
- Nom, description, emplacement
- Catégorie (référence)
- Image (URL Firebase)
- Favoris (liste d'utilisateurs)

### Structure des Produits
- Identifiant unique
- Nom, description
- Prix (initial, final, promotion)
- Entreprise associée
- Catégorie
- Images multiples (URLs Firebase)
- Limite d'utilisation par jour

### Structure des Vouchers
- Identifiant unique
- Produit et entreprise associés
- Horaires d'activation/désactivation
- Jour de la semaine
- Nombre d'utilisations disponibles
- Utilisateurs ayant utilisé le voucher

### Structure des Utilisateurs
- Identifiant unique (Firebase UID)
- Nom d'utilisateur
- Mot de passe (hashé)
- Liste de favoris (entreprises)
- Liste de vouchers utilisés

---

## 🔒 Authentification

- **Méthode** : Bearer Token (JWT via Firebase)
- **Middleware** : `verifyToken` (défini dans `/src/middleware/verifyToken`)
- **Routes protégées** : Création, modification, suppression (sauf exceptions notées)

---

## 📝 Notes

- Toutes les images sont stockées sur Firebase Storage
- Les IDs sont généralement des identifiants Firestore
- Les routes peuvent retourner des erreurs 400, 404, 500 selon les cas
- La documentation Swagger est disponible sur `/api-docs`

