// Importations
const mongoose = require('mongoose');

// Schéma réservation
const reservationSchema = new mongoose.Schema({
    catwayNumber: {
        type    : Number,
        required: [true, 'Le numéro du catway est requis']
    },
    clientName: {
        type    : String,
        required: [true, 'Le nom du clien est requis'],
        trim    : true
    },
    boatName: {
        type    : String,
        required: [true, 'Le nom du bateau est requis'],
        trim    : true
    },
    startDate: {
        type    : Date, 
        required: [true, 'La date de début est requise']
    },
    endDate: {
        type    : Date,
        required: [true, 'La date de fin est requise']
    }
}, {
    timestamps: true
});

// Validation : endDate doit être après startDate
reservationSchema.pre('save', function() {
    if (this.endDate <= this.startDate) {
        throw new Error('La date de fin doit être après la date de début');
    }
});

// Export du modèle
module.exports = mongoose.model('Reservation', reservationSchema);