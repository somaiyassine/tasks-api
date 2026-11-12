const express = require('express');
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  assignTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/roles');

const router = express.Router();

// les routes el kol houni lezemhom token
router.use(protect);

router.route('/').post(createTask).get(getTasks);

// l manager barka ynajem ya3ti tache l utilisateur
router.patch('/:id/assign', restrictTo('manager'), assignTask);

router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
