const express     = require('express');
const router      = express.Router();
const Reservation = require('../models/reservation');
const Catway      = require('../models/catway');
const auth        = require('../middlewares/auth');

/**
 * GET /reservations - Liste des réservations
 */
router.get('/', auth.checkTokenWeb, async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ startDate: -1 })

        res.render('reservations/list', {
            title       : 'Liste des réservations',
            user        : req.user,
            reservations: reservations,
            success     : req.query.success || null,
            error       : req.query.error || null
        });

    } catch (error) {
        res.status(500).send('Erreur serveur');
    }
});

/**
 * GET /reservations/add - Formulaire ajout
 */
router.get('/add', auth.checkTokenWeb, async (req, res) => {
    try {
        // Récupérer tous les catways pour le select
        const catways = await Catway.find().sort({ catwayNumber: 1 });

        res.render('reservations/add', {
            title  : 'Nouvelle réservation',
            user   : req.user,
            catways: catways,
            error  : null
        });

    } catch (error) {
        res.status(500).send('Erreur serveur');
    }
});

/**
 * POST /reservations/add - Créer une réservation
 */
router.post('/add', auth.checkTokenWeb, async(req, res) => {
    try {
        const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;

        // Vérifier que le catway existe
        const catway = await Catway.findOne({ catwayNumber: parseInt(catwayNumber) });

        if (!catway) {
            const catways = await Catway.find().sort({ catwayNumber: 1 });
            return res.render('reservations/add', {
                title  : 'Nouvelle réservation',
                user   : req.user,
                catways: catways,
                error  : 'Catway non trouvé'
            });
        }

        // Vérifier les chevauchements
        const start = new Date(startDate);
        const end   = new Date(endDate);

        const existingReservations = await Reservation.find({ catwayNumber: parseInt(catwayNumber) });

        let hasConflict = false;

        for (const existing of existingReservations) {
            const existingStart = new Date(existing.startDate);
            const existingEnd   = new Date(existing.endDate);

            if (start <= existingEnd && end >= existingStart) {
                hasConflict = true;
                break;
            }
        }

        if (hasConflict) {
            const catways = await Catway.find().sort({ catwayNumber: 1 });
            return res.render('reservations/add', {
                title  : 'Nouvelle réservation',
                user   : req.user,
                catways: catways,
                error  : 'Ce catway est déjà réservé pour cette période'
            });
        }

        // Créer la réservation
        const reservation = new Reservation({
            catwayNumber: parseInt(catwayNumber),
            clientName,
            boatName,
            startDate: start,
            endDate  : end
        });

        await reservation.save();
        res.redirect('/reservations?success=Réservation créée avec succès');

    } catch (error) {
        const catways = await Catway.find().sort({ catwayNumber: 1 });
        res.render('reservations/add', {
            title  : 'Nouvelle réservation',
            user   : req.user,
            catways: catways,
            error  : 'Erreur lors de la création'
        });
    }
});

/**
 * GET /reservations/:id/edit - Formulaire de modification
 */
router.get('/:id/edit', auth.checkTokenWeb, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.redirect('/reservations?error=Réservation non trouvée');
        }

        res.render('reservations/edit', {
            title      : 'Modifier une réservation',
            user       : req.user,
            reservation: reservation,
            error      : null
        });

    } catch (error) {
        res.redirect('/reservations?error=Erreur serveur');
    }
});

/**
 * POST /reservations/:id/edit - Modifier une réservation
 */
router.post('/:id/edit', auth.checkTokenWeb, async (req, res) => {
    try {
        const { clientName, boatName, startDate, endDate } = req.body;
        const reservationId = req.params.id;

        // Récupérer la réservation actuelle
        const reservation = await Reservation.findById(reservationId);

        if (!reservation) {
            return res.redirect('/reservations?error=Réservation non trouvée');
        }

        // Vérifier les chevauchements (en excluant la réservation actuelle)
        const start = new Date(startDate);
        const end   = new Date(endDate);

        const existingReservations = await Reservation.find({
            _id: { $ne: reservationId },
            catwayNumber: reservation.catwayNumber
        });

        let hasConflict = false;

        for (const existing of existingReservations) {
            const existingStart = new Date(existing.startDate);
            const existingEnd   = new Date(existing.endDate);

            if (start <= existingEnd && end >= existingStart) {
                hasConflict = true;
                break;
            }
        }

        if (hasConflict) {
            return res.render('reservations/edit', {
                title      : 'Modifier une réservation',
                user       : req.user,
                reservation: reservation,
                error      : 'Ce catway est déjà réservé pour cette période'
            });
        }

        // Mettre à jour
        reservation.clientName = clientName;
        reservation.boatName   = boatName;
        reservation.startDate  = start;
        reservation.endDate    = end;

        await reservation.save();
        res.redirect('/reservations?success=Réservation modifiée avec succès');

    } catch (error) {
        res.redirect('/reservations?error=Erreur lors de la modification');
    }
});

/**
 * POST /reservations/:id/delete - Supprimer une réservation
 */
router.post('/:id/delete', auth.checkTokenWeb, async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.id);

        if (!reservation) {
            return res.redirect('/reservations?error=Réservation non trouvé');
        }

        res.redirect('/reservations?success=Réservation supprimée avec succès');

    } catch (error) {
        res.redirect('/reservations?error=Erreur lors de la suppression');
    }
});

module.exports = router;