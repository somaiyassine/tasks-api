const express = require('express');
const { register, login, me, getUsers } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/roles');

const router = express.Router();

// hedhom ma7loulin lel nes el kol
router.post('/register', register);
router.post('/login', login);

// hedhom lezemhom token
router.get('/me', protect, me);
// la liste mta3 les utilisateurs lel manager barka
router.get('/users', protect, restrictTo('manager'), getUsers);

module.exports = router;
