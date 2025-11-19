const admin = require('firebase-admin');

class UserAdmin {
  async registerUser(username, password) {
    try {
      await admin.firestore().collection('userAdmin').doc(username).set({ 
        username,
        password
     });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getUserByUid(username) {
    try {
      const userSnapshot = await admin.firestore().collection('userAdmin').doc(username).get();
      return userSnapshot.exists ? userSnapshot.data() : null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserAdmin;
