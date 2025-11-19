const express = require('express');
const router = express.Router();
const ProductCategoryController = require('../controllers/ProductCategoryController');

const productCategoryController = new ProductCategoryController();

//without token
/**
 * @openapi
 * /api/productCategory:
 *   get:
 *     summary: Récupère la liste de toutes les catégories des produits.
 *     tags:
 *       - Product category
 */
router.get('/productCategory', productCategoryController.getAllProductCategory.bind(productCategoryController));


module.exports = router;
