const mongoose = require('mongoose');

// el statut mta3 el tache ma ynajemch yokhroj 3la hedhom el thletha
const STATUTS_TACHE = ['todo', 'doing', 'done'];

const taskSchema = new mongoose.Schema(
  {
    // el titre lezem yet3ammer
    titre: { type: String, required: [true, 'Le titre est obligatoire'], trim: true },
    description: { type: String, trim: true, default: '' },
    statut: {
      type: String,
      enum: {
        values: STATUTS_TACHE,
        message: `Le statut doit être : ${STATUTS_TACHE.join(' - ')}`,
      },
      default: 'todo',
    },
    // ekher ajel bech tekmel el tache
    deadline: { type: Date },
    // kol tache lezem tkoun teb3a projet
    projet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Le projet associé est obligatoire'],
    },
    // el utilisateur elli t3attlou el tache (l manager barka ynajem y7ottou)
    utilisateurAssigne: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  // nsammiw tarikh el creation dateCreation
  { timestamps: { createdAt: 'dateCreation', updatedAt: false } }
);

module.exports = mongoose.model('Task', taskSchema);
