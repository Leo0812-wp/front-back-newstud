// Gestion du token d'authentification via cookies (compatible HTTP en dev)
const TOKEN_KEY = 'newstud_admin_token';
const COOKIE_MAX_AGE_DAYS = 7;

const encode = (value: string) => encodeURIComponent(value);

const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(';').map((c) => c.trim());
  const entry = cookies.find((c) => c.startsWith(`${name}=`));
  if (!entry) return null;
  const [, value] = entry.split('=');
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const setCookie = (name: string, value: string, maxAgeDays = COOKIE_MAX_AGE_DAYS) => {
  const maxAgeSeconds = maxAgeDays * 24 * 60 * 60;
  // Pas de flag Secure pour permettre l'usage en HTTP durant le dev local
  document.cookie = `${name}=${encode(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
};

export const authUtils = {
  // Récupérer le token depuis le cookie (fallback localStorage/env pour compatibilité)
  getToken: (): string | null => {
    const cookieToken = getCookie(TOKEN_KEY);
    if (cookieToken) return cookieToken;
    return localStorage.getItem(TOKEN_KEY);
  },

  // Sauvegarder le token dans un cookie
  setToken: (token: string): void => {
    setCookie(TOKEN_KEY, token);
    // On conserve localStorage en secours pour les environnements existants
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Supprimer le token
  removeToken: (): void => {
    deleteCookie(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },

  // Vérifier si un token existe
  hasToken: (): boolean => {
    return !!getCookie(TOKEN_KEY) || !!localStorage.getItem(TOKEN_KEY);
  },
};

