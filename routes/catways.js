const express       = require('express');
const router        = express.Router();
const catwayService = require('../services/catways');

/**
 * GET /catways - Récupérer l'ensemble des catways
 */
router.get('/', catwayService.getAllCatways);

/**
 * GET /catways/:id - Récupérer un catway par son numéro
 */
router.get('/:id', catwayService.getCatwayByNumber);

/**
 * POST /catways - Créer un nouveau catway
 */
router.post('/', catwayService.createCatway);

/**
 * PUT /catways/:id - Modifier l'état d'un catway
 */
router.put('/:id', catwayService.updateCatway);

/**
 * DELETE /catways/:id - Supprimer un catway
 */
router.delete('/:id', catwayService.deleteCatway);

module.exports = router;