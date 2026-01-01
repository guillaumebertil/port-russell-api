const express            = require('express');
const router             = express.Router();
const usersController    = require('../controllers/usersController');
const auth               = require('../middlewares/auth');

/**
 * GET /users - Liste des utilisateurs
 */
router.get('/', auth.checkTokenWeb, usersController.listUsers);

/**
 * GET /users/add - Formulaire d'ajout
 */
router.get('/add', auth.checkTokenWeb, usersController.showAddForm);

/**
 * POST /users/add - Créer un utilisateur
 */
router.post('/add', auth.checkTokenWeb, usersController.createUser);

/**
 * GET users/:email/edit - Formulaire de modification
 */
router.get('/:email/edit', auth.checkTokenWeb, usersController.showEditForm);

/**
 * GET users/:email/edit - Modifier un utilisateur
 */
router.post('/:email/edit', auth.checkTokenWeb, usersController.updateUser);


/**
 * POST /users/:email/delete - Supprimer un utilisateur
 */
router.post('/:email/delete', auth.checkTokenWeb, usersController.deleteUser);

module.exports = router;