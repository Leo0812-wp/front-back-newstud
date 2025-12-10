import axios from 'axios';
import { Product, Company, CreateVoucherData, Voucher, UpdateVoucherData, CreateProductData, CreateCompanyData } from '../types';
import { authUtils } from '../utils/auth';

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
const AUTH_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

// Fonction pour récupérer le token (priorité: cookie/localStorage > variables d'environnement)
const getAuthToken = (): string | null => {
  // D'abord, essayer depuis le cookie/localStorage
  const tokenFromStorage = authUtils.getToken();
  if (tokenFromStorage) {
    return tokenFromStorage;
  }

  // Sinon, chercher dans les variables d'environnement (fallback dev)
  return (
    import.meta.env.VITE_JWT_TOKEN || 
    import.meta.env.VITE_AUTH_TOKEN || 
    import.meta.env.VITE_TOKEN ||
    import.meta.env.JWT_TOKEN ||
    import.meta.env.AUTH_TOKEN ||
    null
  );
};

// Log en mode développement pour vérifier si le token est présent
if (import.meta.env.DEV) {
  const token = getAuthToken();
  if (token) {
    const source = authUtils.getToken() ? 'localStorage' : 'variables d\'environnement';
    console.log(`✅ Token d'authentification trouvé (${source})`);
  } else {
    console.warn('⚠️  Aucun token d\'authentification trouvé');
    console.warn('   Vérifiez que VITE_JWT_TOKEN est défini dans votre fichier .env');
    console.warn('   ou utilisez authUtils.setToken() pour le stocker dans localStorage');
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // permet d'envoyer les cookies (même en HTTP en dev)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes de création/modification/suppression
api.interceptors.request.use(
  (config) => {
    // Récupérer le token à chaque requête (pour prendre en compte les changements dynamiques)
    const token = getAuthToken();
    
    // Ajouter le token uniquement pour les requêtes POST, PUT, DELETE (création/modification)
    if (token && (config.method === 'post' || config.method === 'put' || config.method === 'delete')) {
      config.headers.Authorization = `Bearer ${token}`;
      if (import.meta.env.DEV) {
        console.log(`🔐 Token ajouté à la requête ${config.method?.toUpperCase()} ${config.url}`);
      }
    } else if (!token && (config.method === 'post' || config.method === 'put' || config.method === 'delete')) {
      console.error('❌ Tentative de requête authentifiée sans token disponible');
      console.error(`   Requête: ${config.method?.toUpperCase()} ${config.url}`);
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
      const token = getAuthToken();
      console.error('❌ Erreur 401 - Non autorisé');
      console.error(`   Requête: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
      if (!token) {
        console.error('   ⚠️  Aucun token trouvé');
        console.error('   Vérifiez que VITE_JWT_TOKEN est défini dans votre fichier .env');
      } else {
        console.error('   ⚠️  Token présent mais invalide ou expiré');
        console.error('   Utilisez le script: node scripts/generateToken.js dans le dossier backend');
        console.error('   Puis redémarrez le serveur de développement (npm run dev)');
      }
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
  update: (id: string, productData: CreateProductData): Promise<any> =>
    api.post(`/update/products/${id}`, productData),
  delete: (id: string): Promise<any> => api.delete(`/products/${id}`),
};

// Services pour les entreprises
export const companyService = {
  getAll: (): Promise<{ data: Company[] }> => api.get('/company'),
  getById: (id: string): Promise<{ data: Company }> => api.get(`/company/${id}`),
  getByCategory: (category: string): Promise<{ data: Company[] }> => 
    api.get(`/company/category/${category}`),
  create: (companyData: CreateCompanyData): Promise<any> => 
    api.post('/company/create', companyData),
  update: (id: string, companyData: CreateCompanyData): Promise<any> =>
    api.post(`/update/company/${id}`, companyData),
  delete: (id: string): Promise<any> => api.delete(`/company/${id}`),
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

// Service pour la vue DB4 (parcourir toutes les collections Firebase)
export const db4Service = {
  getAllCollections: (): Promise<{ 
    data: {
      success: boolean; 
      collections: Record<string, { count: number; documents: Array<{ id: string; data: any }> }>; 
      totalCollections: number;
    }
  }> => api.get('/db4'),
};

// Services d'authentification
export const authService = {
  login: async (credentials: { username: string; password: string }): Promise<{ token?: string }> => {
    const { data } = await axios.post(
      `${AUTH_BASE_URL}/auth/login`,
      credentials,
      { withCredentials: true }
    );
    // Si le backend renvoie le token (utile en dev HTTP), on le stocke aussi dans le cookie
    if (data?.token) {
      authUtils.setToken(data.token);
    }
    return data;
  },
  logout: (): void => {
    authUtils.removeToken();
  },
};

export default api;

