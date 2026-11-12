// nna7iw les caracteres speciaux mta3 el regex bech el recherche tkoun 3al texte kima houwa
const escapeRegex = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// nasn3ou el condition mta3 el recherche: el kelma tkoun mawjouda fi wa7ed mel champs (majuscule wala minuscule kif kif)
// mathalan: ?search=site
exports.buildSearch = (search, fields) => {
  if (!search) return {};
  const regex = new RegExp(escapeRegex(search), 'i');
  return { $or: fields.map((field) => ({ [field]: regex })) };
};

// nasn3ou el tri mel query
// mathalan: ?sort=nom (croissant) wala ?sort=-dateCreation (decroissant) wala ?sort=statut,-deadline
// ne9blou barka les champs el masmou7 bihom, w el be9i ntayychouh
exports.buildSort = (sort, allowedFields, defaultSort = '-dateCreation') => {
  if (!sort) return defaultSort;

  const fields = String(sort)
    .split(',')
    .map((f) => f.trim())
    .filter((f) => allowedFields.includes(f.replace(/^-/, '')));

  return fields.length ? fields.join(' ') : defaultSort;
};
