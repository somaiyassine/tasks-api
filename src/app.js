const express = require('express');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// hedha ykhalli el serveur yefhem el JSON elli yji mel client
app.use(express.json());

// route sghira njarbou biha ken el serveur yekhdem
app.get('/', (req, res) => {
  res.json({ message: 'API de gestion de projets et tâches 🚀' });
});

// les routes mta3 el register w el login
app.use('/api/auth', authRoutes);
// les routes mta3 les projets
app.use('/api/projects', projectRoutes);
// les routes mta3 les taches
app.use('/api/tasks', taskRoutes);

// ken el route mouch mawjouda nrajj3ou 404
app.use(notFound);
// el ghaltat el kol yet3addaw men houni (lezem ykoun houwa el lekher)
app.use(errorHandler);

module.exports = app;
