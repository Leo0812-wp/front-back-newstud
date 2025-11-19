const { Storage } = require('@google-cloud/storage');
require('dotenv').config();

// Configuration du service account depuis les variables d'environnement
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

// Initialisation du client Storage
const storage = new Storage({
  projectId: process.env.FIREBASE_PROJECT_ID,
  credentials: serviceAccount,
});

// Configuration CORS
const corsConfig = [
  {
    origin: ['*'],
    method: ['GET', 'HEAD', 'OPTIONS'],
    responseHeader: [
      'Content-Type',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Headers',
    ],
    maxAgeSeconds: 3600,
  },
];

async function configureCors() {
  try {
    const bucketName = `${process.env.FIREBASE_PROJECT_ID}.appspot.com`;
    const bucket = storage.bucket(bucketName);

    console.log(`Configuration CORS pour le bucket: ${bucketName}`);

    await bucket.setCorsConfiguration(corsConfig);
    
    console.log('✅ Configuration CORS appliquée avec succès !');
    console.log('Les images Firebase Storage devraient maintenant être accessibles depuis localhost.');
  } catch (error) {
    console.error('❌ Erreur lors de la configuration CORS:', error);
    process.exit(1);
  }
}

configureCors();

