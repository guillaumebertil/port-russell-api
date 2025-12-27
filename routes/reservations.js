const express            = require('express');
const router             = express.Router();
const reservationService = require('../services/reservations');

/**
 * GET /catways/:id/reservations - Récupérer toutes les réservations d'un catway
 */
router.get('/catways/:id/reservations', reservationService.getReservationsByCatway);

/**
 * GET /catways/:id/reservations/:idReservation - Récupérer une réservation par son ID
 */
router.get('/catways/:id/reservations/:idReservation', reservationService.getReservationById);

/**
 * POST /catways/:id/reservations - Créer une réservation
 */
router.post('/catways/:id/reservations', reservationService.createReservation);

/**
 * PUT /catways/:id/reservations/:idReservation - Mettre à jour une réservation
 */
router.put('/catways/:id/reservations/:idReservation', reservationService.updateReservation);

/**
 * DELETE /catways/:id/reservations/:idReservation - Supprimer une réservation
 */
router.delete('/catways/:id/reservations/:idReservation', reservationService.deleteReservation);

/**
 * GET /reservations - Récupérer toutes les réservations (pour le dashboard)
 */
router.get('/reservations', reservationService.getAllReservations);

/**
 * GET /reservations/current - Récupérer les réservations en cours (pour le dashboard)
 */
router.get('/reservations/current', reservationService.getCurrentReservations);

module.exports = router;