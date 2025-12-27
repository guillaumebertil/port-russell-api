const express            = require('express');
const router             = express.Router();
const reservationService = require('../services/reservations');
const auth               = require('../middlewares/auth');

/**
 * GET /catways/:id/reservations - Récupérer toutes les réservations d'un catway (protégé)
 */
router.get('/catways/:id/reservations', auth.checkToken, reservationService.getReservationsByCatway);

/**
 * GET /catways/:id/reservations/:idReservation - Récupérer une réservation par son ID (protégé)
 */
router.get('/catways/:id/reservations/:idReservation', auth.checkToken, reservationService.getReservationById);

/**
 * POST /catways/:id/reservations - Créer une réservation (protégé)
 */
router.post('/catways/:id/reservations', auth.checkToken, reservationService.createReservation);

/**
 * PUT /catways/:id/reservations/:idReservation - Mettre à jour une réservation (protégé)
 */
router.put('/catways/:id/reservations/:idReservation', auth.checkToken, reservationService.updateReservation);

/**
 * DELETE /catways/:id/reservations/:idReservation - Supprimer une réservation (protégé)
 */
router.delete('/catways/:id/reservations/:idReservation', auth.checkToken, reservationService.deleteReservation);

/**
 * GET /reservations - Récupérer toutes les réservations (pour le dashboard) (protégé)
 */
router.get('/reservations', auth.checkToken, reservationService.getAllReservations);

/**
 * GET /reservations/current - Récupérer les réservations en cours (pour le dashboard) (protégé)
 */
router.get('/reservations/current', auth.checkToken, reservationService.getCurrentReservations);

module.exports = router;