const Product = require('../models/product');
const admin = require('firebase-admin');

class HighlightController {
    constructor() {
        this.db = admin.firestore();
        this.collectionProduct = this.db.collection('product');
        this.collectionHighlight = this.db.collection('highlight');
      }

      async highlightProduct(req, res) {
        try {
            const productId = req.params.id;

            if (!productId) {
                return res.status(400).json({ error: 'L\'identifiant du produit est requis.' });
            }

            const docSnapshot = await this.collectionProduct.doc(productId).get();

            if (!docSnapshot.exists) {
                return res.status(404).json({ error: 'Produit non trouvé.' });
            }

            const productData = docSnapshot.data();

            const highlightSnapshot = await this.collectionHighlight.get();
            let highlightDocRef;

            if (highlightSnapshot.empty) {
                highlightDocRef = await this.collectionHighlight.add(productData);
            } else {
                const highlightDoc = highlightSnapshot.docs[0];
                highlightDocRef = highlightDoc.ref;
                await highlightDocRef.set(productData);
            }

            res.json({ message: 'Produit mis en avant avec succès.', highlightId: highlightDocRef.id });
        } catch (error) {
            console.error('Erreur lors de la mise en avant du produit :', error);
            res.status(500).send('Erreur interne du serveur');
        }
    }

    async getHighlight(req, res) {
        try {
            const highlightSnapshot = await this.collectionHighlight.get();
            
            if (highlightSnapshot.empty) {
                return res.status(404).json({ error: 'Produit mis en avant non trouvé.' });
            }

            const highlightDoc = highlightSnapshot.docs[0];
            const highlightData = highlightDoc.data();

            res.json({ highlightData });
        } catch (error) {
            console.error('Erreur lors de la récupération du produit mis en avant :', error);
            res.status(500).send('Erreur interne du serveur');
        }
    }
}


module.exports = HighlightController;
