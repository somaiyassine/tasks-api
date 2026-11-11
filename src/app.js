const express = require('express');

const app = express();

// هذا يخلي السيرفر يفهم الـ JSON اللي يجي من الـ client
app.use(express.json());

// route بسيطة نجربو بيها كان السيرفر يخدم
app.get('/', (req, res) => {
  res.json({ message: 'API de gestion de projets et tâches 🚀' });
});

module.exports = app;