const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const verifyToken = require('../middleware/verifyToken');

const productController = new ProductController();

//without token
/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Récupère la liste de tout les produits.
 *     tags:
 *       - Product
 */
router.get('/products', productController.getAllProducts.bind(productController));

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Récupère un produit par son identifiant.
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'identifiant du produit.
 *         schema:
 *           type: string
 */
router.get('/products/:id', productController.getProductById.bind(productController));


/**
 * @openapi
 * /api/products/category/{category}:
 *   get:
 *     summary: Récupère des produits par sa category.
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         description: La category du produit.
 *         schema:
 *           type: string
 */
router.get('/products/category/:category', productController.getProductByCategory.bind(productController));

//with token
/**
 * 
 * /**
 * @openapi
 * /api/product/create:
 *   post:
 *     summary: Créer un nouveau produit.
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
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
 *               urlImageCompanyPage:
 *                 type: string
 *                 description: L'url de l'image firebase qui sera affiché sur la page de la company
 *               urlImageProductPage:
 *                  type: array
 *                  item: 
 *                    type: string
 *                    format: uri
 *                  description: Un tableau avec les url des images firebase qui seront affiché sur la page produit
 *             required:
 *               - priceInit
 *               - priceFinal
 *               - name
 *               - description
 *               - companyId
 *               - companyId
 */
router.post('/products/create', verifyToken, productController.createProduct.bind(productController));

//with token
/**
 * @openapi
 * /api/product/{id}:
 *   delete:
 *     summary: Supprimer un produit.
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: L'identifiant du produit à supprimer.
 *         required: true
 *         schema:
 *           type: string 
 */
router.delete('/products/:id', verifyToken, productController.deleteProduct.bind(productController));

//with token
/**
 * 
 * /**
 * @openapi
 * /api/update/product/{id}:
 *   post:
 *     summary: Modifier un produit.
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: L'identifiant du produit à modifier.
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
router.post('/update/products/:id', verifyToken, productController.updateProduct.bind(productController));

/**
* @openapi
* /api/products/company/{company}:
*   get:
*     summary: Récupère tout les produits d'une company.
*     tags:
*       - Product
*     parameters:
*       - in: path
*         name: company
*         required: true
*         description: La company du produit.
*         schema:
*           type: string
*/
router.get('/products/company/:companyId', productController.getProductByCompany.bind(productController))



module.exports = router;
