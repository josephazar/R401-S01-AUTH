import axios from 'axios';

// Configuration de base de l'API (FOURNIE)
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// ============================================
// TODO 7: Intercepteur de requête
// ============================================
// Configurer un intercepteur Axios pour ajouter automatiquement
// le token JWT à chaque requête
//
// Étapes:
// 1. Récupérer le token depuis localStorage.getItem('accessToken')
// 2. Si le token existe, l'ajouter au header Authorization (format: "Bearer TOKEN")
// 3. Retourner la config modifiée
//
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// ============================================
// TODO 8: Intercepteur de réponse
// ============================================
// Configurer un intercepteur pour gérer automatiquement
// les erreurs 401 (token expiré ou invalide)
//
// Étapes:
// 1. Si error.response?.status === 401
// 2. Supprimer le token et l'utilisateur de localStorage
// 3. Rediriger vers /login avec window.location.href
//
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // TODO: Nettoyer localStorage et rediriger
//     }
//     return Promise.reject(error);
//   }
// );

// ============================================
// TODO 9: Service d'authentification
// ============================================
// Créer un objet authService avec les méthodes suivantes:
//
export const authService = {
  // Inscription
  async register(userData) {
    // TODO: Appeler POST /auth/register
    // TODO: Sauvegarder le token et user dans localStorage
    // TODO: Retourner response.data
    throw new Error('register() non implémentée');
  },

  // Connexion
  async login(credentials) {
    // TODO: Appeler POST /auth/login
    // TODO: Sauvegarder le token et user dans localStorage
    // TODO: Retourner response.data
    throw new Error('login() non implémentée');
  },

  // Déconnexion
  logout() {
    // TODO: Supprimer accessToken et user de localStorage
    throw new Error('logout() non implémentée');
  },

  // Obtenir le profil
  async getProfile() {
    // TODO: Appeler GET /auth/profile
    // TODO: Retourner response.data
    throw new Error('getProfile() non implémentée');
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    // TODO: Retourner true si accessToken existe dans localStorage
    return false;
  },

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    // TODO: Récupérer et parser 'user' depuis localStorage
    // TODO: Retourner l'objet user ou null
    return null;
  }
};

export default api;
