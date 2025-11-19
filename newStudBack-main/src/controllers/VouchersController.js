const admin = require('firebase-admin');
const Vouchers = require('../models/vouchers');

class VouchersController {
    constructor() {
        this.db = admin.firestore();
        this.collectionVoucher = this.db.collection('vouchers');
      }
      

      async createVouchers(req, res){
        function generateVoucherId() {
          return admin.firestore().collection('dummy').doc().id;
         }

        try {
          const { productId, companyId, activationTime, desactivationTime, dayOfWeek, nbUtilisation } = req.body;

          if (!productId || !companyId || !activationTime || !desactivationTime || !dayOfWeek || !nbUtilisation) {
            return res.status(400).json({ error: 'Toutes les données sont nécessaires pour créer un Voucher.' });
          }

          const newVoucher = {
            productId,
            companyId,
            activationTime,
            desactivationTime,
            dayOfWeek,
          }

          for (let i = 1; i <= nbUtilisation; i++) {
            newVoucher[`voucher${i}`] = generateVoucherId();
          }

          const docRef = await this.collectionVoucher.add(newVoucher);

          res.status(201).json({ id: docRef.id, ...newVoucher });
        } catch (error) {
          console.error('Erreur lors de la création du produit :', error);
          res.status(500).send('Erreur interne du serveur');
        }
      }

      async askVouchers(req, res) {
        try {
            const { productId, userId } = req.body;
    
            // Step 1 : vérifier les entrées produit et user
            if (!productId || !userId) {
                return res.status(400).json({ error: "L'identifiant du produit et de l'utilisateur sont requis." });
            }
    
            // Step 2 : Récupérer les coupons du produit
            const vouchersQuery = await this.collectionVoucher.where('productId', '==', productId).get();

            //liste final, avec les vouchers utilisable selon l'heure
            let validVouchers = [];

            // Log tous les vouchers récupérés
            console.log("Tous les vouchers récupérés :");
            vouchersQuery.forEach(voucherDoc => {
                console.log(voucherDoc.id, " => ", voucherDoc.data());
            });
            
            // Obtenir la date et l'heure actuelles
            const now = new Date();
            const currentHour = now.getHours();

            // Vérifier si l'heure actuelle est entre activationTime et desactivationTime
            vouchersQuery.forEach(voucherDoc => {
                const voucherData = voucherDoc.data();
                const activationHour = parseInt(voucherData.activationTime.split(':')[0]); // Heure de début
                const desactivationHour = parseInt(voucherData.desactivationTime.split(':')[0]); // Heure de fin

                if (currentHour >= activationHour && currentHour < desactivationHour) {
                  // L'heure actuelle est dans la plage horaire du voucher
                  validVouchers.push(voucherDoc);
                  console.log("L'heure actuelle est dans la plage horaire du voucher :", voucherDoc.id);
              } else {
                  // L'heure actuelle n'est pas dans la plage horaire du voucher
                  console.log("L'heure actuelle n'est pas dans la plage horaire du voucher :", voucherDoc.id);
              }
          });
  
          if (validVouchers.length === 0) {
            return res.status(404).json({ message: "Coupon indisponible à cette heure-ci." });
          }

    
            if (vouchersQuery.empty) {
                return res.status(404).json({ message: "Aucun bon disponible pour ce produit." });
            }
    
            // Step 3 : Récupérer les coupons de l'utilisateur
            const userVouchersQuery = await this.db.collection('user').doc(userId).get();
            const userData = userVouchersQuery.data();

            let userVouchers = [];
            if (userData) {
                Object.keys(userData).forEach(key => {
                    if (key.startsWith('voucher')) {
                        userVouchers.push(userData[key]); 
                    }
                });
            }
    
            let availableVoucherValue = null;
    
            // Step 4 : Parcourir les coupons du produit (dans la limite de 3 coupons)
            validVouchers.forEach(voucherDoc => {
                const voucherData = voucherDoc.data();
                for (let i = 1; i <= 3; i++) {
                    const voucherFieldName = `voucher${i}`;
                    // Vérifier si le champ coupon[i] n'est pas déjà utilisé par l'utilisateur
                    if (!userVouchers.includes(voucherData[voucherFieldName]) && !availableVoucherValue) {
                        availableVoucherValue = voucherData[voucherFieldName];
                        break; 
                    }
                }
            });
    
            if (!availableVoucherValue) {
                return res.status(200).json({ voucherValue: "" });
            }
    
            res.status(200).json({ voucherValue: availableVoucherValue });
        } catch (error) {
            console.error('Erreur lors de la demande de coupons :', error);
            res.status(500).send('Erreur interne du serveur');
        }
    }
    
    

