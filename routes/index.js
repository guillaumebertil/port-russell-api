const express     = require('express');
const router      = express.Router();
const authService = require('../services/auth');
const User        = require('../models/user');
const bcrypt      = require('bcrypt');
const jwt         = require('jsonwebtoken');
const auth        = require('../middlewares/auth');
const Reservation = require('../models/reservation');

/**
 * GET / - Page d'accueil
 */
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Accueil - Port Russell',
        user : null,
        error: null
    });
});

/**
 * POST / LOGIN - Connexion depuis le formulaire web
 */
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Chercher l'utilisateur
        const user = await User.findOne({ email });

        if (!user) {
            return res.render('index', {
                title: 'Accueil - Port Russell',
                user : null,
                error: 'Email ou mot de passe incorrect'
            });
        }

        // Vérifier le password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render('index', {
                title: 'Accueil - Port Russell',
                user : null,
                error: 'Email ou mot de passe incorrect'
            });
        }

        // Générer le token
        const token = jwt.sign(
            { id: user._id, email: user.email, username: user.username },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        );

        // Stocker dans un cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        // Rediriger vers le dashboard
        res.redirect('/dashboard');

    } catch (error) {
        res.render('index', {
            title: 'Accueil - Port Russell',
            user : null,
            error: 'Erreur serveur'
        });
    }
});

/**
 * GET /logout - Déconnexion
 */
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

/**
 * POST /login - Authentification pour l'API
 */
router.post('/login', authService.login);

/**
 * GET /logout - Déconnexion de l'API
 */
router.get('/logout', authService.logout);

/**
 * GET /dashboard - Tableau de bord (protégé)
 */
router.get('/dashboard', auth.checkTokenWeb, async (req, res) => {
    try {
        // Récupérer les réservations en cours
        const today = new Date();
        const currentReservations = await Reservation.find({
            startDate: { $lte: today },
            endDate: { $gte: today }
        }).sort({ startDate: -1 });

        res.render('dashboard', {
            title: 'Tableau de bord - Port Russell',
            user: req.user,
            currentReservations: currentReservations,
            today: today.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        });

    } catch (error) {
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;
