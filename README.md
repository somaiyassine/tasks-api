# tasks-api

API REST de gestion de projets et de tâches — Mini-Projet DS1 (ISIDS) — Express.js + MongoDB

## Auteurs

- Ghaith Bejaoui
- Yassine Somai

## Installation

```bash
npm install
```

Créer un fichier `.env` à la racine du projet :

```env
PORT=5000
MONGO_URI=<lien de connexion MongoDB>
JWT_SECRET=<une chaîne secrète>
JWT_EXPIRES_IN=1d
```

Lancer le serveur :

```bash
npm run dev    # avec nodemon
npm start      # sans nodemon
```

## Authentification

Toutes les routes (sauf `register` et `login`) demandent un token JWT dans le header :

```
Authorization: Bearer <token>
```

Deux rôles existent : `user` (par défaut) et `manager`.

## Routes

### Utilisateurs — `/api/auth`

| Méthode | Route       | Accès    | Description                                             |
| ------- | ----------- | -------- | ------------------------------------------------------- |
| POST    | `/register` | public   | Créer un compte (`nom`, `login`, `password`, `role`)    |
| POST    | `/login`    | public   | Se connecter (`login`, `password`) et recevoir un token |
| GET     | `/me`       | connecté | Voir son profil                                         |
| GET     | `/users`    | manager  | Liste de tous les utilisateurs                          |

### Projets — `/api/projects`

| Méthode | Route  | Accès                   | Description                                             |
| ------- | ------ | ----------------------- | ------------------------------------------------------- |
| POST    | `/`    | connecté                | Créer un projet (`nom`, `description`, `statut`)        |
| GET     | `/`    | connecté                | Le manager voit tous les projets, le user voit les siens |
| GET     | `/:id` | propriétaire ou manager | Voir un projet                                          |
| PUT     | `/:id` | propriétaire ou manager | Modifier un projet                                      |
| DELETE  | `/:id` | propriétaire ou manager | Supprimer un projet et ses tâches                       |

Statuts possibles d'un projet : `en cours`, `terminé`, `en pause`.

### Tâches — `/api/tasks`

| Méthode | Route         | Accès                                        | Description                                                  |
| ------- | ------------- | -------------------------------------------- | ------------------------------------------------------------ |
| POST    | `/`           | connecté                                     | Créer une tâche (`titre`, `description`, `statut`, `deadline`, `projet`) |
| GET     | `/`           | connecté                                     | Le manager voit tout ; le user voit les tâches de ses projets et celles qui lui sont assignées |
| GET     | `/:id`        | propriétaire du projet, assigné ou manager   | Voir une tâche                                               |
| PUT     | `/:id`        | propriétaire du projet, assigné ou manager   | Modifier une tâche                                           |
| PATCH   | `/:id/assign` | manager                                      | Affecter la tâche à un utilisateur (`utilisateurAssigne`)    |
| DELETE  | `/:id`        | propriétaire du projet ou manager            | Supprimer une tâche                                          |

Statuts possibles d'une tâche : `todo`, `doing`, `done`.

Un user crée des tâches dans ses propres projets ; le manager peut en créer dans n'importe quel projet.
Seul le manager peut affecter une tâche à un utilisateur.

## Tri et recherche

Sur `GET /api/projects` :

- `?search=mot` — recherche dans le nom et la description
- `?statut=en cours` — filtrer par statut
- `?sort=nom` ou `?sort=-dateCreation` — tri (le `-` veut dire décroissant). Champs : `nom`, `statut`, `dateCreation`

Sur `GET /api/tasks` :

- `?search=mot` — recherche dans le titre et la description
- `?statut=todo` — filtrer par statut
- `?projet=<id>` — tâches d'un projet
- `?utilisateurAssigne=<id>` — tâches d'un utilisateur
- `?sort=deadline` ou `?sort=statut,-deadline` — tri. Champs : `titre`, `statut`, `deadline`, `dateCreation`

Exemple :

```
GET /api/tasks?projet=<id>&statut=todo&search=api&sort=deadline
```
