// n7ammlou les variables mta3 el fichier .env
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// fel lowel nconnectiw bel base de donnees, w ba3d nlanciw el serveur
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log( `Serveur lancé sur le port ${PORT}` );
  });
});
