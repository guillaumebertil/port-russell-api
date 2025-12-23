// Importation de mongoose
const mongoose = require('mongoose');

/**
 * Initialise la connexion à MongoDB
 * Utilise la variable d'environnement URL_MONGO
 */
exports.initClientDbConnection = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGO);
        console.log('✅ Connexion à MongoDB réussie');
    } catch (error) {
        console.error(`❌Erreur de connexion à MongoDB : ${error.message}`);
        throw error;
    }
};