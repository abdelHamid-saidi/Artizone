const { Particulier, Administrateur } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// ===== AUTHENTIFICATION PARTICULIER =====

exports.registerParticulier = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Données invalides',
      details: errors.array() 
    });
  }

  const { nom, email, motDePasse, telephone } = req.body;
  
  try {
    // Vérifier si l'email existe déjà
    const existingUser = await Particulier.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Cette adresse email est déjà utilisée' });
    }

    // Hasher le mot de passe
    const hash = await bcrypt.hash(motDePasse, parseInt(process.env.BCRYPT_SALT || '10'));
    
    // Créer le particulier
    const particulier = await Particulier.create({ 
      nom, 
      email, 
      motDePasse: hash, 
      telephone: telephone || null 
    });

    // Générer le token
    const token = jwt.sign(
      { 
        id: particulier.id, 
        role: 'particulier',
        email: particulier.email 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({ 
      message: 'Inscription réussie',
      token,
      role: 'particulier',
      user: { 
        id: particulier.id, 
        nom: particulier.nom,
        email: particulier.email,
        telephone: particulier.telephone
      } 
    });
  } catch (err) {
    console.error('Erreur inscription particulier:', err);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
};

exports.loginParticulier = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Données invalides',
      details: errors.array() 
    });
  }

  const { email, motDePasse } = req.body;
  
  try {
    // Rechercher le particulier
    const particulier = await Particulier.findOne({ where: { email } });
    if (!particulier) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(motDePasse, particulier.motDePasse);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Générer le token
    const token = jwt.sign(
      { 
        id: particulier.id, 
        role: 'particulier',
        email: particulier.email 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({ 
      token,
      role: 'particulier',
      user: { 
        id: particulier.id, 
        nom: particulier.nom,
        email: particulier.email,
        telephone: particulier.telephone
      } 
    });
  } catch (err) {
    console.error('Erreur connexion particulier:', err);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
};

// ===== AUTHENTIFICATION ADMINISTRATEUR =====

exports.registerAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Données invalides',
      details: errors.array() 
    });
  }

  const { nom, email, motDePasse } = req.body;
  
  try {
    // Vérifier si l'email existe déjà
    const existingAdmin = await Administrateur.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(409).json({ error: 'Cette adresse email est déjà utilisée' });
    }

    // Hasher le mot de passe
    const hash = await bcrypt.hash(motDePasse, parseInt(process.env.BCRYPT_SALT || '10'));
    
    // Créer l'administrateur
    const admin = await Administrateur.create({ 
      nom, 
      email, 
      motDePasse: hash 
    });

    // Générer le token
    const token = jwt.sign(
      { 
        id: admin.id, 
        role: 'admin',
        email: admin.email 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({ 
      message: 'Inscription administrateur réussie',
      token,
      role: 'admin',
      user: { 
        id: admin.id, 
        nom: admin.nom,
        email: admin.email
      } 
    });
  } catch (err) {
    console.error('Erreur inscription admin:', err);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
};

exports.loginAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Données invalides',
      details: errors.array() 
    });
  }

  const { email, motDePasse } = req.body;
  
  try {
    // Rechercher l'administrateur
    const admin = await Administrateur.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(motDePasse, admin.motDePasse);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Générer le token
    const token = jwt.sign(
      { 
        id: admin.id, 
        role: 'admin',
        email: admin.email 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({ 
      token,
      role: 'admin',
      user: { 
        id: admin.id, 
        nom: admin.nom,
        email: admin.email
      } 
    });
  } catch (err) {
    console.error('Erreur connexion admin:', err);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
};

// ===== FONCTIONS LEGACY (pour compatibilité) =====

exports.register = async (req, res) => {
  // Rediriger vers l'inscription particulier par défaut
  return exports.registerParticulier(req, res);
};

exports.login = async (req, res) => {
  const { email, motDePasse } = req.body;
  
  try {
    // Recherche dans les deux tables
    let user = await Particulier.findOne({ where: { email } });
    let role = 'particulier';
    
    if (!user) {
      user = await Administrateur.findOne({ where: { email } });
      role = 'admin';
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const valid = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!valid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        role,
        email: user.email 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    res.json({ 
      token, 
      role,
      user: { 
        id: user.id, 
        nom: user.nom,
        email: user.email,
        telephone: user.telephone || null
      } 
    });
  } catch (err) {
    console.error('Erreur connexion mixte:', err);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
};

// ===== FONCTIONS UTILITAIRES =====

exports.verifyToken = async (req, res) => {
  try {
    // Le middleware auth a déjà vérifié le token
    res.json({ 
      valid: true, 
      user: req.user 
    });
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

exports.logout = async (req, res) => {
  // Avec JWT, la déconnexion se fait côté client
  // Le serveur ne peut pas invalider un token JWT
  res.json({ message: 'Déconnexion réussie' });
}; 