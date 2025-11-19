const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/CompanyController');
const verifyToken = require('../middleware/verifyToken');

const companyController = new CompanyController();

//without token

/**
 * @openapi
 * /api/company:
 *   get:
 *     summary: Récupère la liste de toutes les entreprises.
 *     tags:
 *       - Company
 */
router.get('/company', companyController.getAllCompany.bind(companyController));

/**
 * @openapi
 * /api/company/{id}:
 *   get:
 *     summary: Récupère une entreprise par son identifiant.
 *     tags:
 *       - Company
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'identifiant de l'entreprise.
 *         schema:
 *           type: string
 */

router.get('/company/:id', companyController.getCompanyById.bind(companyController));

/**
 * @openapi
 * /api/company/category/{category}:
 *   get:
 *     summary: Récupère des entreprises par sa category.
 *     tags:
 *       - Company
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         description: La category de l'entreprise.
 *         schema:
 *           type: string
 */
router.get('/company/category/:category', companyController.getCompanyByCategory.bind(companyController));

/**
 * 
 * /**
 * @openapi
 * /api/company/create:
 *   post:
 *     summary: Créer une nouvelle entreprise.
 *     tags:
 *       - Company
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: La description de l'entreprise.
 *               category:
 *                 type: string
 *                 description: Id de la companyCategory
 *               name:
 *                 type: string
 *                 description: Le nom de l'entreprise.
 *               place:
 *                 type: string
 *                 description: L'emplacement de l'entreprise.
 *               urlImage:
 *                 type: string
 *                 description: url firebase de l'image de la company (rien de renseigner, image noImage)
 *             required:
 *               - description
 *               - category
 *               - name
 *               - place 
 */
router.post('/company/create', verifyToken, companyController.createCompany.bind(companyController));

//with token
/**
 * @openapi
 * /api/company/{id}:
 *   delete:
 *     summary: Supprimer une company.
 *     tags:
 *       - Company
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: L'identifiant du company à supprimer.
 *         required: true
 *         schema:
 *           type: string       
 */
router.delete('/company/:id', verifyToken, companyController.deleteCompany.bind(companyController));

//with token
/**
 * 
 * /**
 * @openapi
 * /api/update/company/{id}:
 *   post:
 *     summary: Modifier une company.
 *     tags:
 *       - Company
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: L'identifiant de la company à modifier.
 *         required: true
 *         schema:
 *           type: string 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               priceInit:
 *                 type: string
 *                 description: Le prix initial du produit.
 *               priceFinal:
 *                 type: string
 *                 description: Le prix final du produit.
 *               promotion:
 *                 type: string
 *                 description: La réduction appliqué sur le produit
 *               name:
 *                 type: string
 *                 description: Le nom du produit
 *               description:
 *                 type: string
 *                 description: Une description du produit
 *               companyId:
 *                 type: string
 *                 description: L'id de l'entreprise qui offre le produit
 *               usable:
 *                 type: int
 *                 description: Le nombre de fois que la personne peut l'utiliser par jour 
 *             required:
 *               - priceInit
 *               - priceFinal
 *               - promotion
 *               - name
 *               - description
 *               - companyId
 *               - companyId
 */
router.post('/update/company/:id', verifyToken, companyController.updateCompany.bind(companyController));

/**
 * @openapi
 * /api/company/addToFavorite:
 *   post:
 *     summary: Ajouter une entreprise aux favoris d'un utilisateur.
 *     tags:
 *       - Company
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: string
 *                 description: L'identifiant de l'entreprise à ajouter aux favoris.
 *               userId:
 *                 type: string
 *                 description: L'identifiant de l'utilisateur auquel ajouter l'entreprise aux favoris.
 *             required:
 *               - companyId
 *               - userId
 *     responses:
 *       '200':
 *         description: Succès - L'entreprise a été ajoutée aux favoris de l'utilisateur.
 *       '400':
 *         description: Requête invalide - L'entreprise est déjà dans la liste des favoris de l'utilisateur.
 *       '404':
 *         description: Non trouvé - L'utilisateur ou l'entreprise n'existe pas.
 *       '500':
 *         description: Erreur interne du serveur - Impossible d'ajouter l'entreprise aux favoris.
 */
router.post('/company/addToFavorite', companyController.addToFavorite.bind(companyController));

/**
 * @openapi
 * /api/company/getFavorites/{id}:
 *   get:
 *     summary: Récupère la lsite des favoris selon l'id de l'utilisateur.
 *     tags:
 *       - Company
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'identifiant de l'utilisateur.
 *         schema:
 *           type: string
 */
router.get('/company/getFavorites/:id', companyController.getFavorites.bind(companyController));


module.exports = router;
