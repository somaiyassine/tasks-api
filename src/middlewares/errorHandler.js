// middleware lel routes elli ma l9inehomch (404)
exports.notFound = (req, res) => {
  res.status(404).json({ message: `Route introuvable: ${req.method} ${req.originalUrl}` });
};

// middleware ylemm el ghaltat el kol fi blasa wa7da w yrajja3 message mafhoum
// lezem ykoun 3andou 4 parametres bech Express ya3ref elli houwa mta3 el ghaltat
exports.errorHandler = (err, req, res, next) => {
  // ghalta validation mta3 mongoose (mathalan statut mouch s7i7 wala champ ne9es)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  // el ID elli tb3ath mouch fel forme el s7i7a mta3 MongoDB
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Valeur invalide pour ${err.path}` });
  }

  // valeur lezem tkoun unique w hiya mawjouda men 9bal (mathalan login)
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Cette valeur existe déjà' });
  }

  // el JSON elli b3athou el client mkasser
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'JSON invalide' });
  }

  // ay ghalta okhra: nektbouha fel console w nrajj3ou 500
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Erreur serveur' });
};
