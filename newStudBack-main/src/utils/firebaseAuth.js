const admin = require('../config/firebase');
const { serviceAccount } = require('../config/firebase');

/**
 * Crée un custom token Firebase pour un utilisateur
 * @param {string} uid - L'identifiant unique de l'utilisateur
 * @returns {Promise<string>} Le custom token
 */
async function createCustomToken(uid) {
  try {
    const customToken = await admin.auth().createCustomToken(uid);
    return customToken;
  } catch (error) {
    console.error('Erreur lors de la création du custom token:', error);
    throw error;
  }
}

/**
 * Obtient un access token Google OAuth2
 * @returns {Promise<{access_token: string, expires_in: number}>}
 */
async function getGoogleAccessToken() {
  try {
    const credential = admin.credential.cert(serviceAccount);
    const accessTokenResponse = await credential.getAccessToken();
    
    return {
      access_token: accessTokenResponse.access_token,
      expires_in: accessTokenResponse.expires_in || 3600,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du access token:', error);
    throw error;
  }
}

module.exports = {
  createCustomToken,
  getGoogleAccessToken,
};

