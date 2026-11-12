const jwt = require('jsonwebtoken');
const User = require('../models/User');

// nasn3ou el token elli y3arref el utilisateur
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// register: nsajlou utilisateur jdid
exports.register = async (req, res) => {
  try {
    const { nom, login, password, role } = req.body || {};

    if (
      typeof nom !== 'string' ||
      typeof login !== 'string' ||
      typeof password !== 'string' ||
      !nom ||
      !login ||
      !password
    ) {
      return res.status(400).json({ message: 'nom, login et password sont obligatoires' });
    }

    // nchoufou ken el login mesta3mel men 9bal
    const exists = await User.findOne({ login });
    if (exists) {
      return res.status(400).json({ message: 'Ce login existe déjà' });
    }

    const user = await User.create({ nom, login, password, role });

    res.status(201).json({
      token: signToken(user._id),
      user: { id: user._id, nom: user.nom, login: user.login, role: user.role },
    });
  } catch (error) {
    // ghalta validation (mathalan role mouch s7i7) trajja3 400
    const status = error.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

// login: el utilisateur yod5ol
exports.login = async (req, res) => {
  try {
    const { login, password } = req.body || {};

    // lezem ykounou string bech 7ad ma yab3athelnech object w yal3ab bel requete mta3 MongoDB
    if (typeof login !== 'string' || typeof password !== 'string' || !login || !password) {
      return res.status(400).json({ message: 'login et password sont obligatoires' });
    }

    // select('+password') bech njibou el password elli mkhabbi
    const user = await User.findOne({ login }).select('+password');

    // nafs el message fel zouz 7alet bech ma na3tiwch ma3loumet lel hackers
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Login ou mot de passe incorrect' });
    }

    res.json({
      token: signToken(user._id),
      user: { id: user._id, nom: user.nom, login: user.login, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me — les infos mta3 el utilisateur elli 3amel login
exports.me = (req, res) => {
  res.json(req.user);
};

// GET /api/auth/users — l manager ychouf les utilisateurs el kol (yest7a9hom bech ya3tihom taches)
exports.getUsers = async (req, res) => {
  const users = await User.find().sort('nom');
  res.json({ total: users.length, utilisateurs: users });
};
