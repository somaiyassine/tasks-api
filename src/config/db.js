const mongoose = require('mongoose');

// el fonction hedhi ta3mel el connexion m3a el base de donnees MongoDB
const connectDB = async () => {
  try {
    // nesta3mlou el lien elli mawjoud fel fichier .env
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecté ✅');
  } catch (error) {
    // ken sar mochkol fel connexion ntal3ou el ghalta w nwa9fou el programme
    console.error('Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;