const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

let jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  console.warn('⚠️  JWT_SECRET n\'est pas défini dans le fichier .env');
  console.log('\n📝 Génération d\'un JWT_SECRET aléatoire...\n');
  
  // Générer un secret aléatoire sécurisé
  jwtSecret = crypto.randomBytes(64).toString('hex');
  
  console.log('✅ JWT_SECRET généré automatiquement :\n');
  console.log(`JWT_SECRET=${jwtSecret}\n`);
  console.log('⚠️  IMPORTANT : Ajoutez cette ligne dans votre fichier .env backend !\n');
  console.log('─'.repeat(60) + '\n');
}

// Générer un token JWT valide
// Vous pouvez personnaliser le payload (username, etc.)
const payload = {
  username: 'admin', // Changez selon vos besoins
  // Vous pouvez ajouter d'autres champs ici
};

// Générer le token avec une expiration de 1 an (ou plus)
const token = jwt.sign(payload, jwtSecret, { expiresIn: '365d' });

console.log('\n✅ Token JWT généré avec succès !\n');
console.log('📋 Ajoutez cette ligne dans votre fichier .env du frontend (newStudAdmin-react/.env) :\n');
console.log(`VITE_JWT_TOKEN=${token}\n`);
console.log('⚠️  Note: Redémarrez le serveur de développement après avoir ajouté cette variable.\n');

