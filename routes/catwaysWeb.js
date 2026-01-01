const express           = require('express');
const router            = express.Router();
const catwaysController = require('../controllers/catwayController');
const auth              = require('../middlewares/auth');

/**
 * GET /catways
 * Affiche la liste des catways (page web)
 */
router.get('/', auth.checkTokenWeb, catwaysController.listCatways);

/**
 * GET /catways/add
 * Affiche le formulaire d'ajout d'un catway (page web)
 */
router.get('/add', auth.checkTokenWeb, catwaysController.showAddForm);

/**
 * POST /catways/add
 * Crée un nouveau catway (traitement du formulaire – page web)
 */
router.post('/add', auth.checkTokenWeb, catwaysController.createCatway);

/**
 * GET /catways/:id/edit
 * Affiche le formulaire de modification d'un catway (page web)
 */
router.get('/:id/edit', auth.checkTokenWeb, catwaysController.showEditForm);

/**
 * POST /catways/:id/edit
 * Met à jour l'état d'un catway existant (page web)
 */
router.post('/:id/edit', auth.checkTokenWeb, catwaysController.updateCatway);

/**
 * POST /catways/:id/delete
 * Supprime un catway existant (page web)
 */
router.post('/:id/delete', auth.checkTokenWeb, catwaysController.deleteCatway);

module.exports = router;