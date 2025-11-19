const admin = require('firebase-admin');
const Product = require('../models/product');

class ProductController {
  constructor() {
    this.db = admin.firestore();
    this.collectionProduct = this.db.collection('product');
  }

  async getAllProducts(req, res) {
    try {
      const querySnapshot = await this.collectionProduct.get();
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, data: doc.data() });
      });
      res.json(products);
    } catch (error) {
      console.error('Erreur lors de la récupération des données Product :', error);
      res.status(500).send('Erreur interne du serveur');
    }
  }
  
  async createProduct(req, res) {
    try {
      const { priceInit, priceFinal, promotion, name, category, description, companyId, usable, urlImageCompanyPage, urlImageProductPage } = req.body;
  
      if (!name || !description || !category || !companyId || !usable) {
        return res.status(400).json({ error: 'Toutes les données sont nécessaires pour créer un produit.' });
      }

      let imageUrlCompanyPage = urlImageCompanyPage || 'https://firebasestorage.googleapis.com/v0/b/newstud.appspot.com/o/noImage.png?alt=media&token=73859999-8ac4-48fc-9f8c-5aa14d279fc1';
  
      const imageUrlProductPage = Array.isArray(urlImageProductPage) && urlImageProductPage.length > 0 ? urlImageProductPage : ['https://firebasestorage.googleapis.com/v0/b/newstud.appspot.com/o/noImage.png?alt=media&token=73859999-8ac4-48fc-9f8c-5aa14d279fc1'];

  
      const newProduct = {
        priceInit,
        priceFinal,
        promotion,
        name,
        category,
        description,
        category,
        companyId,
        usable,
        urlImageCompanyPage: imageUrlCompanyPage,
        urlImageProductPage: imageUrlProductPage
      };
      const docRef = await this.collectionProduct.add(newProduct);
  
      res.status(201).json({ id: docRef.id, ...newProduct });
    } catch (error) {
      console.error('Erreur lors de la création du produit :', error);
      res.status(500).send('Erreur interne du serveur');
    }
  }
  
  async getProductById(req, res) {
    try {
      const productId = req.params.id; 

      if (!productId) {
        return res.status(400).json({ error: 'L\'identifiant du produit est requis.' });
      }

      const docSnapshot = await this.collectionProduct.doc(productId).get();

      if (!docSnapshot.exists) {
        return res.status(404).json({ error: 'Produit non trouvé.' });
      }

      const product = {
        id: docSnapshot.id,
        data: docSnapshot.data(),
      };

      res.json(product);
    } catch (error) {
      console.error('Erreur lors de la récupération du produit par ID :', error);
      res.status(500).send('Erreur interne du serveur');
    }
  }

  async getProductByCategory(req, res){
    try{
    const categoryName = req.params.category;

    if (!categoryName){
      return res.status(400).json({error: 'La catégorie est requis.'})
    }

    const querySnapshot = await this.collectionProduct.where('category', '==', categoryName).get();

    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'Aucun produits trouvés pour cette catégorie.' });
    }

    const products = [];

    querySnapshot.forEach((doc) => {
      const product = {
        id: doc.id,
        data: doc.data(),
      };
      products.push(product);
    });

    res.json(products);

  } catch (error) {
    console.error('Erreur lors de la récupération des produits par catégorie :', error);
    res.status(500).send('Erreur interne du serveur');
  }
  }

  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;
  
      if (!productId) {
        return res.status(400).json({ error: 'L\'identifiant du produit est requis pour la suppression.' });
      }
  
      const docRef = this.collectionProduct.doc(productId);
      const docSnapshot = await docRef.get();
  
      if (!docSnapshot.exists) {
        return res.status(404).json({ error: 'Company non trouvée.' });
      }
  
      await docRef.delete();
  
      res.status(200).json({ message: 'Produit bien supprimée' });
    } catch (error) {
      console.error('Erreur lors de la suppression du produit par ID :', error);
      res.status(500).send('Erreur interne du serveur');
    }
  }

  async updateProduct(req, res) {
    try {
      const productId = req.params.id;
  
      if (!productId) {
        return res.status(400).json({ error: 'L\'identifiant du produit est requis pour la mise à jour.' });
      }
  
      const { priceInit, priceFinal, promotion, name, description, companyId, usable } = req.body;
  
      if (!name || !description || !companyId || !usable) {
        return res.status(400).json({ error: 'Toutes les données sont nécessaires pour mettre à jour un produit.' });
      }
  
      const updatedProduct = {
        priceInit,
        priceFinal,
        promotion,
        name,
        category,
        description,
        category,
        companyId,
        usable,
      };
  
      const docRef = this.collectionProduct.doc(productId);
      const docSnapshot = await docRef.get();
  
      if (!docSnapshot.exists) {
        return res.status(404).json({ error: 'Produit non trouvé.' });
      }
  
      await docRef.update(updatedProduct);
  
      res.status(200).json({ message: 'Produit bien mis à jour', ...updatedProduct });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit par ID :', error);
      res.status(500).send('Erreur interne du serveur');
    }
  }


  async getProductByCompany(req, res){
    try{
    const companyId = req.params.companyId;

    if (!companyId){
      return res.status(400).json({error: 'La catégorie ID est requis.'})
    }

    const querySnapshot = await this.collectionProduct.where('companyId', '==', companyId).get();

    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'Aucun produits trouvés pour cette company.' });
    }

    const products = [];

    querySnapshot.forEach((doc) => {
      const product = {
        id: doc.id,
        data: doc.data(),
      };
      products.push(product);
    });

    res.json(products);

  } catch (error) {
    console.error('Erreur lors de la récupération des produits par catégorie :', error);
    res.status(500).send('Erreur interne du serveur');
  }
  }
  

}

module.exports = ProductController;
