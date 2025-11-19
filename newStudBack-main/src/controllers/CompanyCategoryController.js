const admin = require('firebase-admin');
const CompanyCategory = require('../models/companyCategory');

class CompanyCategoryController {
  constructor() {
    this.db = admin.firestore();
    this.collectionCompany = this.db.collection('companyCategory');
  }

  async getAllCompanyCategory(req, res) {
    try {
      const querySnapshot = await this.collectionCompany.get();
      const categorys = [];
      querySnapshot.forEach((doc) => {
        categorys.push({ id: doc.id, data: doc.data() });
      });
      res.json(categorys);
    } catch (error) {
      console.error('Erreur lors de la récupération des données Commpany Category :', error);
      res.status(500).send('Erreur interne du serveur');
    }
  }
 
}

module.exports = CompanyCategoryController;
