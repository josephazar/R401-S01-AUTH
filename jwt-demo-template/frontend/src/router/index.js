import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '../services/api'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

// Définition des routes (FOURNIE)
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ============================================
// TODO 10: Navigation Guard
// ============================================
// Implémenter un navigation guard pour protéger les routes
//
// Logique:
// 1. Vérifier si l'utilisateur est authentifié avec authService.isAuthenticated()
// 2. Si la route nécessite authentification (requiresAuth) ET non connecté:
//    → Rediriger vers /login
// 3. Si la route nécessite d'être déconnecté (requiresGuest) ET connecté:
//    → Rediriger vers /home
// 4. Sinon, laisser passer avec next()
//
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = authService.isAuthenticated()
//
//   if (to.meta.requiresAuth && !isAuthenticated) {
//     next('/login')
//   } else if (to.meta.requiresGuest && isAuthenticated) {
//     next('/home')
//   } else {
//     next()
//   }
// })

export default router
