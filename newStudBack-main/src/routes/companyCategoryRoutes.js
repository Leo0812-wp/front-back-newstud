const express = require('express');
const router = express.Router();
const CompanyCategoryController = require('../controllers/CompanyCategoryController');

const companyCategoryController = new CompanyCategoryController();

//without token
/**
 * @openapi
 * /api/companyCategory:
 *   get:
 *     summary: Récupère la liste de toutes les catégories des company.
 *     tags:
 *       - Company category
 */
router.get('/companyCategory', companyCategoryController.getAllCompanyCategory.bind(companyCategoryController));


module.exports = router;
