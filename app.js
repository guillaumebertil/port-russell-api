const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const cors          = require('cors');

// Import de la connexion MongoDB
const { initClientDbConnection } = require('./db/mongo');

// Import des routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Initialisation de l'app Express
const app = express();

// Connexion à MongoDB
initClientDbConnection();

// Configuration de EJS
app.set('views', path.join(__dirname, 'views'));
app.set('views engine', 'ejs');

// Middlewares
// Logger
app.use(logger('dev'));

// Parse le JSON
app.use(express.json());

// Parse les formulaires
app.use(express.urlencoded({ extended: false }));

// Parse les cookies
app.use(cookieParser());

// Fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Initialisation de CORS
app.use(cors({
    exposedHeaders: ['Authorization'],
    origin        : '*'
}));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Gestion erreur 404
app.use((req, res, next) => {
    res.status(404).json({
        message: "Route non trouvée"
    });
});

// Export de l'APP
module.exports = app;
