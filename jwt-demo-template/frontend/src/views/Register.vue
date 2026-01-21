<template>
  <div class="container">
    <h1>🎓 Inscription</h1>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">{{ success }}</div>

    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="name">Nom complet</label>
        <input
          type="text"
          id="name"
          v-model="form.name"
          placeholder="Jean Dupont"
          required
        />
      </div>

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
          placeholder="Min 6 caractères"
          required
          minlength="6"
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Inscription...' : 'S\'inscrire' }}
      </button>
    </form>

    <div class="link">
      Déjà un compte ? <router-link to="/login">Se connecter</router-link>
    </div>

    <div class="jwt-info">
      <h3>💡 JWT Demo</h3>
      <p>
        ✅ Pas de session serveur<br>
        ✅ Token stocké dans <code>localStorage</code><br>
        ✅ MongoDB pour les utilisateurs uniquement
      </p>
    </div>
  </div>
</template>

<script>
import { authService } from '../services/api'

export default {
  name: 'Register',
  data() {
    return {
      form: {
        name: '',
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
    // TODO 11: Implémenter handleRegister
    // ============================================
    // Gérer la soumission du formulaire d'inscription
    //
    // Étapes:
    // 1. Réinitialiser error et success
    // 2. Mettre loading à true
    // 3. Appeler authService.register(this.form)
    // 4. En cas de succès: afficher message et rediriger vers /home
    // 5. En cas d'erreur: afficher le message d'erreur
    // 6. Remettre loading à false
    //
    async handleRegister() {
      // TODO: Implémenter la logique d'inscription
      alert('handleRegister() non implémentée - Voir TODO 13');
    }
  }
}
</script>
