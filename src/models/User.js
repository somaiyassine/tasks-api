const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    login: { type: String, required: true, unique: true, trim: true },
    // select: false ya3ni el password ma yarja3ch ki na3mlou find
    password: { type: String, required: true, minlength: 6, select: false },
    // el role ya user ya manager
    role: { type: String, enum: ['user', 'manager'], default: 'user' },
  },
  // nsammiw tarikh el creation dateCreation
  { timestamps: { createdAt: 'dateCreation', updatedAt: false } }
);

// 9bal ma nsajlou el user, na3mlou crypt lel mot de passe
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// fonction t9aren el password elli ketbou el utilisateur bel password el mcrypti
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);