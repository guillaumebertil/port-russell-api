const express            = require('express');
const router             = express.Router();
const reservationService = require('../services/reservations');
const auth               = require('../middlewares/auth');

/**
 * @swagger
 * /catways/{id}/reservations:
 *   get:
 *     summary: Récupère toutes les réservations d'un catway
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numéro du catway
 *     responses:
 *       200:
 *         description: Liste des réservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Token manquant ou invalide
 */
router.get('/catways/:id/reservations', auth.checkToken, reservationService.getReservationsByCatway);

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   get:
 *     summary: Récupère une réservation spécifique par son ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numéro du catway
 *       - in: path
 *         name: idReservation
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la réservation MongoDB
 *     responses:
 *       200:
 *         description: Réservation trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Réservation non trouvée
 *       401:
 *         description: Token manquant ou invalide
 */
router.get('/catways/:id/reservations/:idReservation', auth.checkToken, reservationService.getReservationById);

/**
 * @swagger
 * /catways/{id}/reservations:
 *   post:
 *     summary: Crée une nouvelle réservation pour un catway
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numéro du catway
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientName
 *               - boatName
 *               - startDate
 *               - endDate
 *             properties:
 *               clientName:
 *                 type: string
 *               boatName:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Réservation créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Conflit de dates
 *       404:
 *         description: Catway non trouvé
 *       401:
 *         description: Token manquant ou invalide
 */
router.post('/catways/:id/reservations', auth.checkToken, reservationService.createReservation);

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   put:
 *     summary: Met à jour une réservation existante
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numéro du catway
 *       - in: path
 *         name: idReservation
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la réservation MongoDB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *               boatName:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Réservation mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Conflit de dates
 *       404:
 *         description: Réservation non trouvée
 *       401:
 *         description: Token manquant ou invalide
 */
router.put('/catways/:id/reservations/:idReservation', auth.checkToken, reservationService.updateReservation);

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   delete:
 *     summary: Supprime une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numéro du catway
 *       - in: path
 *         name: idReservation
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la réservation MongoDB
 *     responses:
 *       200:
 *         description: Réservation supprimée
 *       404:
 *         description: Réservation non trouvée
 *       401:
 *         description: Token manquant ou invalide
 */
router.delete('/catways/:id/reservations/:idReservation', auth.checkToken, reservationService.deleteReservation);

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Récupère toutes les réservations (pour le dashboard)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de toutes les réservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Token manquant ou invalide
 */
router.get('/reservations', auth.checkToken, reservationService.getAllReservations);

/**
 * @swagger
 * /reservations/current:
 *   get:
 *     summary: Récupère les réservations en cours (pour le dashboard)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations en cours
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Token manquant ou invalide
 */
router.get('/reservations/current', auth.checkToken, reservationService.getCurrentReservations);

module.exports = router;
