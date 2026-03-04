// Backend Socket.IO - Application chat en temps réel
// VERSION TEMPLATE (60% complète) - Les étudiants doivent compléter les TODOs
require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { connectDB, getDB } = require('./db/connection');

// Configuration de l'application Express
const app = express();
const server = http.createServer(app);

// Configuration de Socket.IO avec CORS
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
});

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// ============================================
// GESTION DES UTILISATEURS EN LIGNE
// ============================================
// Structure: Map<room, Map<socketId, username>>
const onlineUsers = new Map();

/**
 * Ajoute un utilisateur à un salon
 * @param {string} socketId - Identifiant du socket
 * @param {string} username - Nom d'utilisateur
 * @param {string} room - Nom du salon
 */
function addUserToRoom(socketId, username, room) {
  if (!onlineUsers.has(room)) {
    onlineUsers.set(room, new Map());
  }
  onlineUsers.get(room).set(socketId, username);
}

/**
 * Retire un utilisateur d'un salon
 * @param {string} socketId - Identifiant du socket
 * @param {string} room - Nom du salon
 */
function removeUserFromRoom(socketId, room) {
  if (onlineUsers.has(room)) {
    onlineUsers.get(room).delete(socketId);
    // Si le salon est vide, le supprimer
    if (onlineUsers.get(room).size === 0) {
      onlineUsers.delete(room);
    }
  }
}

/**
 * Récupère la liste des utilisateurs uniques dans un salon
 * @param {string} room - Nom du salon
 * @returns {Array<string>} Liste des noms d'utilisateur
 */
function getUsersInRoom(room) {
  if (!onlineUsers.has(room)) return [];
  // Retourner la liste unique des utilisateurs
  return [...new Set(onlineUsers.get(room).values())];
}

// ============================================
// ROUTES REST API
// ============================================

/**
 * GET /api/messages/:room
 * Récupère l'historique des messages d'un salon
 */
