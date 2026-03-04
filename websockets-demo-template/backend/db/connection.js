// Connexion à MongoDB avec le driver natif
const { MongoClient } = require('mongodb');

let db;

/**
 * Établit la connexion à MongoDB
 * @returns {Promise<Database>} Instance de la base de données
 */
async function connectDB() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    db = client.db(process.env.DB_NAME || 'websockets-demo');

    console.log('✅ MongoDB connecté avec succès');

    // Créer un index pour améliorer les performances des requêtes
    await db.collection('messages').createIndex({ room: 1, timestamp: 1 });
    console.log('📑 Index créé sur la collection messages');

    return db;
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
}

/**
 * Récupère l'instance de la base de données
 * @returns {Database} Instance de la base de données
 * @throws {Error} Si la base de données n'est pas connectée
 */
function getDB() {
  if (!db) {
    throw new Error('Base de données non connectée. Appelez connectDB() d\'abord.');
  }
  return db;
}

module.exports = { connectDB, getDB };
