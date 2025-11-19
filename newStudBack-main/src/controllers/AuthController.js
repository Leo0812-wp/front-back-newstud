const jwt = require('jsonwebtoken');
const UserAdmin = require('../models/userAdmin');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
const userAdmin = new UserAdmin();
const bcrypt = require('bcrypt');


class AuthController {
  async register(req, res) {
    try {
      const {username , password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await userAdmin.registerUser(username, hashedPassword);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await userAdmin.getUserByUid(username);
  
      if (!user) {
        res.status(401).json({ error: 'User not authorized' });
        return;
      }
      const storedPassword = user.password;
      const passwordMatch = await bcrypt.compare(password, storedPassword);
  
      if (!passwordMatch) {
        res.status(401).json({ error: 'Incorrect password' });
        return;
      }
  
      const token = jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}

module.exports = AuthController;
