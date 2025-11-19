import axios from 'axios';
import { Product, Company, CreateVoucherData, Voucher, UpdateVoucherData, CreateProductData, CreateCompanyData } from '../types';

// Détection automatique de l'URL du backend
const getApiBaseUrl = (): string => {
  // Si une URL est définie dans les variables d'environnement, l'utiliser
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Sinon, détecter automatiquement selon l'URL actuelle
  const hostname = window.location.hostname;
  
  // Si on est sur localhost, utiliser localhost pour le backend
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3500/api';
  }
  
  // Sinon, utiliser la même IP que le frontend pour le backend
  return `http://${hostname}:3500/api`;
};

const API_BASE_URL = getApiBaseUrl();

// Récupérer le token depuis les variables d'environnement
// Cherche plusieurs variables possibles dans l'ordre de priorité
const AUTH_TOKEN = 
  import.meta.env.VITE_JWT_TOKEN || 
  import.meta.env.VITE_AUTH_TOKEN || 
  import.meta.env.VITE_TOKEN ||
  import.meta.env.JWT_TOKEN ||
  import.meta.env.AUTH_TOKEN;

// Log en mode développement pour vérifier si le token est présent
if (import.meta.env.DEV) {
  if (AUTH_TOKEN) {
    console.log('✅ Token d\'authentification trouvé dans les variables d\'environnement');
  } else {
    console.warn('⚠️  Aucun token d\'authentification trouvé dans les variables d\'environnement');
    console.warn('   Vérifiez que VITE_JWT_TOKEN est défini dans votre fichier .env');
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes de création/modification/suppression
api.interceptors.request.use(
  (config) => {
    // Ajouter le token uniquement pour les requêtes POST, PUT, DELETE (création/modification)
    if (AUTH_TOKEN && (config.method === 'post' || config.method === 'put' || config.method === 'delete')) {
      config.headers.Authorization = `Bearer ${AUTH_TOKEN}`;
    } else if (!AUTH_TOKEN && (config.method === 'post' || config.method === 'put' || config.method === 'delete')) {
      console.error('❌ Tentative de requête authentifiée sans token disponible');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ Erreur 401 - Non autorisé');
      console.error('   Vérifiez que votre token JWT est valide et présent dans le .env');
      console.error('   Utilisez le script: node scripts/generateToken.js dans le dossier backend');
    }
    return Promise.reject(error);
  }
);

// Services pour les produits
export const productService = {
  getAll: (): Promise<{ data: Product[] }> => api.get('/products'),
  getById: (id: string): Promise<{ data: Product }> => api.get(`/products/${id}`),
  getByCategory: (category: string): Promise<{ data: Product[] }> => 
    api.get(`/products/category/${category}`),
  getByCompany: (companyId: string): Promise<{ data: Product[] }> => 
    api.get(`/products/company/${companyId}`),
  create: (productData: CreateProductData): Promise<any> => 
    api.post('/products/create', productData),
};

// Services pour les entreprises
export const companyService = {
  getAll: (): Promise<{ data: Company[] }> => api.get('/company'),
  getById: (id: string): Promise<{ data: Company }> => api.get(`/company/${id}`),
  getByCategory: (category: string): Promise<{ data: Company[] }> => 
    api.get(`/company/category/${category}`),
  create: (companyData: CreateCompanyData): Promise<any> => 
    api.post('/company/create', companyData),
};

// Services pour les vouchers (promos)
export const voucherService = {
  getAll: (): Promise<{ data: Voucher[] }> => api.get('/vouchers'),
  getById: (id: string): Promise<{ data: Voucher }> => api.get(`/vouchers/${id}`),
  create: (voucherData: CreateVoucherData): Promise<any> => 
    api.post('/vouchers/create', voucherData),
  update: (id: string, voucherData: UpdateVoucherData): Promise<any> =>
    api.put(`/vouchers/${id}`, voucherData),
  delete: (id: string): Promise<any> => api.delete(`/vouchers/${id}`),
};

export default api;

