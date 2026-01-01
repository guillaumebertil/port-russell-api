const Reservation = require('../models/reservation');
const Catway      = require('../models/catway');

/**
 * Afficher la liste des réservations
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.listReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ startDate: -1 });
        
        res.render('reservations/list', {
            title: 'Liste des Réservations',
            user: req.user,
            reservations: reservations,
            success: req.query.success || null,
            error: req.query.error || null
        });
    } catch (error) {
        res.status(500).send('Erreur serveur');
    }
};

/**
 * Afficher le formulaire d'ajout
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.showAddForm = async (req, res) => {
    try {
        const catways = await Catway.find().sort({ catwayNumber: 1 });
        
        res.render('reservations/add', {
            title: 'Nouvelle Réservation',
            user: req.user,
            catways: catways,
            error: null
        });
    } catch (error) {
        res.status(500).send('Erreur serveur');
    }
};

/**
 * Créer une réservation
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.createReservation = async (req, res) => {
    try {
        const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;

        // Vérifier que le catway existe
        const catway = await Catway.findOne({ catwayNumber: parseInt(catwayNumber) });
        if (!catway) {
            const catways = await Catway.find().sort({ catwayNumber: 1 });
            return res.render('reservations/add', {
                title: 'Nouvelle Réservation',
                user: req.user,
                catways: catways,
                error: 'Catway non trouvé'
            });
        }

        // Vérifier les chevauchements
        const start = new Date(startDate);
        const end = new Date(endDate);

        const existingReservations = await Reservation.find({ 
            catwayNumber: parseInt(catwayNumber) 
        });

        let hasConflict = false;
        for (const existing of existingReservations) {
            const existingStart = new Date(existing.startDate);
            const existingEnd = new Date(existing.endDate);

            if (start <= existingEnd && end >= existingStart) {
                hasConflict = true;
                break;
            }
        }

        if (hasConflict) {
            const catways = await Catway.find().sort({ catwayNumber: 1 });
            return res.render('reservations/add', {
                title: 'Nouvelle Réservation',
                user: req.user,
                catways: catways,
                error: 'Ce catway est déjà réservé pour cette période'
            });
        }

        // Créer la réservation
        const reservation = new Reservation({
            catwayNumber: parseInt(catwayNumber),
            clientName,
            boatName,
            startDate: start,
            endDate: end
        });

        await reservation.save();
        res.redirect('/reservations?success=Réservation créée avec succès');

    } catch (error) {
        const catways = await Catway.find().sort({ catwayNumber: 1 });
        res.render('reservations/add', {
            title: 'Nouvelle Réservation',
            user: req.user,
            catways: catways,
            error: 'Erreur lors de la création'
        });
    }
};

/**
 * Afficher le formulaire de modification
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.showEditForm = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.redirect('/reservations?error=Réservation non trouvée');
        }

        res.render('reservations/edit', {
            title: 'Modifier une Réservation',
            user: req.user,
            reservation: reservation,
            error: null
        });
    } catch (error) {
        res.redirect('/reservations?error=Erreur serveur');
    }
};

/**
 * Modifier une réservation
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.updateReservation = async (req, res) => {
    try {
        const { clientName, boatName, startDate, endDate } = req.body;
        const reservationId = req.params.id;

        // Récupérer la réservation actuelle
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.redirect('/reservations?error=Réservation non trouvée');
        }

        // Vérifier les chevauchements
        const start = new Date(startDate);
        const end = new Date(endDate);

        const existingReservations = await Reservation.find({ 
            _id: { $ne: reservationId },
            catwayNumber: reservation.catwayNumber
        });

        let hasConflict = false;
        for (const existing of existingReservations) {
            const existingStart = new Date(existing.startDate);
            const existingEnd = new Date(existing.endDate);

            if (start <= existingEnd && end >= existingStart) {
                hasConflict = true;
                break;
            }
        }

        if (hasConflict) {
            return res.render('reservations/edit', {
                title: 'Modifier une Réservation',
                user: req.user,
                reservation: reservation,
                error: 'Ce catway est déjà réservé pour cette période'
            });
        }

        // Mettre à jour
        reservation.clientName = clientName;
        reservation.boatName = boatName;
        reservation.startDate = start;
        reservation.endDate = end;

        await reservation.save();
        res.redirect('/reservations?success=Réservation modifiée avec succès');

    } catch (error) {
        res.redirect('/reservations?error=Erreur lors de la modification');
    }
};

/**
 * Supprimer une réservation
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.id);

        if (!reservation) {
            return res.redirect('/reservations?error=Réservation non trouvée');
        }

        res.redirect('/reservations?success=Réservation supprimée avec succès');

    } catch (error) {
        res.redirect('/reservations?error=Erreur lors de la suppression');
    }
};