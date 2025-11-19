const admin = require('firebase-admin');
const Company = require('../models/company');

class CompanyController {
  constructor() {
    this.db = admin.firestore();
    this.collectionCompany = this.db.collection('company');
  }

  async getAllCompany(req, res) {
    try {
      const querySnapshot = await this.collectionCompany.get();
      const companies = [];
      querySnapshot.forEach((doc) => {
        companies.push({ id: doc.id, data: doc.data() });
      });
      res.json(companies);
    } catch (error) {
      console.error('Erreur lors de la récupération des données Company :', error);
      res.status(500).send('Erreur interne du serveur');
    }
  }
  
  async createCompany(req, res) {
    try {
      const { description, name, category, place, urlImage } = req.body;
  
      if (!description || !category || !name || !place ) {
        return res.status(400).json({ error: 'Toutes les données sont nécessaires pour créer une company.' });
      }

      let imageUrl = urlImage || 'https://firebasestorage.googleapis.com/v0/b/newstud.appspot.com/o/noImage.png?alt=media&token=73859999-8ac4-48fc-9f8c-5aa14d279fc1';
  
      const newCompany = {
        description,
        name,
        category,
        place,
        urlImage: imageUrl,
      };
      
      const docRef = await this.collectionCompany.add(newCompany);
  
      res.status(201).json({ id: docRef.id, ...newCompany });
    } catch (error) {
      console.error('Erreur lors de la création du produit :', error);
      res.status(500).send('Erreur interne du serveur');
    }
  }
  
  async getCompanyById(req, res) {
    try {
      const companyId = req.params.id; 

      if (!companyId) {
        return res.status(400).json({ error: 'L\'identifiant du produit est requis.' });
      }

      const docSnapshot = await this.collectionCompany.doc(companyId).get();

      if (!docSnapshot.exists) {
        return res.status(404).json({ error: 'Produit non trouvé.' });
      }

      const company = {
        id: docSnapshot.id,
        data: docSnapshot.data(),
      };

      res.json(company);
    } catch (error) {
      console.error('Erreur lors de la récupération du produit par ID :', error);
      res.status(500).send('Erreur interne du serveur');
    }
  }

  
  async getCompanyByCategory(req, res){
    try{
    const categoryName = req.params.category;

    if (!categoryName){
      return res.status(400).json({error: 'La catégorie est requis.'})
    }

    const querySnapshot = await this.collectionCompany.where('category', '==', categoryName).get();

    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'Aucune company trouvée pour cette catégorie.' });
    }

    const companys = [];

    querySnapshot.forEach((doc) => {
      const company = {
        id: doc.id,
        data: doc.data(),
      };
      companys.push(company);
    });

    res.json(companys);

  } catch (error) {
    console.error('Erreur lors de la récupération des companys par catégorie :', error);
    res.status(500).send('Erreur interne du serveur');
  }
  }

  async deleteCompany(req, res) {
    try {
      const companyId = req.params.id;
  
      if (!companyId) {
        return res.status(400).json({ error: 'L\'identifiant de la company est requis pour la suppression.' });
      }
  
      const docRef = this.collectionCompany.doc(companyId);
      const docSnapshot = await docRef.get();
  
      if (!docSnapshot.exists) {
        return res.status(404).json({ error: 'Company non trouvée.' });
      }
  
      await docRef.delete();
  
      res.status(200).json({ message: 'Company bien supprimée' });
    } catch (error) {
      console.error('Erreur lors de la suppression de la company par ID :', error);
      res.status(500).send('Erreur interne du serveur');
    }
  }

  async updateCompany(req, res) {
    try {
      const companyId = req.params.id;
  
      if (!companyId) {
        return res.status(400).json({ error: 'L\'identifiant de la company est requis pour la mise à jour.' });
      }
  
      const { description, name, category, place } = req.body;
  
      if (!description || !name || !place || !category) {
        return res.status(400).json({ error: 'Toutes les données sont nécessaires pour mettre à jour une company.' });
      }
  
      const updatedCompany = {
        description,
        name,
        category,
        place,
      };
  
      const docRef = this.collectionCompany.doc(companyId);
      const docSnapshot = await docRef.get();
  
      if (!docSnapshot.exists) {
        return res.status(404).json({ error: 'Company non trouvée.' });
      }
  
      await docRef.update(updatedCompany);
  
      res.status(200).json({ message: 'Company bien mise à jour', ...updatedCompany });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la company par ID :', error);
      res.status(500).send('Erreur interne du serveur');
    }
  }

  async addToFavorite(req, res) {
    try {
        const { companyId, userId } = req.body;

        if (!companyId || !userId) {
            return res.status(400).json({ error: "L'identifiant de l'entreprise et de l'utilisateur sont requis." });
        }

        const userDocRef = admin.firestore().collection('user').doc(userId);

        const userDoc = await userDocRef.get();
        const userData = userDoc.data();

        if (!userDoc.exists) {
            return res.status(404).json({ error: "Utilisateur non trouvé." });
        }

        if (!userData.hasOwnProperty('favorites')) {
            userData.favorites = [];
        }

        // Vérifie si l'entreprise est déjà dans les favoris
        const isFavorite = userData.favorites.includes(companyId);

        if (isFavorite) {
            // Si l'entreprise est déjà dans les favoris, on la retire
            userData.favorites = userData.favorites.filter(id => id !== companyId);
            await userDocRef.update({ favorites: userData.favorites });
            return res.status(200).json({ message: "Entreprise retirée des favoris avec succès." });
        } else {
            // Si l'entreprise n'est pas dans les favoris, on l'ajoute
            userData.favorites.push(companyId);
            await userDocRef.update({ favorites: userData.favorites });
            return res.status(200).json({ message: "Entreprise ajoutée aux favoris avec succès." });
        }

    } catch (error) {
        console.error('Erreur lors de l\'ajout ou de la suppression de l\'entreprise aux favoris :', error);
        res.status(500).send('Erreur interne du serveur');
    }
}

async getFavorites(req, res){
  try {
    const userId = req.params.id; 

    if (!userId) {
      return res.status(400).json({ error: 'L\'identifiant de l\'user est requis.' });
    }

    const userDocRef = admin.firestore().collection('user').doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    const userData = userDoc.data();

    if (!userData.hasOwnProperty('favorites')) {
      return res.status(200).json({ favorites: [] });
    }

    res.json({ favorites: userData.favorites });
  } catch (error) {
    console.error('Erreur lors de la récupération des favories de l\'utilisateur :', error);
    res.status(500).send('Erreur interne du serveur');
  }
}

  
  
}

module.exports = CompanyController;
