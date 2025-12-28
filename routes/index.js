const express     = require('express');
const router      = express.Router();
const authService = require('../services/auth')

/**
 * GET / - Page d'accueil
 */
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Page d\'accueil'
    });
});


/**
 * POST /login - Authentification
 */
router.post('/login', authService.login);

/**
 * GET /logout - Déconnexion
 */
router.get('/logout', authService.logout);

module.exports = router;
