const User = require('../models/user');

/**
 * Afficher la liste des utilisateurs
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.listUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        
        res.render('users/list', {
            title: 'Liste des Utilisateurs',
            user: req.user,
            users: users,
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
exports.showAddForm = (req, res) => {
    res.render('users/add', {
        title: 'Ajouter un Utilisateur',
        user: req.user,
        error: null
    });
};

/**
 * Créer un utilisateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, passwordConfirm } = req.body;

        if (password !== passwordConfirm) {
            return res.render('users/add', {
                title: 'Ajouter un Utilisateur',
                user: req.user,
                error: 'Les mots de passe ne correspondent pas'
            });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.render('users/add', {
                title: 'Ajouter un Utilisateur',
                user: req.user,
                error: 'Cet email est déjà utilisé'
            });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();
        
        res.redirect('/users?success=Utilisateur créé avec succès');

    } catch (error) {
        res.render('users/add', {
            title: 'Ajouter un Utilisateur',
            user: req.user,
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
        const email = decodeURIComponent(req.params.email);
        const editUser = await User.findOne({ email }).select('-password');

        if (!editUser) {
            return res.redirect('/users?error=Utilisateur non trouvé');
        }

        res.render('users/edit', {
            title: 'Modifier un Utilisateur',
            user: req.user,
            editUser: editUser,
            error: null
        });
    } catch (error) {
        res.redirect('/users?error=Erreur serveur');
    }
};

/**
 * Modifier un utilisateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.updateUser = async (req, res) => {
    try {
        const email = decodeURIComponent(req.params.email);
        const { username, password, passwordConfirm } = req.body;

        const editUser = await User.findOne({ email });
        if (!editUser) {
            return res.redirect('/users?error=Utilisateur non trouvé');
        }

        if (password) {
            if (password !== passwordConfirm) {
                return res.render('users/edit', {
                    title: 'Modifier un Utilisateur',
                    user: req.user,
                    editUser: editUser,
                    error: 'Les mots de passe ne correspondent pas'
                });
            }
            editUser.password = password;
        }

        editUser.username = username;
        await editUser.save();
        
        res.redirect('/users?success=Utilisateur modifié avec succès');

    } catch (error) {
        res.redirect('/users?error=Erreur lors de la modification');
    }
};

/**
 * Supprimer un utilisateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.deleteUser = async (req, res) => {
    try {
        const email = decodeURIComponent(req.params.email);

        if (email === req.user.email) {
            return res.redirect('/users?error=Vous ne pouvez pas vous supprimer vous-même');
        }

        const deletedUser = await User.findOneAndDelete({ email });

        if (!deletedUser) {
            return res.redirect('/users?error=Utilisateur non trouvé');
        }

        res.redirect('/users?success=Utilisateur supprimé avec succès');

    } catch (error) {
        res.redirect('/users?error=Erreur lors de la suppression');
    }
};