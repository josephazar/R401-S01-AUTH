const jwt = require('jsonwebtoken');
const { findUserById, userWithoutPassword } = require('../models/User');

// ============================================
// TODO 3: Middleware authenticateToken
// ============================================
// Créer un middleware pour vérifier le JWT dans le header Authorization
//
// Étapes:
// 1. Extraire le token du header Authorization (format: "Bearer TOKEN")
// 2. Vérifier si le token existe, sinon retourner 401
// 3. Vérifier et décoder le token avec jwt.verify(token, process.env.JWT_SECRET)
// 4. Récupérer l'utilisateur depuis MongoDB avec findUserById(req.app.locals.db, decoded.userId)
// 5. Exclure le password avec userWithoutPassword(user)
// 6. Ajouter l'utilisateur à req.user et appeler next()
// 7. Gérer les erreurs (TokenExpiredError, JsonWebTokenError)
//
// Structure:
const authenticateToken = async (req, res, next) => {
  try {
    // TODO: Extraire le token du header
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];

    // TODO: Vérifier si le token existe
    // if (!token) {
    //   return res.status(401).json({ error: 'Access token requis' });
    // }

    // TODO: Vérifier et décoder le token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // TODO: Récupérer l'utilisateur depuis MongoDB
    // const db = req.app.locals.db;
    // const user = await findUserById(db, decoded.userId);

    // TODO: Vérifier si l'utilisateur existe
    // if (!user) {
    //   return res.status(404).json({ error: 'Utilisateur non trouvé' });
    // }

    // TODO: Retirer le password et ajouter l'utilisateur à req
    // req.user = userWithoutPassword(user);
    // next();

    res.status(500).json({ error: 'Middleware non implémenté' });
  } catch (error) {
    // TODO: Gérer TokenExpiredError
    // if (error.name === 'TokenExpiredError') {
    //   return res.status(401).json({ error: 'Token expiré' });
    // }

    // TODO: Gérer JsonWebTokenError
    // if (error.name === 'JsonWebTokenError') {
    //   return res.status(403).json({ error: 'Token invalide' });
    // }

    res.status(500).json({
      error: 'Erreur serveur',
      message: error.message
    });
  }
};

module.exports = { authenticateToken };
