const User      = require('../models/user');
const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcrypt');

/**
 * Récupérer tous les utilisateurs
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        return res.status(200).json(users);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Récupérer un utilisateur par email
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
exports.getUserByEmail = async (req, res, next) => {
    const email = req.params.email;

    try {
        const user = await User.findOne({ email }).select('-password');

        if (user) {
            return res.status(200).json(user);
        }

        return res.status(404).json({ error: 'Utilisateur non trouvé' });

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
};

/**
 * Créer un utilisateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
exports.createUser = async (req, res, next) => {
    const userData = req.body;
    
    try {
        // Vérifier si l'email existe déjà
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }
        
        // Créer le nouvel utilisateur
        const user = new User(userData);
        await user.save();
        
        // Retourner sans le password
        const userObject = user.toObject();
        delete userObject.password;
        
        return res.status(201).json(userObject);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Mettre à jour l'utilisateur
 * @param {Object} req - Requêtes Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
exports.updateUser = async (req, res, next) => {
    const email      = req.params.email;
    const updateData = req.body;

    try {
        // Si on met à jour le password, il faut le hasher
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        const user = await User.findOneAndUpdate(
            { email },
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (user) {
            return res.status(200).json(user);
        }

        return res.status(404).json({ error: 'Utilisateur non trouvé' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Supprimer un utilisateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
exports.deleteUser = async (req, res, next) => {
    const email = req.params.email;

    try {
        const user = await User.findOneAndDelete({ email });

        if (user) {
            return res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
        }

        return res.status(404).json({ error: 'Utilisateur non trouvé' });
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};