const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const verifyToken = require('../middleware/verifyToken');

const userController = new UserController();


//with token
/**
 * 
 * /**
 * @openapi
 * /api/user/create:
 *   post:
 *     summary: Pour créer un user
 *     tags:
 *       - Gestion utilisateur
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
router.post('/user/create', userController.createUser.bind(userController));

//with token
/**
 * 
 * /**
 * @openapi
 * /api/user:
 *   get:
 *     summary: Récupérer la liste de tout les users
 *     tags:
 *       - Gestion utilisateur
 *     security:
 *       - bearerAuth: []
 */
router.get('/user', verifyToken, userController.getAllUsers.bind(userController));


module.exports = router;
