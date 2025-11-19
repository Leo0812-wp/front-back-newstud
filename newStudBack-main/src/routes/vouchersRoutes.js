const express = require('express');
const router = express.Router();
const VouchersController = require('../controllers/VouchersController');
const verifyToken = require('../middleware/verifyToken');

const vouchersController = new VouchersController();


//with token
/**
 * 
 * /**
 * @openapi
 * /api/vouchers/create:
 *   post:
 *     summary: Créer un coupon de réduction.
 *     tags:
 *       - Coupons
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: L'id du produit.
 *               companyId:
 *                 type: string
 *                 description: L'id de l'entreprise.
 *               activationTime:
 *                 type: string
 *                 description: L'heure d'activation du coupon.
 *               desactivationTime:
 *                 type: string
 *                 description: L'heure de fin du coupon.
 *               dayOfWeek:
 *                 type: string
 *                 description: Le jour où le coupon est utilisable.
 *               nbUtilisation:
 *                 type: int
 *                 description: Le nombre de fois ou le coupon peut être utilisé. 
 *             required:
 *               - productId
 *               - companyId
 *               - activationTime
 *               - desactivationTime
 *               - dayOfWeek
 *               - nbUtilisation
 */
router.post('/vouchers/create', vouchersController.createVouchers.bind(vouchersController));

/**
 * @openapi
 * /api/vouchers/askVouchers:
 *   get:
 *     summary: Demander un coupon de réduction disponible pour un utilisateur.
 *     tags:
 *       - Coupons
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: L'ID du produit pour lequel le coupon est demandé.
 *                 example: "123456"
 *               userId:
 *                 type: string
 *                 description: L'ID de l'utilisateur qui demande le coupon.
 *                 example: "789012"
 *     responses:
 *       '200':
 *         description: Succès de la demande du coupon avec l'ID du coupon retourné.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 voucherValue:
 *                   type: string
 *                   description: La valeur du coupon demandé.
 *       '400':
 *         description: Erreur de requête en raison de paramètres manquants.
 *       '404':
 *         description: Aucun coupon disponible pour le produit spécifié ou à l'heure actuelle.
 *       '500':
 *         description: Erreur interne du serveur lors du traitement de la demande.
 */
router.post('/vouchers/askVouchers', vouchersController.askVouchers.bind(vouchersController));


/**
 * @openapi
 * /vouchers/useVouchers:
 *   post:
 *     summary: Ecriture du voucher sur la document de l'user (utilisation du voucher)
 *     tags:
 *       - Coupons
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: L'identifiant de l'utilisateur qui utilise le voucher.
 *               voucherId:
 *                 type: string
 *                 description: L'identifiant du voucher à utiliser.
 *     responses:
 *       '200':
 *         description: Succès de l'utilisation du voucher.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indiquant que le voucher a été utilisé avec succès.
 *       '400':
 *         description: Requête invalide en raison de paramètres manquants.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description de l'erreur survenue.
 *       '404':
 *         description: L'utilisateur spécifié n'existe pas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description de l'erreur survenue.
 *       '500':
 *         description: Erreur interne du serveur lors du traitement de la demande.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description de l'erreur interne du serveur.
 */

router.post('/vouchers/useVouchers', vouchersController.useVouchers.bind(vouchersController));

/**
 * @openapi
 * /api/vouchers:
 *   get:
 *     summary: Récupère la liste de tous les vouchers.
 *     tags:
 *       - Coupons
 *     responses:
 *       '200':
 *         description: Liste des vouchers récupérée avec succès.
 */
router.get('/vouchers', vouchersController.getAllVouchers.bind(vouchersController));

/**
 * @openapi
 * /api/vouchers/{id}:
 *   get:
 *     summary: Récupère un voucher par son identifiant.
 *     tags:
 *       - Coupons
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'identifiant du voucher.
 *         schema:
 *           type: string
 */
router.get('/vouchers/:id', vouchersController.getVoucherById.bind(vouchersController));

/**
 * @openapi
 * /api/vouchers/{id}:
 *   put:
 *     summary: Met à jour un voucher.
 *     tags:
 *       - Coupons
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'identifiant du voucher à modifier.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               companyId:
 *                 type: string
 *               activationTime:
 *                 type: string
 *               desactivationTime:
 *                 type: string
 *               dayOfWeek:
 *                 type: string
 */
router.put('/vouchers/:id', vouchersController.updateVoucher.bind(vouchersController));

/**
 * @openapi
 * /api/vouchers/{id}:
 *   delete:
 *     summary: Supprime un voucher.
 *     tags:
 *       - Coupons
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'identifiant du voucher à supprimer.
 *         schema:
 *           type: string
 */
router.delete('/vouchers/:id', vouchersController.deleteVoucher.bind(vouchersController));

module.exports = router;
    