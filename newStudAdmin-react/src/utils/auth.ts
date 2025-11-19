// Gestion du token d'authentification
const TOKEN_KEY = 'newstud_admin_token';

export const authUtils = {
  // Récupérer le token depuis localStorage
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Sauvegarder le token dans localStorage
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Supprimer le token
  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Vérifier si un token existe
  hasToken: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

