const Project = require('../models/Project');
const Task = require('../models/Task');
const { buildSearch, buildSort } = require('../utils/query');

// les champs elli ynajem el utilisateur yratteb bihom les projets
const SORT_FIELDS = ['nom', 'statut', 'dateCreation'];

// nchoufou ken el utilisateur houwa moula el projet wala manager
const canAccess = (project, user) =>
  user.role === 'manager' || project.proprietaire.equals(user._id);

// nal9aw el projet bel ID w net2akdou elli el utilisateur 3andou el 7a9 fih
// ken famma mochkol nab3thou el reponse w nrajj3ou null
const findProjectOr404 = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404).json({ message: 'Projet introuvable' });
    return null;
  }
  if (!canAccess(project, req.user)) {
    res.status(403).json({ message: 'Accès refusé : ce projet ne vous appartient pas' });
    return null;
  }
  return project;
};

// POST /api/projects — ay utilisateur 3amel login ynajem yasna3 projet
exports.createProject = async (req, res) => {
  const { nom, description, statut } = req.body || {};

  // moula el projet houwa dima el utilisateur elli b3ath el requete, ma nekhdhouhch mel body
  const project = await Project.create({
    nom,
    description,
    statut,
    proprietaire: req.user._id,
  });

  res.status(201).json(project);
};

// GET /api/projects — l manager ychouf les projets el kol, w el user ychouf mte3ou barka
// fiha recherche w tri: ?search=...&statut=...&sort=nom
exports.getProjects = async (req, res) => {
  const { search, statut, sort } = req.query;

  const filter = { ...buildSearch(search, ['nom', 'description']) };

  // el user el 3adi n7asrouh fi les projets mte3ou
  if (req.user.role !== 'manager') {
    filter.proprietaire = req.user._id;
  }
  if (statut) {
    filter.statut = String(statut);
  }

  const projects = await Project.find(filter)
    .sort(buildSort(sort, SORT_FIELDS))
    .populate('proprietaire', 'nom login');

  res.json({ total: projects.length, projets: projects });
};

// GET /api/projects/:id — projet wa7ed
exports.getProject = async (req, res) => {
  const project = await findProjectOr404(req, res);
  if (!project) return;

  await project.populate('proprietaire', 'nom login');
  res.json(project);
};

// PUT /api/projects/:id — nbadlou projet (el moula wala l manager)
exports.updateProject = async (req, res) => {
  const project = await findProjectOr404(req, res);
  if (!project) return;

  const { nom, description, statut } = req.body || {};

  // nbadlou barka les champs elli tb3athou, w el moula ma yetbadelch
  if (nom !== undefined) project.nom = nom;
  if (description !== undefined) project.description = description;
  if (statut !== undefined) project.statut = statut;

  // save() y3awed ya3mel el validation (mathalan statut mouch s7i7)
  await project.save();
  res.json(project);
};

// DELETE /api/projects/:id — nfaskhou el projet w les taches elli teb3inou
exports.deleteProject = async (req, res) => {
  const project = await findProjectOr404(req, res);
  if (!project) return;

  await Task.deleteMany({ projet: project._id });
  await project.deleteOne();

  res.json({ message: 'Projet et ses tâches supprimés' });
};
