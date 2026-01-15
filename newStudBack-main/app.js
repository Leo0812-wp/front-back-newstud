const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// Import de Firebase Admin depuis le fichier de configuration centralisé
const admin = require('./src/config/firebase');
const ProductController = require('./src/controllers/ProductController');
const Product = require('./src/models/product');

const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Swagger de l\'APi Newstud',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  apis: ['src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerUi = require('swagger-ui-express');

const app = express();
const db = admin.firestore();
db.listCollections().then((collections) => {
  console.log('Collections:', collections);
}).catch((error) => {
  console.error('Error listing collections:', error);
});

const collectionProduct = db.collection('product');
collectionProduct.get().then(snapshot => {
  console.log('Documents retrieved:', snapshot.size);
}).catch(error => {
  console.error('Error fetching documents:', error);
});
const productController = new ProductController(collectionProduct);

// Configuration CORS pour autoriser le front local avec cookies
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // requêtes locales (postman, curl)
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 204,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const productRoutes = require('./src/routes/productRoutes');
const vouchersRoutes = require('./src/routes/vouchersRoutes');
const companyRoutes = require('./src/routes/companyRoutes')
const userRoutes = require('./src/routes/userRoutes')
const authRoutes = require('./src/routes/authRoutes');
const companyCategoryRoutes = require('./src/routes/companyCategoryRoutes')
const productCategoryRoutes = require('./src/routes/productCategoryRoutes')
const highlightRoutes = require('./src/routes/highlightRoutes');
const firebaseTestRoutes = require('./src/routes/firebaseTestRoutes');
app.use('/api', vouchersRoutes);
app.use('/api', productRoutes);
app.use('/api', companyRoutes);
app.use('/api', userRoutes);
app.use('/api', companyCategoryRoutes);
app.use('/api', productCategoryRoutes);
app.use('/auth', authRoutes);
app.use('/api', highlightRoutes);
app.use('/api', firebaseTestRoutes);


const port = process.env.PORT || 3500;
const host = process.env.HOST || '0.0.0.0';
app.listen(port, host, () => {
  console.log(`Serveur Node.js en cours d'exécution sur ${host}:${port}`);
});
