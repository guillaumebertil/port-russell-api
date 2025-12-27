const express     = require('express');
const router      = express.Router();
const userService = require('../services/users');
const auth        = require('../middlewares/auth');

/**
 * GET /users - Récupérer tous les utilisateurs (protégé)
 */
router.get('/', auth.checkToken, userService.getAllUsers);

/**
 * GET /users/:email - Récupérer un utilisateur par email (protégé)
 */
router.get('/:email', auth.checkToken, userService.getUserByEmail);

/**
 * POST /users - Créer un utilisateur (public)
 */
router.post('/', userService.createUser);

/**
 * PUT /users/:email - Mettre à jour un utilisateur (protégé)
 */
router.put('/:email', auth.checkToken, userService.updateUser);

/**
 * DELETE /users/:email - Supprimer un utilisateur (protégé)
 */
router.delete('/:email', auth.checkToken, userService.deleteUser);

module.exports = router;
