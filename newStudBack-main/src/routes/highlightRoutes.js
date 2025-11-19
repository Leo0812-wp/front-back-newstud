const express = require('express');
const router = express.Router();
const HighlightController = require("../controllers/HighlightController");

const highlightController = new HighlightController();


//with token
/**
 * @openapi
 * /api/highlight/{id}:
 *   post:
 *     summary: Mettre en avant un produit.
 *     tags:
 *       - Highlight
 *     parameters:
 *       - in: path
 *         name: id
 *         description: L'identifiant du produit à ajouter.
 *         required: true
 *         schema:
 *           type: string       
 */
router.post('/highlight/:id', highlightController.highlightProduct.bind(highlightController));

/**
 * @openapi
 * /api/highlight:
 *   get:
 *     summary: Récupère le produit mis en avant.
 *     tags:
 *       - Highlight
 */
router.get('/highlight', highlightController.getHighlight.bind(highlightController));

module.exports = router;