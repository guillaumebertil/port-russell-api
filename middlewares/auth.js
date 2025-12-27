const jwt =require('jsonwebtoken');

/**
 * Middleware pour vérifier le token JWT
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
exports.checkToken = (req, res, next) => {
    // Récupérer le token depuis le header Authorization
    const token = req.headers.authorization;

    // Vérifier si le token existe
    if (!token) {
        res.status(401).json({ error: 'Token manquant' });
    }

    try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Ajouter les infos de l'utilisateur dans req pour les routes suivantes
        req.user = decoded;

        // Passer au middleware/route suivant
        next();

    } catch (error) {
        return res.status(401).json({ error: 'Token invalide ou expiré' });
    }
};