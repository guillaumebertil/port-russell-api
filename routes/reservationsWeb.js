const express               = require('express');
const router                = express.Router();
const reservationController = require('../controllers/reservationsController');
const auth                  = require('../middlewares/auth');

/**
 * GET /reservations - Liste des réservations
 */
router.get('/', auth.checkTokenWeb, reservationController.listReservations);

/**
 * GET /reservations/add - Formulaire ajout
 */
router.get('/add', auth.checkTokenWeb, reservationController.showAddForm);

/**
 * POST /reservations/add - Créer une réservation
 */
router.post('/add', auth.checkTokenWeb, reservationController.createReservation);

/**
 * GET /reservations/:id/edit - Formulaire de modification
 */
router.get('/:id/edit', auth.checkTokenWeb, reservationController.showEditForm);

/**
 * POST /reservations/:id/edit - Modifier une réservation
 */
router.post('/:id/edit', auth.checkTokenWeb, reservationController.updateReservation);

/**
 * POST /reservations/:id/delete - Supprimer une réservation
 */
router.post('/:id/delete', auth.checkTokenWeb, reservationController.deleteReservation);

module.exports = router;