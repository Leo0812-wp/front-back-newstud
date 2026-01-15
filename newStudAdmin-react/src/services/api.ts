import axios from 'axios';
import { Product, Company, CreateVoucherData, Voucher, UpdateVoucherData, CreateProductData, CreateCompanyData, User } from '../types';

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

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // permet d'envoyer les cookies (même en HTTP en dev)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ Erreur 401 - Non autorisé');
      console.error(`   Requête: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
      console.error('   ⚠️  Session expirée ou cookie absent');
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

// Services pour les utilisateurs/clients
export const userService = {
  getAll: (): Promise<{ data: User[] }> => api.get('/user'),
  getById: (id: string): Promise<{ data: User }> => api.get(`/user/${id}`),
};

// Services d'authentification
export const authService = {
  login: async (credentials: { username: string; password: string; rememberMe?: boolean }): Promise<{ token?: string }> => {
    const { data } = await axios.post(
      `${AUTH_BASE_URL}/auth/login`,
      credentials,
      { withCredentials: true }
    );
    return data;
  },
  me: async (): Promise<{ authenticated: boolean }> => {
    const { data } = await axios.get(`${AUTH_BASE_URL}/auth/me`, { withCredentials: true });
    return data;
  },
  logout: async (): Promise<void> => {
    await axios.post(`${AUTH_BASE_URL}/auth/logout`, {}, { withCredentials: true });
  },
};

export default api;
