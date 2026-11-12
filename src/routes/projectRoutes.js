const express = require('express');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// les routes el kol houni lezemhom token
router.use(protect);

router.route('/').post(createProject).get(getProjects);
router.route('/:id').get(getProject).put(updateProject).delete(deleteProject);

module.exports = router;
