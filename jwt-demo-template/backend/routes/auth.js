const express = require('express');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, comparePassword, userWithoutPassword } = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Fonction pour générer un JWT (FOURNIE)
const generateToken = (userId) => {
  return jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
};

// ============================================
// TODO 4: Route POST /register - Inscription
// ============================================
// Créer une route pour inscrire un nouvel utilisateur
//
// Étapes:
// 1. Récupérer la db depuis req.app.locals.db (MongoDB fourni)
// 2. Extraire email, password, name du req.body
// 3. Valider que tous les champs sont présents
// 4. Vérifier si l'email existe déjà avec findUserByEmail(db, email)
// 5. Créer l'utilisateur avec createUser(db, { email, password, name })
// 6. Générer un token JWT avec generateToken(user._id)
// 7. Retourner le token et l'utilisateur (sans password)
//
router.post('/register', async (req, res) => {
  try {
    // TODO: Récupérer la db
    // const db = req.app.locals.db;
    // const { email, password, name } = req.body;

    // TODO: Validation
    // if (!email || !password || !name) {
    //   return res.status(400).json({ error: 'Email, password et name requis' });
    // }

    // TODO: Vérifier email existant
    // const existingUser = await findUserByEmail(db, email);
    // if (existingUser) {
    //   return res.status(409).json({ error: 'Email déjà utilisé' });
    // }

    // TODO: Créer utilisateur
    // const user = await createUser(db, { email, password, name });

    // TODO: Générer token
    // const token = generateToken(user._id);

    // TODO: Retourner réponse
    // res.status(201).json({
    //   message: 'Compte créé avec succès',
    //   user: userWithoutPassword(user),
    //   token,
    //   expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    // });

    res.status(500).json({ error: 'Route non implémentée' });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: error.message
    });
  }
});

// ============================================
// TODO 5: Route POST /login - Connexion
// ============================================
// Créer une route pour connecter un utilisateur existant
//
// Étapes:
// 1. Récupérer la db depuis req.app.locals.db (MongoDB fourni)
// 2. Extraire email et password du req.body
// 3. Valider que les champs sont présents
// 4. Trouver l'utilisateur avec findUserByEmail(db, email)
// 5. Vérifier que l'utilisateur existe
// 6. Comparer le password avec comparePassword(password, user.password)
// 7. Générer un token JWT avec generateToken(user._id)
// 8. Retourner le token et l'utilisateur (sans password)
//
router.post('/login', async (req, res) => {
  try {
    // TODO: Récupérer la db
    // const db = req.app.locals.db;
    // const { email, password } = req.body;

    // TODO: Validation
    // if (!email || !password) {
    //   return res.status(400).json({ error: 'Email et password requis' });
    // }

    // TODO: Trouver utilisateur
    // const user = await findUserByEmail(db, email);
    // if (!user) {
    //   return res.status(401).json({ error: 'Email ou password incorrect' });
    // }

    // TODO: Vérifier password
    // const isPasswordValid = await comparePassword(password, user.password);
    // if (!isPasswordValid) {
    //   return res.status(401).json({ error: 'Email ou password incorrect' });
    // }

    // TODO: Générer token
    // const token = generateToken(user._id);

    // TODO: Retourner réponse
    // res.json({
    //   message: 'Connexion réussie',
    //   user: userWithoutPassword(user),
    //   token,
    //   expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    // });

    res.status(500).json({ error: 'Route non implémentée' });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: error.message
    });
  }
});

// ============================================
// TODO 6: Route GET /profile - Profil protégé
// ============================================
// Créer une route protégée qui retourne le profil de l'utilisateur connecté
//
// Indications:
// - Utiliser le middleware authenticateToken (TODO 3)
// - L'utilisateur est disponible dans req.user (ajouté par le middleware)
// - Retourner simplement req.user
//
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    // TODO: Retourner le profil utilisateur
    // L'utilisateur est dans req.user (ajouté par authenticateToken)
    // res.json({ message: 'Profil utilisateur', user: req.user });

    res.status(500).json({ error: 'Route non implémentée' });
  } catch (error) {
    res.status(500).json({
      error: 'Erreur serveur',
      message: error.message
    });
  }
});

// GET /users - Liste des utilisateurs (debug) - FOURNIE
router.get('/users', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const users = await db.collection('users').find({}).project({ password: 0 }).toArray();
    res.json({
      message: 'Liste des utilisateurs',
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erreur serveur',
      message: error.message
    });
  }
});

module.exports = router;
