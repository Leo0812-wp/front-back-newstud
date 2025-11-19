const admin = require('firebase-admin');
const User = require('../models/user');

class UserController {
  constructor() {
    this.db = admin.firestore();
    this.collectionUser = this.db.collection('user');
  }

  async getAllUsers(req, res) {
    try {
      const querySnapshot = await this.collectionUser.get();
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, data: doc.data() });
      });
      res.json(users);
    } catch (error) {
      console.error('Erreur lors de la récupération des données Users :', error);
      res.status(500).send('Erreur interne du serveur');
    }
  }
  
  async createUser(req, res) {
    try {
      const { uid, name, firstName } = req.body;
  
      if (!uid || !name || !firstName) {
        return res.status(400).json({ error: 'Toutes les données sont nécessaires pour créer un user.' });
      }
  
       const docRef = this.collectionUser.doc(uid);

       const docSnapshot = await docRef.get();

       if (docSnapshot.exists) {
           return res.status(400).json({ error: 'Un utilisateur avec cet UUID existe déjà.' });
       }
      const newUser = { uid, name, firstName};
      await docRef.set(newUser);
  
      res.status(201).json({ id: docRef.id, ...newUser });
    } catch (error) {
      console.error('Erreur lors de la création du user :', error);
      res.status(500).send('Erreur interne du serveur');
    }
  }
  
  
}

module.exports = UserController;
