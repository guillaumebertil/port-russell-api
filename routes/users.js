const express     = require('express');
const router      = express.Router();
const userService = require('../services/users');

/**
 * GET /users - Récupérer tous les utilisateurs
 */
router.get('/', userService.getAllUsers);

/**
 * GET /users/:email - Récupérer un utilisateur par email
 */
router.get('/:email', userService.getUserByEmail);

/**
 * POST /users - Créer un utilisateur
 */
router.post('/', userService.createUser);

/**
 * PUT /users/:email - Mettre à jour un utilisateur
 */
router.put('/:email', userService.updateUser);

/**
 * DELETE /users/:email - Supprimer un utilisateur
 */
router.delete('/:email', userService.deleteUser);

module.exports = router;
