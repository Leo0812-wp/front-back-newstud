const express = require('express');
const router = express.Router();
const admin = require('../config/firebase');
const { createCustomToken, getGoogleAccessToken } = require('../utils/firebaseAuth');

/**
 * @openapi
 * /api/test-firebase:
 *   post:
 *     summary: Test de connexion Firebase Firestore
 *     tags:
 *       - Firebase Test
 *     responses:
 *       '200':
 *         description: Document créé avec succès
 */
router.post('/test-firebase', async (req, res) => {
  try {
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();
    
    // Création d'un document de test dans Firestore
    const docRef = await db.collection('test').add({
      message: 'hello',
      date: now,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Document créé avec succès',
      documentId: docRef.id,
      data: {
        message: 'hello',
        date: now.toDate().toISOString(),
      },
    });
  } catch (error) {
    console.error('Erreur lors du test Firebase:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @openapi
 * /api/test-custom-token:
 *   post:
 *     summary: Test de création d'un custom token
 *     tags:
 *       - Firebase Test
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *                 description: L'identifiant unique de l'utilisateur
 *             required:
 *               - uid
 */
router.post('/test-custom-token', async (req, res) => {
  try {
    const { uid } = req.body;
    
    if (!uid) {
      return res.status(400).json({
        success: false,
        error: 'Le paramètre uid est requis',
      });
    }

    const customToken = await createCustomToken(uid);
    
    res.status(200).json({
      success: true,
      uid: uid,
      customToken: customToken,
    });
  } catch (error) {
    console.error('Erreur lors de la création du custom token:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @openapi
 * /api/test-access-token:
 *   get:
 *     summary: Test de récupération d'un access token Google
 *     tags:
 *       - Firebase Test
 */
router.get('/test-access-token', async (req, res) => {
  try {
    const tokenData = await getGoogleAccessToken();
    
    res.status(200).json({
      success: true,
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
      expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du access token:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @openapi
 * /api/db4:
 *   get:
 *     summary: Récupère toutes les collections Firebase et leurs documents
 *     tags:
 *       - Firebase Test
 *     responses:
 *       '200':
 *         description: Liste de toutes les collections avec leurs documents
 */
router.get('/db4', async (req, res) => {
  try {
    const db = admin.firestore();
    const collections = await db.listCollections();
    const result = {};

    // Parcourir chaque collection
    for (const collectionRef of collections) {
      const collectionName = collectionRef.id;
      const snapshot = await collectionRef.get();
      const documents = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        // Convertir les Timestamps en chaînes de caractères pour la sérialisation JSON
        const processedData = {};
        for (const [key, value] of Object.entries(data)) {
          if (value && typeof value.toDate === 'function') {
            processedData[key] = value.toDate().toISOString();
          } else if (value && typeof value === 'object' && value.constructor?.name === 'Timestamp') {
            processedData[key] = value.toDate().toISOString();
          } else {
            processedData[key] = value;
          }
        }
        documents.push({
          id: doc.id,
          data: processedData,
        });
      });

      result[collectionName] = {
        count: documents.length,
        documents: documents,
      };
    }

    res.status(200).json({
      success: true,
      collections: result,
      totalCollections: Object.keys(result).length,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des collections:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

