// Importations
const mongoose = require('mongoose');

// Schéma catway
const catwaySchema = new mongoose.Schema({
    catwayNumber: {
        type    : Number,
        required: [true, 'Le numéro du catway est requis'],
        unique  : true
    },
    catwayType: {
        type    : String,
        required: [true, 'Le type du catway est requis'],
        enum    : ['long', 'short'],
        default : 'short'
    },
    catwayState: {
        type    : String,
        required: [true, 'L\'etat du catway est requis'],
        default : 'bon état'
    }
}, {
    timestamps: true
});

// Export du modèle
module.exports = mongoose.model('Catway', catwaySchema);