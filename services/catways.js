const Catway = require('../models/catway');

/**
 * Récupérer tous les catways
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
exports.getAllCatways = async (req, res, next) => {
    try {
        const catways = await Catway.find().sort({ catwayNumber: 1 });
        return res.status(200).json(catways);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Récupérer un catway par son numéro
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
exports.getCatwayByNumber = async (req, res, next) => {
    const catwayNumber = parseInt(req.params.id);

    try {
        const catway = await Catway.findOne({ catwayNumber });

        if (catway) {
            return res.status(200).json(catway);
        }

        return res.status(404).json({ error: 'Catway non trouvé' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Créer un catway
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
exports.createCatway = async (req, res, next) => {
    const catwayData = req.body;

    try {
        // Vérifier si le numéro existe déjà
        const existingCatway = await Catway.findOne({ catwayNumber: catwayData.catwayNumber });

        if (existingCatway) {
            return res.status(400).json({ error: 'Ce numéro de catway existe déjà' });
        }

        const catway = new Catway(catwayData);
        await catway.save();

        return res.status(201).json(catway);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Mettre à jour un catway (seulement le catwayState)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
exports.updateCatway = async (req, res, next) => {
    const catwayNumber    = parseInt(req.params.id);
    const { catwayState } = req.body;

    try {
        // On modifie uniquement l'état du catway (catwayState)
        const catway = await Catway.findOneAndUpdate(
            { catwayNumber },
            { catwayState },
            { new: true, runValidators: true }
        );

        if (catway) {
            return res.status(200).json(catway);
        }

        return res.status(404).json({ error: 'Catway non trouvé' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Supprimer un catway
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
exports.deleteCatway = async (req, res, next) => {
    const catwayNumber = parseInt(req.params.id);

    try {
        const catway = await Catway.findOneAndDelete({ catwayNumber });

        if (catway) {
            return res.status(200).json({ message: 'Catway supprimé avec succès' });
        }

        return res.status(404).json({ error: 'Catway non trouvé'});

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}