const jwt = require('jsonwebtoken');
const User = require('../models/User');

// middleware yet2akked elli el utilisateur 3amel login
exports.protect = async (req, res, next) => {
  // el token yji fel header bel forme hedhi: Bearer xxxxx
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // njibou el utilisateur mel base de donnees w n7ottouh fi req.user
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};