app.get('/api/messages/:room', async (req, res) => {
  try {
    const db = getDB();
    const messages = await db.collection('messages')
      .find({ room: req.params.room })
      .sort({ timestamp: 1 })
      .limit(50)
      .toArray();
    res.json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/rooms
 * Récupère la liste des salons disponibles
 */
app.get('/api/rooms', async (req, res) => {
  try {
    const db = getDB();
    // Récupérer les salons uniques depuis la base de données
    const roomsFromDB = await db.collection('messages').distinct('room');
    // Combiner avec les salons par défaut
    const defaultRooms = ['general', 'javascript', 'random'];
    const allRooms = [...new Set([...defaultRooms, ...roomsFromDB])];
    res.json(allRooms);
  } catch (error) {
    console.error('Erreur lors de la récupération des salons:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/health
 * Vérifier que le serveur fonctionne
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', backend: 'socketio' });
});

// ============================================
// GESTION DES SOCKET.IO EVENTS
// ============================================

// TODO 1: Configurer le gestionnaire de connexion Socket.IO
// Quand un client se connecte, afficher son socket.id dans la console
// Indice: io.on('connection', (socket) => { ... })
// Dans ce gestionnaire, vous déclarerez: let currentRoom = null; let currentUsername = null;
io.on('connection', (socket) => {
  // TODO 1: Afficher un message de connexion
  // Exemple: console.log(`✅ Utilisateur connecté: ${socket.id}`);

  let currentRoom = null;
  let currentUsername = null;

  /**
   * TODO 2: Gérer l'événement 'join room'
   *
   * Le client envoie: { username, room }
   * À faire:
   *   1. Si l'utilisateur était dans un autre salon, le quitter d'abord
   *      - Appeler socket.leave(currentRoom)
   *      - Appeler removeUserFromRoom(socket.id, currentRoom)
   *      - Notifier les autres utilisateurs du salon: socket.to(currentRoom).emit('user left', {...})
   *      - Envoyer la liste mise à jour: io.to(currentRoom).emit('online users', ...)
   *      - Sauvegarder un message système dans MongoDB
   *
   *   2. Rejoindre le nouveau salon
   *      - Mettre à jour currentRoom et currentUsername
   *      - Appeler socket.join(room)
   *      - Appeler addUserToRoom(socket.id, username, room)
   *      - Notifier les autres utilisateurs: socket.to(room).emit('user joined', {...})
   *      - Envoyer la liste des utilisateurs: io.to(room).emit('online users', ...)
   *      - Sauvegarder un message système dans MongoDB
   *
   * Indice: Les messages système ont type: 'system', username: 'Système'
   */
  socket.on('join room', async ({ username, room }) => {
    try {
      // TODO 2: Implémenter la logique de join room ici

      console.log(`👤 ${username} a rejoint le salon "${room}"`);
    } catch (error) {
      console.error('Erreur lors de la connexion au salon:', error);
      socket.emit('error', { message: 'Erreur lors de la connexion au salon' });
    }
  });

  /**
   * TODO 3: Gérer l'événement 'chat message'
   *
   * Le client envoie: { username, message, room }
   * À faire:
   *   1. Ignorer les messages vides (if (!message.trim()) return;)
   *   2. Sauvegarder le message dans MongoDB
   *      - Collection: 'messages'
   *      - Champs: { username, message, room, type: 'user', timestamp: new Date() }
   *   3. Diffuser le message à tous les clients du salon
   *      - Utiliser: io.to(room).emit('chat message', messageDoc)
   *   4. Afficher un log dans la console
   *      - Exemple: console.log(`💬 [${room}] ${username}: ${message}`);
   */
  socket.on('chat message', async ({ username, message, room }) => {
    try {
      // TODO 3: Implémenter la logique de chat message ici

    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du message:', error);
      socket.emit('error', { message: 'Erreur lors de l\'envoi du message' });
    }
  });

  /**
   * TODO 4: Gérer les événements 'typing' et 'stop typing'
   *
   * Événement 'typing': le client envoie { username, room }
   *   - Notifier les AUTRES utilisateurs du salon qu'on est en train d'écrire
   *   - Indice: socket.to(room).emit('typing', { username })
   *
   * Événement 'stop typing': le client envoie { room }
   *   - Notifier les AUTRES utilisateurs du salon qu'on a arrêté
   *   - Indice: socket.to(room).emit('stop typing')
   */
  socket.on('typing', ({ username, room }) => {
    // TODO 4a: Gérer l'événement 'typing'

  });

  socket.on('stop typing', ({ room }) => {
    // TODO 4b: Gérer l'événement 'stop typing'

  });

  /**
   * TODO 5: Gérer la déconnexion d'un utilisateur
   *
   * Appelé automatiquement par Socket.IO quand un utilisateur se déconnecte
   * À faire:
   *   1. Si l'utilisateur était dans un salon (currentRoom && currentUsername):
   *      - Retirer l'utilisateur: removeUserFromRoom(socket.id, currentRoom)
   *      - Notifier les autres: io.to(currentRoom).emit('user left', {...})
   *      - Envoyer la liste mise à jour: io.to(currentRoom).emit('online users', ...)
   *      - Sauvegarder un message système dans MongoDB
   *   2. Afficher un log de déconnexion
   *      - Exemple: console.log(`❌ Utilisateur déconnecté: ${socket.id}`);
   */
  socket.on('disconnect', async () => {
    // TODO 5: Implémenter la logique de disconnect ici

  });

  /**
   * Événement: error (pour les erreurs socket)
   */
  socket.on('error', (error) => {
    console.error(`⚠️ Erreur socket [${socket.id}]:`, error);
  });
});

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================

async function start() {
  try {
    // Connecter à MongoDB
    await connectDB();

    // Démarrer le serveur
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`🚀 Serveur Socket.IO démarré sur http://localhost:${PORT}`);
      console.log(`📌 FRONTEND_URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`📊 Backend: Socket.IO (VERSION TEMPLATE)`);
    });
  } catch (error) {
    console.error('❌ Erreur au démarrage du serveur:', error);
    process.exit(1);
  }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejetée non gérée:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Exception non capturée:', error);
  process.exit(1);
});

// Démarrer le serveur
start();
