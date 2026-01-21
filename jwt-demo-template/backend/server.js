require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// TODO 1: Configuration CORS
// ============================================
// Configurer CORS pour autoriser le frontend Vue.js
// Indice: utiliser corsOptions avec origin, credentials
// const corsOptions = {
//   origin: ...,
//   credentials: ...,
//   optionsSuccessStatus: ...
// };

app.use(cors()); // À REMPLACER par app.use(cors(corsOptions))
app.use(express.json());

// ============================================
// Connexion MongoDB (FOURNIE)
// ============================================
// Créer un client MongoDB et se connecter à la base de données
// La référence 'db' est stockée dans app.locals pour être accessible dans les routes
const client = new MongoClient(process.env.MONGODB_URI);

client.connect()
  .then(() => {
    console.log('✅ MongoDB connecté');
    // Stocker la référence de la base de données pour l'utiliser dans les routes
    app.locals.db = client.db();
  })
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({
    message: '🎓 JWT Demo - Backend Express + MongoDB',
    endpoints: {
      'POST /api/auth/register': 'Créer un compte',
      'POST /api/auth/login': 'Se connecter',
      'GET /api/auth/profile': 'Profil (protégé par JWT)',
      'GET /api/auth/users': 'Liste utilisateurs (debug)'
    },
    database: 'MongoDB localhost:27017',
    jwt: 'Access Token uniquement (pas de session)',
    cors: 'Configuré pour Vue.js'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📊 Base de données: ${process.env.MONGODB_URI}`);
  console.log(`🌐 Frontend autorisé: ${process.env.FRONTEND_URL}`);
});
