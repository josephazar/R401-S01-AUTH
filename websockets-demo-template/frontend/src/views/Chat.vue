<template>
  <div class="page chat-page">
    <!-- Partie principale du chat -->
    <div class="chat-main">
      <!-- En-tête du chat -->
      <div class="chat-header">
        <div>
          <h2>#{{ room }}</h2>
        </div>
        <div class="chat-header-actions">
          <button @click="goBackToRooms">Changer de salon</button>
          <button @click="logout" class="btn-danger">Se déconnecter</button>
        </div>
      </div>

      <!-- Conteneur des messages -->
      <div ref="messagesContainer" class="messages-container">
        <div v-for="(msg, index) in messages" :key="index">
          <!-- Messages système -->
          <div v-if="msg.type === 'system'" class="message-system">
            {{ msg.message }}
          </div>

          <!-- Messages utilisateur -->
          <div v-else class="message-user" :class="{ own: msg.username === username }">
            <div class="message-content">
              <div v-if="msg.username !== username" class="message-username">
                {{ msg.username }}
              </div>
              <div class="message-text">{{ msg.message }}</div>
              <div class="message-time">
                {{ formatTime(msg.timestamp) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Indicateur de frappe -->
        <div v-if="typingUser" class="typing-indicator">
          <span>{{ typingUser }} est en train d'écrire</span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>

      <!-- Zone de saisie -->
      <div class="input-container">
        <div class="input-wrapper">
          <input
            v-model="inputMessage"
            type="text"
            placeholder="Écrivez un message..."
            @keyup.enter="sendMessage"
            @input="handleTyping"
          />
          <button @click="sendMessage" :disabled="!inputMessage.trim()">
            Envoyer
          </button>
        </div>
      </div>
    </div>

    <!-- Barre latérale - Utilisateurs en ligne -->
    <div class="sidebar">
      <div class="sidebar-header">
        👥 En ligne ({{ onlineUsers.length }})
      </div>
      <div class="online-users">
        <div v-if="onlineUsers.length > 0">
          <div v-for="user in onlineUsers" :key="user" class="user-item">
            <div class="user-item-dot"></div>
            <span>{{ user }}</span>
            <span v-if="user === username" style="font-size: 0.8rem; color: #7f8c8d;">
              (vous)
            </span>
          </div>
        </div>
        <div v-else class="no-users">
          Aucun utilisateur en ligne
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import socketioService, { apiUrl } from '../services/socketio';

const router = useRouter();
const route = useRoute();

// Récupérer le nom du salon depuis les paramètres de route
const room = computed(() => route.params.room);

const username = ref('');
const messages = ref([]);
const inputMessage = ref('');
const onlineUsers = ref([]);
const typingUser = ref(null);
const typingTimeout = ref(null);
const messagesContainer = ref(null);

// Sélectionner le service WebSocket (Socket.IO ou WebSocket natif)
// Changez ici pour basculer entre les deux implémentations
const wsService = socketioService;

/**
 * Formate un horodatage pour l'affichage
 */
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Charge l'historique des messages du salon
 */
const loadMessageHistory = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/messages/${room.value}`);
    if (response.ok) {
      messages.value = await response.json();
      // Scroller vers le bas
      await nextTick();
      scrollToBottom();
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l\'historique:', error);
  }
};

/**
 * TODO 9: Rejoindre le salon via WebSocket
 * À faire:
 *   - Émettre l'événement 'join room' avec { username, room }
 *   - Puis charger l'historique des messages via l'API REST
 *   - Indice: wsService.emit('join room', {...})
 */
const joinRoom = () => {
  // TODO 9: Implémenter la logique de join room
};

/**
 * TODO 8: Envoyer un message via Socket.IO
 * À faire:
 *   - Émettre l'événement 'chat message' avec { username, message, room }
 *   - Vider le champ de saisie inputMessage.value = ''
 *   - Émettre 'stop typing' pour arrêter l'indicateur
 *   - Réinitialiser typingUser
 *   - Indice: wsService.emit('chat message', {...})
 */
const sendMessage = () => {
  const message = inputMessage.value.trim();

  if (message.length === 0) return;

  // TODO 8: Implémenter la logique d'envoi de message ici

};

/**
 * TODO 10: Gérer l'indicateur de frappe
 * À faire:
 *   - Émettre 'typing' quand l'utilisateur tape
 *   - Réinitialiser le timeout
 *   - Émettre 'stop typing' après 2 secondes d'inactivité avec setTimeout
 *   - Indice: wsService.emit('typing', {...})
 */
const handleTyping = () => {
  // TODO 10: Implémenter la logique de frappe ici

};

/**
 * Scroller automatiquement vers le bas
 */
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

/**
 * Revient à la sélection de salons
 */
const goBackToRooms = () => {
  router.push({ name: 'RoomSelector' });
};

/**
 * Déconnecte l'utilisateur
 */
const logout = () => {
  if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
    wsService.disconnect();
    localStorage.removeItem('username');
    router.push({ name: 'Login' });
  }
};

/**
 * Initialise le composant
 */
onMounted(async () => {
  // Récupérer le nom d'utilisateur
  const storedUsername = localStorage.getItem('username');
  if (storedUsername) {
    username.value = storedUsername;
  } else {
    // Rediriger vers login si pas connecté
    router.push({ name: 'Login' });
    return;
  }

  // Connecter au service WebSocket
  try {
    if (typeof wsService.connect === 'function') {
      await wsService.connect();
    }
  } catch (error) {
    console.error('Erreur de connexion WebSocket:', error);
  }

  // Charger l'historique des messages
  await loadMessageHistory();

  // Rejoindre le salon
  joinRoom();

  // ============================================
  // TODO 7: ÉCOUTER LES ÉVÉNEMENTS WEBSOCKET
  // ============================================
  // À faire:
  // - Écouter 'chat message': ajouter à messages et scroller
  // - Écouter 'user joined': ajouter message système
  // - Écouter 'user left': ajouter message système
  // - Écouter 'online users': mettre à jour onlineUsers
  // - Écouter 'typing': afficher l'indicateur
  // - Écouter 'stop typing': masquer l'indicateur
  // - Écouter 'error': afficher une alerte
  //
  // Indice: wsService.on('event name', (data) => { ... })

  // Recevoir un nouveau message
  // TODO 7a: Écouter 'chat message'

  // Utilisateur a rejoint
  // TODO 7b: Écouter 'user joined'

  // Utilisateur a quitté
  // TODO 7c: Écouter 'user left'

  // Mise à jour de la liste des utilisateurs en ligne
  // TODO 7d: Écouter 'online users'

  // Indicateur de frappe
  // TODO 7e: Écouter 'typing'

  // Arrêter l'indicateur de frappe
  // TODO 7f: Écouter 'stop typing'

  // Erreur
  // TODO 7g: Écouter 'error'
});

/**
 * Nettoie quand le composant est détruit
 */
onUnmounted(() => {
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value);
  }

  // Optionnel: déconnecter du WebSocket
  // wsService.disconnect();
});
</script>

<style scoped>
/* Les styles sont définis dans style.css */
</style>
