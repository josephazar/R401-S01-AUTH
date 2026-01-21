const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

// ============================================
// Fonctions MongoDB pour gérer les utilisateurs
// Ces fonctions sont FOURNIES pour simplifier le TP
// Vous devez les UTILISER dans les routes
// ============================================

/**
 * Créer un nouvel utilisateur dans MongoDB
 * Le mot de passe est automatiquement haché avec bcrypt avant l'insertion
 *
 * @param {Object} db - Référence à la base de données MongoDB
 * @param {Object} userData - Données de l'utilisateur { email, password, name }
 * @returns {Object} L'utilisateur créé avec son _id
 */
async function createUser(db, { email, password, name }) {
  // Valider que tous les champs sont présents
  if (!email || !password || !name) {
    throw new Error('Email, password et name sont requis');
  }

  // Hacher le mot de passe avec bcrypt (salt de 10 rounds)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insérer le nouvel utilisateur dans la collection 'users'
  const result = await db.collection('users').insertOne({
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    name: name.trim(),
    createdAt: new Date()
  });

  // Retourner l'utilisateur créé (sans le password)
  return {
    _id: result.insertedId,
    email: email.toLowerCase().trim(),
    name: name.trim(),
    createdAt: new Date()
  };
}

/**
 * Trouver un utilisateur par son email
 *
 * @param {Object} db - Référence à la base de données MongoDB
 * @param {string} email - Email de l'utilisateur à rechercher
 * @returns {Object|null} L'utilisateur trouvé ou null
 */
async function findUserByEmail(db, email) {
  return await db.collection('users').findOne({
    email: email.toLowerCase().trim()
  });
}

/**
 * Trouver un utilisateur par son ID
 *
 * @param {Object} db - Référence à la base de données MongoDB
 * @param {string} userId - ID de l'utilisateur (string)
 * @returns {Object|null} L'utilisateur trouvé ou null
 */
async function findUserById(db, userId) {
  return await db.collection('users').findOne({
    _id: new ObjectId(userId)
  });
}

/**
 * Comparer un mot de passe en clair avec un hash bcrypt
 *
 * @param {string} plainPassword - Mot de passe en clair
 * @param {string} hashedPassword - Mot de passe haché
 * @returns {boolean} true si les mots de passe correspondent
 */
async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Retourner un objet utilisateur sans le mot de passe
 * Utile pour les réponses API
 *
 * @param {Object} user - Objet utilisateur complet
 * @returns {Object} Utilisateur sans le champ password
 */
function userWithoutPassword(user) {
  if (!user) return null;

  // Destructurer pour exclure le password
  const { password, ...userWithoutPass } = user;
  return userWithoutPass;
}

// ============================================
// TODO 2: Utiliser ces fonctions dans routes/auth.js
// ============================================
// Ces 5 fonctions sont maintenant disponibles pour :
// - Créer un utilisateur (register)
// - Trouver un utilisateur par email (login)
// - Trouver un utilisateur par ID (middleware auth)
// - Comparer les mots de passe (login)
// - Retourner un utilisateur sans password (toutes les routes)

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  comparePassword,
  userWithoutPassword
};
