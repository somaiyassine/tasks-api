const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { buildSearch, buildSort } = require('../utils/query');

// les champs elli ynajem el utilisateur yratteb bihom les taches
const SORT_FIELDS = ['titre', 'statut', 'deadline', 'dateCreation'];

const isManager = (user) => user.role === 'manager';

// njibou les infos mta3 el projet w el utilisateur m3a el tache
// (tekhdem m3a el query w m3a el document)
const populateTask = (target) =>
  target.populate([
    { path: 'projet', select: 'nom statut proprietaire' },
    { path: 'utilisateurAssigne', select: 'nom login' },
  ]);

// net2akdou elli el utilisateur elli bech na3tiwah el tache mawjoud
// ken mouch mawjoud nab3thou el reponse w nrajj3ou false
const checkAssignee = async (userId, res) => {
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ message: 'Utilisateur à assigner introuvable' });
    return false;
  }
  return true;
};

// nal9aw el tache w net2akdou elli el utilisateur 3andou el 7a9 fiha
// el 7a9 3and: l manager, moula el projet, w el utilisateur elli t3attlou el tache
// ownerOnly = true ya3ni elli t3attlou el tache ma yekfich (mathalan fel suppression)
const findTaskOr404 = async (req, res, { ownerOnly = false } = {}) => {
  const task = await Task.findById(req.params.id).populate('projet', 'nom statut proprietaire');

  if (!task) {
    res.status(404).json({ message: 'Tâche introuvable' });
    return null;
  }

  const user = req.user;
  const isOwner = task.projet && task.projet.proprietaire.equals(user._id);
  const isAssignee =
    !ownerOnly && task.utilisateurAssigne && task.utilisateurAssigne.equals(user._id);

  if (!isManager(user) && !isOwner && !isAssignee) {
    res.status(403).json({ message: 'Accès refusé à cette tâche' });
    return null;
  }
  return task;
};

// POST /api/tasks — nasn3ou tache fi projet
exports.createTask = async (req, res) => {
  const { titre, description, statut, deadline, projet, utilisateurAssigne } = req.body || {};

  if (!projet) {
    return res.status(400).json({ message: 'Le projet associé est obligatoire' });
  }

  // el tache lezem tkoun teb3a projet mawjoud
  const project = await Project.findById(projet);
  if (!project) {
    return res.status(404).json({ message: 'Projet introuvable' });
  }

  // el user el 3adi yzid taches fi les projets mte3ou barka, w l manager fi ay projet
  if (!isManager(req.user) && !project.proprietaire.equals(req.user._id)) {
    return res.status(403).json({ message: 'Accès refusé : ce projet ne vous appartient pas' });
  }

  // l manager barka ynajem ya3ti el tache l utilisateur
  if (utilisateurAssigne) {
    if (!isManager(req.user)) {
      return res
        .status(403)
        .json({ message: 'Seul le manager peut affecter une tâche à un utilisateur' });
    }
    if (!(await checkAssignee(utilisateurAssigne, res))) return;
  }

  const task = await Task.create({
    titre,
    description,
    statut,
    deadline,
    projet: project._id,
    utilisateurAssigne: utilisateurAssigne || null,
  });

  res.status(201).json(task);
};

// GET /api/tasks — la liste mta3 les taches m3a recherche w tri
// ?search=...&statut=todo&projet=ID&utilisateurAssigne=ID&sort=deadline
exports.getTasks = async (req, res) => {
  const { search, statut, projet, utilisateurAssigne, sort } = req.query;

  // nlemmou les conditions el kol fi $and bech ma yetkhaltouch m3a b3adhhom
  const conditions = [];

  // el user el 3adi ychouf barka les taches mta3 les projets mte3ou w les taches elli t3attawlou
  if (!isManager(req.user)) {
    const myProjects = await Project.find({ proprietaire: req.user._id }).distinct('_id');
    conditions.push({
      $or: [{ projet: { $in: myProjects } }, { utilisateurAssigne: req.user._id }],
    });
  }

  if (search) conditions.push(buildSearch(search, ['titre', 'description']));
  if (statut) conditions.push({ statut: String(statut) });
  if (projet) conditions.push({ projet: String(projet) });
  if (utilisateurAssigne) conditions.push({ utilisateurAssigne: String(utilisateurAssigne) });

  const filter = conditions.length ? { $and: conditions } : {};

  const tasks = await populateTask(Task.find(filter).sort(buildSort(sort, SORT_FIELDS)));

  res.json({ total: tasks.length, taches: tasks });
};

// GET /api/tasks/:id — tache wa7da
exports.getTask = async (req, res) => {
  const task = await findTaskOr404(req, res);
  if (!task) return;

  await task.populate('utilisateurAssigne', 'nom login');
  res.json(task);
};

// PUT /api/tasks/:id — nbadlou tache
exports.updateTask = async (req, res) => {
  const task = await findTaskOr404(req, res);
  if (!task) return;

  const body = req.body || {};

  // el affectation 3andha route wa7adha, w houni zeda l manager barka ynajem ybadelha
  if (body.utilisateurAssigne !== undefined) {
    if (!isManager(req.user)) {
      return res
        .status(403)
        .json({ message: 'Seul le manager peut affecter une tâche à un utilisateur' });
    }
    if (body.utilisateurAssigne && !(await checkAssignee(body.utilisateurAssigne, res))) return;
    task.utilisateurAssigne = body.utilisateurAssigne || null;
  }

  // nbadlou barka les champs elli tb3athou (el projet mta3 el tache ma yetbadelch)
  if (body.titre !== undefined) task.titre = body.titre;
  if (body.description !== undefined) task.description = body.description;
  if (body.statut !== undefined) task.statut = body.statut;
  if (body.deadline !== undefined) task.deadline = body.deadline;

  // save() y3awed ya3mel el validation: statut lezem ykoun todo wala doing wala done
  await task.save();
  res.json(task);
};

// PATCH /api/tasks/:id/assign — l manager ya3ti el tache l utilisateur
// nab3thou { "utilisateurAssigne": "ID" } wala null bech nna7iw el affectation
exports.assignTask = async (req, res) => {
  const { utilisateurAssigne } = req.body || {};

  if (utilisateurAssigne === undefined) {
    return res.status(400).json({ message: 'utilisateurAssigne est obligatoire' });
  }

  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Tâche introuvable' });
  }

  if (utilisateurAssigne && !(await checkAssignee(utilisateurAssigne, res))) return;

  task.utilisateurAssigne = utilisateurAssigne || null;
  await task.save();

  await populateTask(task);
  res.json(task);
};

// DELETE /api/tasks/:id — nfaskhou tache (moula el projet wala l manager)
exports.deleteTask = async (req, res) => {
  const task = await findTaskOr404(req, res, { ownerOnly: true });
  if (!task) return;

  await task.deleteOne();
  res.json({ message: 'Tâche supprimée' });
};
