const User   = require('../models/user');
const jwt    = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * Authentifier un utilisateur (login)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction Next
 */
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Récupérer l'utilisateur avec le password
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        // Comparer les passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        // Générer le token JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        );

        // Envoyer le token dans le header Authorization
        res.set('Authorization', token);

        return res.status(200).json({
            message: 'Authentification réussie',
            user   : {
                id      : user._id,
                username: user.username,
                email   : user.email
            }
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Déconnecter un utilisateur (logout)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction Next
 */
exports.logout = async (req, res, next) => {
    return res.status(200).json({ message: 'Déconnexion réussie' });
};