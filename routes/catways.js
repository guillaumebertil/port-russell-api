const express       = require('express');
const router        = express.Router();
const catwayService = require('../services/catways');
const auth          = require('../middlewares/auth')

/**
 * GET /catways - Récupérer l'ensemble des catways (protégé)
 */
router.get('/', auth.checkToken, catwayService.getAllCatways);

/**
 * GET /catways/:id - Récupérer un catway par son numéro (protégé)
 */
router.get('/:id', auth.checkToken, catwayService.getCatwayByNumber);

/**
 * POST /catways - Créer un nouveau catway (protégé)
 */
router.post('/', auth.checkToken, catwayService.createCatway);

/**
 * PUT /catways/:id - Modifier l'état d'un catway (protégé)
 */
router.put('/:id', auth.checkToken, catwayService.updateCatway);

/**
 * DELETE /catways/:id - Supprimer un catway (protégé)
 */
router.delete('/:id', auth.checkToken, catwayService.deleteCatway);

module.exports = router;