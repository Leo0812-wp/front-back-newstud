const admin = require('firebase-admin');
const ProductCategory = require('../models/productCategory');

class ProductCategoryController {
  constructor() {
    this.db = admin.firestore();
    this.collectionProduct = this.db.collection('productCategory');
  }

  async getAllProductCategory(req, res) {
    try {
      const querySnapshot = await this.collectionProduct.get();
      const categorys = [];
      querySnapshot.forEach((doc) => {
        categorys.push({ id: doc.id, data: doc.data() });
      });
      res.json(categorys);
    } catch (error) {
      console.error('Erreur lors de la récupération des données Product Category :', error);
      res.status(500).send('Erreur interne du serveur');
    }
  }
 
}

module.exports = ProductCategoryController;
