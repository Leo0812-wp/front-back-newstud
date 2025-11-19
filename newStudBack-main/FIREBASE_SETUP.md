# Configuration Firebase Admin - Guide Complet

## 📁 Structure des fichiers créés

### 1. **`src/config/firebase.js`**
   - **Rôle** : Initialisation centralisée de Firebase Admin
   - **Contenu** :
     - Import de `firebase-admin`
     - Chargement de `dotenv`
     - Reconstruction du service account depuis les variables d'environnement
     - Initialisation de Firebase Admin (avec protection contre double initialisation)
     - Export de l'instance `admin` et du `serviceAccount`

### 2. **`src/utils/firebaseAuth.js`**
   - **Rôle** : Fonctions utilitaires pour l'authentification Firebase
   - **Fonctions** :
     - `createCustomToken(uid)` : Crée un custom token pour un utilisateur
     - `getGoogleAccessToken()` : Obtient un access token Google OAuth2

### 3. **`src/routes/firebaseTestRoutes.js`**
   - **Rôle** : Routes de test pour vérifier le fonctionnement de Firebase
   - **Routes** :
     - `POST /api/test-firebase` : Test de création de document Firestore
     - `POST /api/test-custom-token` : Test de création de custom token
     - `GET /api/test-access-token` : Test de récupération d'access token

### 4. **`app.js`** (modifié)
   - **Changement** : Remplacement de l'initialisation Firebase par un simple `require('./src/config/firebase')`
   - **Ajout** : Import de `firebaseTestRoutes` et ajout de la route `/api`

---

## 🚀 Utilisation

### Utiliser Firebase Admin dans vos controllers

```javascript
// Dans n'importe quel controller
const admin = require('../config/firebase');

// Accéder à Firestore
const db = admin.firestore();
const docRef = await db.collection('maCollection').add({ data: 'value' });

// Accéder à Firebase Auth
const user = await admin.auth().getUser(uid);

// Accéder à Firebase Storage
const bucket = admin.storage().bucket();
```

### Créer un custom token

```javascript
const { createCustomToken } = require('../utils/firebaseAuth');

// Dans une route
const customToken = await createCustomToken('user-123');
res.json({ token: customToken });
```

### Obtenir un access token Google

```javascript
const { getGoogleAccessToken } = require('../utils/firebaseAuth');

// Dans une route
const tokenData = await getGoogleAccessToken();
console.log('Access Token:', tokenData.access_token);
console.log('Expires in:', tokenData.expires_in, 'seconds');
```

---

## 🧪 Tests des routes

### 1. Test Firestore
```bash
curl -X POST http://localhost:3500/api/test-firebase
```

**Réponse attendue** :
```json
{
  "success": true,
  "message": "Document créé avec succès",
  "documentId": "abc123...",
  "data": {
    "message": "hello",
    "date": "2024-01-01T12:00:00.000Z"
  }
}
```

### 2. Test Custom Token
```bash
curl -X POST http://localhost:3500/api/test-custom-token \
  -H "Content-Type: application/json" \
  -d '{"uid": "user-123"}'
```

**Réponse attendue** :
```json
{
  "success": true,
  "uid": "user-123",
  "customToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Test Access Token
```bash
curl http://localhost:3500/api/test-access-token
```

**Réponse attendue** :
```json
{
  "success": true,
  "access_token": "ya29.c.b0Aaek...",
  "expires_in": 3600,
  "expires_at": "2024-01-01T13:00:00.000Z"
}
```

---

## ✅ Vérifications

### Vérifier que Firebase est bien initialisé

Au démarrage du serveur, vous devriez voir :
```
✅ Firebase Admin initialisé avec succès
Serveur Node.js en cours d'exécution sur 0.0.0.0:3500
```

### Vérifier les collections Firestore

Dans `app.js`, il y a déjà un code qui liste les collections au démarrage :
```javascript
const db = admin.firestore();
db.listCollections().then((collections) => {
  console.log('Collections:', collections);
});
```

---

## 📝 Notes importantes

1. **Double initialisation** : Le fichier `firebase.js` vérifie si Firebase est déjà initialisé pour éviter les erreurs de double initialisation.

2. **Variables d'environnement** : Assurez-vous que votre fichier `.env` contient toutes les variables nécessaires :
   - `FIREBASE_TYPE`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`
   - etc.

3. **Private Key** : La clé privée est automatiquement traitée avec `.replace(/\\n/g, '\n')` pour gérer les retours à la ligne.

4. **Firestore** : Une fois Firebase Admin initialisé, vous pouvez utiliser Firestore directement depuis n'importe quel fichier en important `admin` depuis `src/config/firebase.js`.

---

## 🔧 Dépannage

### Erreur : "Firebase App already initialized"
- **Cause** : Firebase est initialisé deux fois
- **Solution** : Le fichier `firebase.js` gère déjà cela avec `if (!admin.apps.length)`

### Erreur : "Invalid service account"
- **Cause** : Variables d'environnement manquantes ou incorrectes
- **Solution** : Vérifiez votre fichier `.env`

### Erreur : "Permission denied"
- **Cause** : Le service account n'a pas les bonnes permissions
- **Solution** : Vérifiez les rôles IAM dans la console Firebase

---

## 📚 Ressources

- [Documentation Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Documentation Firestore](https://firebase.google.com/docs/firestore)
- [Documentation Firebase Auth](https://firebase.google.com/docs/auth/admin)

