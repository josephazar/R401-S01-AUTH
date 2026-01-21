<template>
  <div class="container">
    <h1>🔐 Connexion</h1>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">{{ success }}</div>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          placeholder="jean.dupont@example.com"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          v-model="form.password"
          placeholder="Votre mot de passe"
          required
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>
    </form>

    <div class="link">
      Pas encore de compte ? <router-link to="/register">S'inscrire</router-link>
    </div>

    <div class="jwt-info">
      <h3>💡 Démo JWT</h3>
      <p>
        ✅ Après connexion, un <strong>Access Token</strong> JWT est stocké<br>
        ✅ Ce token est envoyé dans le header <code>Authorization: Bearer ...</code><br>
        ✅ Le serveur vérifie le token sans consulter de session
      </p>
    </div>
  </div>
</template>

<script>
import { authService } from '../services/api'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      error: null,
      success: null,
      loading: false
    }
  },
  methods: {
    // ============================================
    // TODO 12: Implémenter handleLogin
    // ============================================
    // Gérer la soumission du formulaire de connexion
    //
    // Étapes:
    // 1. Réinitialiser error et success
    // 2. Mettre loading à true
    // 3. Appeler authService.login(this.form)
    // 4. En cas de succès: afficher message et rediriger vers /home
    // 5. En cas d'erreur: afficher le message d'erreur
    // 6. Remettre loading à false
    //
    async handleLogin() {
      // TODO: Implémenter la logique de connexion
      alert('handleLogin() non implémentée - Voir TODO 14');
    }
  }
}
</script>
