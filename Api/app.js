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
const notificationRoutes = require('./routes/notification.routes');

const app = express();

// Middlewares sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Configuration CORS - Plus permissive pour le développement
const corsOptions = {
  origin: function (origin, callback) {
    // En développement, accepter toutes les origines
    if (process.env.NODE_ENV === 'development') {
      callback(null, true);
      return;
    }
    
    // En production, utiliser la liste des origines autorisées
    const allowedOrigins = process.env.CORS_ORIGIN ? 
      process.env.CORS_ORIGIN.split(',') : [
        'http://localhost:3000',
        'http://localhost:8081',
        'http://localhost:19006',
        'http://localhost:19000',
        'http://172.20.10.2:3000',
        'http://172.20.10.2:8081',
        'http://172.20.10.2:19006',
        'http://172.20.10.2:19000',
        'exp://localhost:19000',
        'exp://localhost:19006',
        'exp://172.20.10.2:19000',
        'exp://172.20.10.2:19006'
      ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('🚫 Origine CORS rejetée:', origin);
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'Origin']
};
app.use(cors(corsOptions));

// Middleware de debug CORS
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('🔍 Requête CORS preflight détectée:', {
      origin: req.headers.origin,
      method: req.method,
      path: req.path,
      headers: req.headers
    });
  }
  next();
});

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  message: {
    error: 'Trop de requêtes, réessayez plus tard.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting plus strict pour l'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limite chaque IP à 5 tentatives de connexion par fenêtre
  message: {
    error: 'Trop de tentatives de connexion, réessayez plus tard.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use('/api/auth', authLimiter);

// Middleware de logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  const ip = req.ip;
  const userAgent = req.get('User-Agent') || 'Inconnu';
  
  // Log spécial pour les routes d'authentification
  if (path.startsWith('/api/auth')) {
    console.log(`🔐 [AUTH] ${timestamp} - ${method} ${path} - IP: ${ip}`);
    console.log(`🔐 [AUTH] User-Agent: ${userAgent}`);
    if (req.body && Object.keys(req.body).length > 0) {
      const sanitizedBody = { ...req.body };
      if (sanitizedBody.motDePasse) {
        sanitizedBody.motDePasse = '[MOT_DE_PASSE_MASQUÉ]';
      }
      console.log(`🔐 [AUTH] Body:`, sanitizedBody);
    }
  } else {
    console.log(`${timestamp} - ${method} ${path} - IP: ${ip}`);
  }
  
  next();
});

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Artizone API Documentation'
}));

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
app.use('/api/notifications', notificationRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Route de santé API (pour compatibilité)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    message: 'API Artizone - Service de santé'
  });
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'API Artizone - Plateforme de mise en relation particuliers/artisans',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health'
  });
});

// Middleware pour gérer les routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      '/api/auth',
      '/api/artisans',
      '/api/services',
      '/api/categories',
      '/api/commandes',
      '/api/paiements',
      '/api/avis',
      '/api/disponibilites',
      '/api/dashboard',
      '/api/health',
      '/api-docs',
      '/health'
    ]
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur globale:', err);

  // Erreurs de validation Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Données invalides',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message,
        value: e.value
      }))
    });
  }

  // Erreurs de contrainte unique Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'Conflit de données',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Erreurs de clé étrangère Sequelize
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'Référence invalide',
      message: 'Une référence vers une ressource inexistante a été fournie'
    });
  }

  // Erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token invalide'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expiré'
    });
  }

  // Erreurs de validation Express
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Format JSON invalide'
    });
  }

  // Erreur par défaut
  const statusCode = err.status || 500;
  const message = err.message || 'Erreur serveur interne';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, fermeture gracieuse...');
  sequelize.close().then(() => {
    console.log('Connexion à la base de données fermée.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT reçu, fermeture gracieuse...');
  sequelize.close().then(() => {
    console.log('Connexion à la base de données fermée.');
    process.exit(0);
  });
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0'; // Écouter sur toutes les interfaces

sequelize.authenticate().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Serveur Artizone lancé sur ${HOST}:${PORT}`);
    console.log(`📚 Documentation disponible sur http://localhost:${PORT}/api-docs`);
    console.log(`🏥 Health check disponible sur http://localhost:${PORT}/health`);
    console.log(`🌐 Accessible depuis le réseau local: http://10.92.4.40:${PORT}`);
    console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch(err => {
  console.error('❌ Erreur connexion DB:', err);
  process.exit(1);
}); 