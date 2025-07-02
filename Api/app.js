require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger.json');

// Import des routes
const authRoutes = require('./routes/auth.routes');
const artisanRoutes = require('./routes/artisan.routes');
const serviceRoutes = require('./routes/service.routes');
const categorieRoutes = require('./routes/categorie.routes');
const commandeRoutes = require('./routes/commande.routes');
const paiementRoutes = require('./routes/paiement.routes');
const avisRoutes = require('./routes/avis.routes');
const disponibiliteRoutes = require('./routes/disponibilite.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// Middlewares sécurité
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Trop de requêtes, réessayez plus tard.'
});
app.use(limiter);

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/artisans', artisanRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/commandes', commandeRoutes);
app.use('/api/paiements', paiementRoutes);
app.use('/api/avis', avisRoutes);
app.use('/api/disponibilites', disponibiliteRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Erreur serveur' });
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
sequelize.authenticate().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur Artizone lancé sur le port ${PORT}`);
    console.log(`Documentation disponible sur http://localhost:${PORT}/api-docs`);
  });
}).catch(err => {
  console.error('Erreur connexion DB:', err);
}); 