const mongoose = require('mongoose');

// les statuts elli ynajem ykoun fihom el projet
const STATUTS_PROJET = ['en cours', 'terminé', 'en pause'];

const projectSchema = new mongoose.Schema(
  {
    // esm el projet lezem yet3ammer
    nom: { type: String, required: [true, 'Le nom du projet est obligatoire'], trim: true },
    description: { type: String, trim: true, default: '' },
    // moula el projet: el ID mta3 el utilisateur elli san3ou
    proprietaire: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    statut: {
      type: String,
      enum: {
        values: STATUTS_PROJET,
        message: `Le statut doit être : ${STATUTS_PROJET.join(' - ')}`,
      },
      default: 'en cours',
    },
  },
  // nsammiw tarikh el creation dateCreation
  { timestamps: { createdAt: 'dateCreation', updatedAt: false } }
);

module.exports = mongoose.model('Project', projectSchema);
