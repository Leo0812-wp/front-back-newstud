# 🔐 Configuration du Token JWT pour l'Admin

## Problème : Erreur 401 (Unauthorized)

Si vous voyez l'erreur `401 (Unauthorized)` lors de la création d'entreprise/produit, c'est que le token JWT n'est pas configuré ou invalide.

## Solution : Générer un token JWT

### Étape 1 : Générer le token

Dans le dossier `newStudBack-main`, exécutez :

```bash
node scripts/generateToken.js
```

Ce script va :
- Lire le `JWT_SECRET` depuis votre `.env` backend
- Générer un token JWT valide
- Afficher la ligne à ajouter dans votre `.env` frontend

### Étape 2 : Ajouter le token dans le .env du frontend

Créez ou modifiez le fichier `.env` dans `newStudAdmin-react/` :

```env
VITE_JWT_TOKEN=votre_token_généré_ici
```

### Étape 3 : Redémarrer le serveur frontend

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis redémarrez-le
npm run dev
```

## Vérification

1. Ouvrez la console du navigateur (F12)
2. Vous devriez voir : `✅ Token d'authentification trouvé dans les variables d'environnement`
3. Si vous voyez un avertissement, le token n'est pas chargé

## Alternative : Obtenir un token via login

Si vous préférez obtenir un token via l'API de login :

```bash
curl -X POST http://localhost:3500/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "votre_username", "password": "votre_password"}'
```

La réponse contiendra un `token` que vous pouvez utiliser.

## Structure des fichiers

- **Backend** : `newStudBack-main/.env` → doit contenir `JWT_SECRET`
- **Frontend** : `newStudAdmin-react/.env` → doit contenir `VITE_JWT_TOKEN`

## Notes importantes

- Le token généré par le script expire dans 365 jours
- Le token doit être un JWT valide signé avec le même `JWT_SECRET` que le backend
- Les variables d'environnement Vite doivent commencer par `VITE_` pour être accessibles côté client
- Redémarrez toujours le serveur de développement après modification du `.env`

