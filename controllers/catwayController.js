const Catway = require('../models/catway');

/**
 * Afficher la liste des catways
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.listCatways = async (req, res) => {
    try {
        const catways = await Catway.find().sort({ catwayNumber: 1 });
        
        res.render('catways/list', {
            title  : 'Liste des Catways',
            user   : req.user,
            catways: catways,
            success: req.query.success || null,
            error  : req.query.error || null
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
exports.showAddForm = (req, res) => {
    res.render('catways/add', {
        title: 'Ajouter un Catway',
        user : req.user,
        error: null
    });
};

/**
 * Créer un catway
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.createCatway = async (req, res) => {
    try {
        const { catwayNumber, catwayType, catwayState } = req.body;

        // Vérifier si le numéro existe déjà
        const existing = await Catway.findOne({ catwayNumber });
        if (existing) {
            return res.render('catways/add', {
                title: 'Ajouter un Catway',
                user : req.user,
                error: 'Ce numéro de catway existe déjà'
            });
        }

        // Créer le catway
        const catway = new Catway({
            catwayNumber: parseInt(catwayNumber),
            catwayType,
            catwayState
        });

        await catway.save();
        res.redirect('/catways?success=Catway ajouté avec succès');

    } catch (error) {
        res.render('catways/add', {
            title: 'Ajouter un Catway',
            user : req.user,
            error: 'Erreur lors de l\'ajout'
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
        const catwayNumber = parseInt(req.params.id);
        const catway = await Catway.findOne({ catwayNumber });

        if (!catway) {
            return res.redirect('/catways?error=Catway non trouvé');
        }

        res.render('catways/edit', {
            title : 'Modifier un Catway',
            user  : req.user,
            catway: catway,
            error : null
        });
    } catch (error) {
        res.redirect('/catways?error=Erreur serveur');
    }
};

/**
 * Modifier un catway
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.updateCatway = async (req, res) => {
    try {
        const catwayNumber = parseInt(req.params.id);
        const { catwayState } = req.body;

        // Mise à jour (seulement l'état)
        const catway = await Catway.findOneAndUpdate(
            { catwayNumber },
            { catwayState },
            { new: true, runValidators: true }
        );

        if (!catway) {
            return res.redirect('/catways?error=Catway non trouvé');
        }

        res.redirect('/catways?success=Catway modifié avec succès');

    } catch (error) {
        res.redirect('/catways?error=Erreur lors de la modification');
    }
};

/**
 * Supprimer un catway
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.deleteCatway = async (req, res) => {
    try {
        const catwayNumber = parseInt(req.params.id);
        
        const catway = await Catway.findOneAndDelete({ catwayNumber });

        if (!catway) {
            return res.redirect('/catways?error=Catway non trouvé');
        }

        res.redirect('/catways?success=Catway supprimé avec succès');

    } catch (error) {
        res.redirect('/catways?error=Erreur lors de la suppression');
    }
};