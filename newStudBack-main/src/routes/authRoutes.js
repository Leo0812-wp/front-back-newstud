// routes/authRoutes.js
const express = require('express');
const AuthController = require('../controllers/AuthController');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();
const authController = new AuthController();

//with token
/**
 * 
 * /**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Pour créer un compte
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Le nom de connexion.
 *               password:
 *                 type: string
 *                 description: Le mot de passe.
 *             required:
 *               - username
 *               - password
 */
router.post('/register', verifyToken, authController.register);

//without token
/**
 * 
 * /**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Pour se connecter.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Le nom de connexion.
 *               password:
 *                 type: string
 *                 description: Le mot de passe.
 *             required:
 *               - username
 *               - password
 */
router.post('/login', authController.login);
router.get('/me', verifyToken, authController.me);
router.post('/logout', authController.logout);

module.exports = router;
