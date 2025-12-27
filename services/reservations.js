const Reservation = require('../models/reservation');
const Catway      = require('../models/catway');

/**
 * Récupérer toutes les réservations
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
exports.getAllReservations = async (req, res, next) => {
    try {
        const reservations = await Reservation.find().sort({ startDate: -1 });
        return res.status(200).json(reservations);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Récupérer toutes les réservations d'un catway
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
exports.getReservationsByCatway = async (req, res, next) => {
    const catwayNumber = parseInt(req.params.id);

    try {
        const reservations = await Reservation.find({ catwayNumber }).sort({ startDate: -1 });
        
        return res.status(200).json(reservations);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Récupérer une réservation par son ID
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
exports.getReservationById = async (req, res, next) => {
    const reservationId = req.params.idReservation;

    try {
        const reservation = await Reservation.findById(reservationId);

        if (reservation) {
            return res.status(200).json(reservation);
        }
        
        return res.status(404).json({ error: 'Réservation non trouvée' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Créer une réservation
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
exports.createReservation = async (req, res, next) => {
    const catwayNumber = parseInt(req.params.id);
    const reservationData = req.body;
    
    try {
        // Vérifier que le catway existe
        const catway = await Catway.findOne({ catwayNumber });
        if (!catway) {
            return res.status(404).json({ error: 'Catway non trouvé' });
        }
        
        // Vérifier les chevauchements de dates
        const startDate = new Date(reservationData.startDate);
        const endDate = new Date(reservationData.endDate);
        
        const conflictingReservation = await Reservation.findOne({
            catwayNumber,
            $or: [
                { startDate: { $lte: startDate }, endDate: { $gte: startDate } },
                { startDate: { $lte: endDate }, endDate: { $gte: endDate } },
                { startDate: { $gte: startDate }, endDate: { $lte: endDate } }
            ]
        });
        
        if (conflictingReservation) {
            return res.status(400).json({ error: 'Ce catway est déjà réservé pour cette période' });
        }

        // Créer la réservation
        const reservation = new Reservation({
            catwayNumber: catwayNumber,
            clientName  : reservationData.clientName,
            boatName    : reservationData.boatName,
            startDate   : reservationData.startDate,
            endDate     : reservationData.endDate
        });

        await reservation.save();
        return res.status(201).json(reservation);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Mettre à jour une réservation
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
exports.updateReservation = async (req, res, next) => {
    const reservationId = req.params.idReservation;
    const updateData = req.body;
    
    try {
        // Récupérer la réservation actuelle
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ error: 'Réservation non trouvée' });
        }
        
        // Si on modifie les dates, vérifier les chevauchements
        if (updateData.startDate || updateData.endDate) {
            const startDate = new Date(updateData.startDate || reservation.startDate);
            const endDate = new Date(updateData.endDate || reservation.endDate);
            
            const conflictingReservation = await Reservation.findOne({
                _id: { $ne: reservationId },
                catwayNumber: reservation.catwayNumber,
                $or: [
                    { startDate: { $lte: startDate }, endDate: { $gte: startDate } },
                    { startDate: { $lte: endDate }, endDate: { $gte: endDate } },
                    { startDate: { $gte: startDate }, endDate: { $lte: endDate } }
                ]
            });
            
            if (conflictingReservation) {
                return res.status(400).json({ error: 'Ce catway est déjà réservé pour cette période' });
            }
        }
        
        // Mettre à jour
        const updatedReservation = await Reservation.findByIdAndUpdate(
            reservationId,
            updateData,
            { new: true, runValidators: true }
        );
        
        return res.status(200).json(updatedReservation);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Récupérer les réservations en cours pour le tableau de bord
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
exports.getCurrentReservations = async (req, res, next) => {
    try {
        const today        = new Date();
        const reservations = await Reservation.find({
            startDate: { $lte: today },
            endDate  : { $gte: today }
        }).sort({ startDate: -1 });

        return res.status(200).json(reservations);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Supprimer une réservation
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
exports.deleteReservation = async (req, res, next) => {
    const reservationId = req.params.idReservation;

    try {
        const deleted = await Reservation.findByIdAndDelete(reservationId);

        if (!deleted) {
            return res.status(404).json({ error: 'Réservation non trouvée' });
        }

        return res.status(200).json({ message: 'Réservation supprimée' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