    async useVouchers(req, res) {
      try {
          const { userId, voucherId } = req.body;

          if (!userId || !voucherId) {
              return res.status(400).json({ error: "L'identifiant de l'utilisateur et du voucher sont requis." });
          }
  
          const userDoc = await this.db.collection('user').doc(userId).get();
          var userData = userDoc.data();

          if (!userData) {
              return res.status(404).json({ error: "L'utilisateur n'existe pas." });
          }
  
  
          // Mis à jour des données de l'utilisateur avec le voucherId
          let voucherFieldName = "voucher"+voucherId;
          const updateData = {
              [voucherFieldName]: voucherId
          };
  
          await this.db.collection('user').doc(userId).update(updateData);
  
          res.status(200).json({ message: "Voucher utilisé avec succès (écrit dans la collection)." });
      } catch (error) {
          console.error('Erreur lors de l\'utilisation du voucher :', error);
          res.status(500).send('Erreur interne du serveur');
      }
  }

  async getAllVouchers(req, res) {
    try {
      const querySnapshot = await this.collectionVoucher.get();
      const vouchers = [];
      querySnapshot.forEach((doc) => {
        vouchers.push({ id: doc.id, ...doc.data() });
      });
      res.json(vouchers);
    } catch (error) {
      console.error('Erreur lors de la récupération des vouchers :', error);
      res.status(500).send('Erreur interne du serveur');
    }
  }

  async getVoucherById(req, res) {
    try {
      const voucherId = req.params.id;

      if (!voucherId) {
        return res.status(400).json({ error: "L'identifiant du voucher est requis." });
      }

      const docSnapshot = await this.collectionVoucher.doc(voucherId).get();

      if (!docSnapshot.exists) {
        return res.status(404).json({ error: 'Voucher non trouvé.' });
      }

      const voucher = {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      };

      res.json(voucher);
    } catch (error) {
      console.error('Erreur lors de la récupération du voucher par ID :', error);
      res.status(500).send('Erreur interne du serveur');
    }
  }

  async updateVoucher(req, res) {
    try {
      const voucherId = req.params.id;

      if (!voucherId) {
        return res.status(400).json({ error: "L'identifiant du voucher est requis pour la mise à jour." });
      }

      const { productId, companyId, activationTime, desactivationTime, dayOfWeek } = req.body;

      if (!productId || !companyId || !activationTime || !desactivationTime || !dayOfWeek) {
        return res.status(400).json({ error: 'Toutes les données sont nécessaires pour mettre à jour un voucher.' });
      }

      const docRef = this.collectionVoucher.doc(voucherId);
      const docSnapshot = await docRef.get();

      if (!docSnapshot.exists) {
        return res.status(404).json({ error: 'Voucher non trouvé.' });
      }

      // Récupérer les vouchers existants pour les conserver
      const existingData = docSnapshot.data();
      const updatedData = {
        productId,
        companyId,
        activationTime,
        desactivationTime,
        dayOfWeek,
      };

      // Conserver les vouchers existants (voucher1, voucher2, voucher3)
      if (existingData.voucher1) updatedData.voucher1 = existingData.voucher1;
      if (existingData.voucher2) updatedData.voucher2 = existingData.voucher2;
      if (existingData.voucher3) updatedData.voucher3 = existingData.voucher3;

      await docRef.update(updatedData);

      res.status(200).json({ message: 'Voucher bien mis à jour', id: voucherId, ...updatedData });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du voucher :', error);
      res.status(500).send('Erreur interne du serveur');
    }
  }

  async deleteVoucher(req, res) {
    try {
      const voucherId = req.params.id;

      if (!voucherId) {
        return res.status(400).json({ error: "L'identifiant du voucher est requis pour la suppression." });
      }

      const docRef = this.collectionVoucher.doc(voucherId);
      const docSnapshot = await docRef.get();

      if (!docSnapshot.exists) {
        return res.status(404).json({ error: 'Voucher non trouvé.' });
      }

      await docRef.delete();

      res.status(200).json({ message: 'Voucher bien supprimé' });
    } catch (error) {
      console.error('Erreur lors de la suppression du voucher :', error);
      res.status(500).send('Erreur interne du serveur');
    }
  }
  
}

module.exports = VouchersController;
