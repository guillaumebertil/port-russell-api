const express = require('express');
const router  = express.Router();
const User    = require('../models/user');
const auth    = require('../middlewares/auth');

/**
 * GET /users - Liste des utilisateurs
 */
router.get('/', auth.checkTokenWeb, async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });

        res.render('users/list', {
            title  : 'Liste des utilisateurs',
            user   : req.user,
            users  : users,
            success: req.query.success || null,
            error  : req.query.error || null
        });

    } catch (error) {
        res.status(500).send('Erreur serveur');
    }
});

/**
 * GET /users/add - Formulaire d'ajout
 */
router.get('/add', auth.checkTokenWeb, async (req, res) => {
    res.render('users/add', {
        title: 'Ajouter un utilisateur',
        user : req.user,
        error: null
    });
});

/**
 * POST /users/add - Créer un utilisateur
 */
router.post('/add', auth.checkTokenWeb, async (req, res) => {
    try {
        const { username, email, password, passwordConfirm } = req.body;

        // Vérifier que les mots de passe correspondent
        if (password !== passwordConfirm) {
            return res.render('users/add', {
                title: 'Ajouter un utilisateur',
                user : req.user,
                error: 'Les mots de passe ne correspondent pas'
            });
        }

        // Vérifier si l'email existe déjà
        const existing = await User.findOne({ email });

        if (existing) {
            res.render('users/add', {
                title: 'Ajouter un utilisateur',
                user : req.user,
                error: 'Cet email est déjà utilisé'
            });
        }

        // Créer un nouvel utilisateur
        const newUser = new User({
            username,
            email,
            password
        });

        await newUser.save();
        res.redirect('/users?success=Utilisateur créé avec succès');

    } catch (error) {
        res.render('users/add', {
            title: 'Ajouter un utilisateur',
            user : req.user,
            error: 'Erreur lors de la création'
        });
    }
});

/**
 * GET users/:email/edit - Formulaire de modification
 */
router.get('/:email/edit', auth.checkTokenWeb, async (req, res) => {
    try {
        const email    = decodeURIComponent(req.params.email);
        const editUser = await User.findOne({ email }).select('-password');

        if (!editUser) {
            return res.redirect('/users?error=Utilisateur non trouvé');
        }

        res.render('users/edit', {
            title   : 'Modifie un utilisateur',
            user    : req.user,
            editUser: editUser,
            error   : null
        });

    } catch (error) {
        res.redirect('/users?error=Erreur serveur');
    }
});

/**
 * POST users/:email/edit - Modifier un utilisateur
 */
router.post('/:email/edit', auth.checkTokenWeb, async (req, res) => {
    try {
        const email = decodeURIComponent(req.params.email);
        const { username, password, passwordConfirm } = req.body;

        // Vérifier que l'utilisateur existe
        const editUser = await User.findOne({ email });
        
        if (!editUser) {
            return res.redirect('/users?error=Utilisateur non trouvé');
        }

        // Si le mot de passe est fourni, vérifier la confirmation
        if (password) {
            if (password !== passwordConfirm) {
                return res.render('users/edit', {
                    title: 'Modifier un utilisateur',
                    user : req.user,
                    error: 'Les mot de passe ne correspondent pas'
                });
            }
            editUser.password = password;
        }

        // Mettre à jour le username
        editUser.username = username;

        await editUser.save();
        res.redirect('/users?success=Utilisateur modifié avec succès');

    } catch (error) {
        res.redirect('/users?error=Erreur lors de la modification');
    }
});

/**
 * POST /users/:email/delete - Supprimer un utilisateur
 */
router.post('/:email/delete', auth.checkTokenWeb, async (req, res) => {
    try {
        const email = decodeURIComponent(req.params.email);

        // Empêcher de se supprimer soi-même
        if (email === req.user.email) {
            return res.redirect('/users?error=Vous ne pouvez pas vous supprimer vous-même');
        }
        const deleteUser = await User.findOneAndDelete({ email });

        if (!deleteUser) {
            return res.redirect('/users?error=Utilisateur non trouvé');
        }

        res.redirect('/users?success= Utilisateur supprimé avec succès');

    } catch (error) {
        res.redirect('/users?error=Erreur lors de la suppression');
    }
});

module.exports = router;