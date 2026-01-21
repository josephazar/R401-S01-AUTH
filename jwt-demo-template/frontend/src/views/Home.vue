<template>
  <div>
    <nav>
      <h2>🏠 Accueil</h2>
      <button @click="handleLogout">Déconnexion</button>
    </nav>

    <div class="container">
      <h1>Bienvenue {{ user?.name }} !</h1>

      <div v-if="error" class="error">{{ error }}</div>

      <div class="user-info" v-if="profile">
        <h2>📋 Profil utilisateur</h2>
        <p><strong>ID:</strong> {{ profile._id }}</p>
        <p><strong>Nom:</strong> {{ profile.name }}</p>
        <p><strong>Email:</strong> {{ profile.email }}</p>
        <p><strong>Membre depuis:</strong> {{ formatDate(profile.createdAt) }}</p>
      </div>

      <div class="jwt-info">
        <h3>🔑 Informations JWT</h3>
        <p><strong>Token stocké dans:</strong> <code>localStorage.getItem('accessToken')</code></p>
        <p><strong>Token utilisé:</strong> Header <code>Authorization: Bearer [TOKEN]</code></p>
        <p><strong>Expiration:</strong> {{ tokenExpiry }}</p>
        <p><strong>Pas de session serveur:</strong> ✅ Stateless</p>

        <div style="margin-top: 15px; padding: 10px; background: white; border-radius: 5px; word-break: break-all; font-size: 12px;">
          <strong>Token (tronqué):</strong><br>
          <code>{{ truncatedToken }}</code>
        </div>
      </div>

      <button @click="fetchProfile" style="margin-top: 20px; background: #4caf50;">
        🔄 Recharger le profil
      </button>
    </div>
  </div>
</template>

<script>
import { authService } from '../services/api'

export default {
  name: 'Home',
  data() {
    return {
      user: null,
      profile: null,
      error: null,
      tokenExpiry: '1 heure'
    }
  },
  computed: {
    truncatedToken() {
      const token = localStorage.getItem('accessToken')
      if (!token) return 'Aucun token'
      return token.substring(0, 50) + '...' + token.substring(token.length - 20)
    }
  },
  mounted() {
    // ============================================
    // TODO 13: Charger les données utilisateur
    // ============================================
    // Au montage du composant:
    // 1. Récupérer l'utilisateur actuel avec authService.getCurrentUser()
    // 2. Appeler fetchProfile() pour charger le profil depuis l'API
    //
    // this.user = authService.getCurrentUser()
    // this.fetchProfile()
  },
  methods: {
    // ============================================
    // TODO 14: Implémenter fetchProfile
    // ============================================
    // Récupérer le profil utilisateur depuis l'API protégée
    //
    // Étapes:
    // 1. Réinitialiser error
    // 2. Appeler authService.getProfile()
    // 3. Stocker response.user dans this.profile
    // 4. En cas d'erreur, afficher le message d'erreur
    //
    async fetchProfile() {
      // TODO: Implémenter le chargement du profil
      alert('fetchProfile() non implémentée - Voir TODO 16');
    },

    // ============================================
    // TODO 15: Implémenter handleLogout
    // ============================================
    // Gérer la déconnexion
    //
    // Étapes:
    // 1. Appeler authService.logout()
    // 2. Rediriger vers /login avec this.$router.push('/login')
    //
    handleLogout() {
      // TODO: Implémenter la déconnexion
      alert('handleLogout() non implémentée - Voir TODO 17');
    },

    // Méthode utilitaire (FOURNIE)
    formatDate(dateString) {
      return new Date(dateString).toLocaleString('fr-FR')
    }
  }
}
</script>
