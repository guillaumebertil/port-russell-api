// Importations
const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt');

// Schéma utilisateur
const userSchema = new mongoose.Schema({
    username: {
        type    : String,
        required: [true, 'Le nom d\'utilisateur est requis'],
        trim    : true
    },
    email: {
        type     : String,
        required : [true, 'L\'email est requis'],
        unique   : true,
        lowercase: true,
        trim     : true
    },
    password: {
        type     : String,
        required : [true, 'Le mot de passe est requis'],
        mingleght: [8, 'Le mot de passe doit contenir au moins 8 caractères']
    }
}, {
    timestamps: true
});

// Middleware pre-save: chiffre le mot de passe avant la sauvegarde
userSchema.pre('save', async function () {
    // Si le mot de passe n'a pas été modifié, on return
    if (!this.isModified('password')) return;

    // Générer un salt
    const salt = await bcrypt.genSalt(10);

    // Chiffrer le mot de passe
    this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour comparer les mots de passe lors du login
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Export du modèle
module.exports = mongoose.model('User', userSchema);