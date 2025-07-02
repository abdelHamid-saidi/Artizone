const { Particulier, Administrateur } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// ===== AUTHENTIFICATION PARTICULIER =====

exports.registerParticulier = async (req, res) => {
  console.log('=== DÉBUT INSCRIPTION PARTICULIER ===');
  console.log('Données reçues:', { 
    nom: req.body.nom, 
    email: req.body.email, 
    telephone: req.body.telephone,
    motDePasse: req.body.motDePasse ? '[MOT_DE_PASSE_MASQUÉ]' : 'NON_FOURNI'
  });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Erreurs de validation:', errors.array());
    return res.status(400).json({ 
      error: 'Données invalides',
      details: errors.array() 
    });
  }

  const { nom, email, motDePasse, telephone } = req.body;
  
  try {
    console.log('🔍 Vérification si l\'email existe déjà...');
    // Vérifier si l'email existe déjà
    const existingUser = await Particulier.findOne({ where: { email } });
    if (existingUser) {
      console.log('❌ Email déjà utilisé:', email);
      return res.status(409).json({ error: 'Cette adresse email est déjà utilisée' });
    }
    console.log('✅ Email disponible');

    console.log('🔐 Hashage du mot de passe...');
    // Hasher le mot de passe
    const hash = await bcrypt.hash(motDePasse, parseInt(process.env.BCRYPT_SALT || '10'));
    console.log('✅ Mot de passe hashé');
    
    console.log('👤 Création du particulier...');
    // Créer le particulier
    const particulier = await Particulier.create({ 
      nom, 
      email, 
      motDePasse: hash, 
      telephone: telephone || null 
    });
    console.log('✅ Particulier créé avec ID:', particulier.id);

    console.log('🎫 Génération du token JWT...');
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
    console.log('✅ Token généré');

    console.log('✅ INSCRIPTION PARTICULIER RÉUSSIE - ID:', particulier.id);
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
    console.error('❌ Erreur inscription particulier:', err);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
  console.log('=== FIN INSCRIPTION PARTICULIER ===\n');
};

exports.loginParticulier = async (req, res) => {
  console.log('=== DÉBUT CONNEXION PARTICULIER ===');
  console.log('Données reçues:', { 
    email: req.body.email, 
    motDePasse: req.body.motDePasse ? '[MOT_DE_PASSE_MASQUÉ]' : 'NON_FOURNI'
  });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Erreurs de validation:', errors.array());
    return res.status(400).json({ 
      error: 'Données invalides',
      details: errors.array() 
    });
  }

  const { email, motDePasse } = req.body;
  
  try {
    console.log('🔍 Recherche du particulier par email...');
    // Rechercher le particulier
    const particulier = await Particulier.findOne({ where: { email } });
    if (!particulier) {
      console.log('❌ Particulier non trouvé pour email:', email);
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    console.log('✅ Particulier trouvé - ID:', particulier.id);

    console.log('🔐 Vérification du mot de passe...');
    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(motDePasse, particulier.motDePasse);
    if (!validPassword) {
      console.log('❌ Mot de passe incorrect pour email:', email);
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    console.log('✅ Mot de passe correct');

    console.log('🎫 Génération du token JWT...');
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
    console.log('✅ Token généré');

    console.log('✅ CONNEXION PARTICULIER RÉUSSIE - ID:', particulier.id);
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
    console.error('❌ Erreur connexion particulier:', err);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
  console.log('=== FIN CONNEXION PARTICULIER ===\n');
};

// ===== AUTHENTIFICATION ADMINISTRATEUR =====

exports.registerAdmin = async (req, res) => {
  console.log('=== DÉBUT INSCRIPTION ADMINISTRATEUR ===');
  console.log('Données reçues:', { 
    nom: req.body.nom, 
    email: req.body.email, 
    motDePasse: req.body.motDePasse ? '[MOT_DE_PASSE_MASQUÉ]' : 'NON_FOURNI'
  });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Erreurs de validation:', errors.array());
    return res.status(400).json({ 
      error: 'Données invalides',
      details: errors.array() 
    });
  }

  const { nom, email, motDePasse } = req.body;
  
  try {
    console.log('🔍 Vérification si l\'email admin existe déjà...');
    // Vérifier si l'email existe déjà
    const existingAdmin = await Administrateur.findOne({ where: { email } });
    if (existingAdmin) {
      console.log('❌ Email admin déjà utilisé:', email);
      return res.status(409).json({ error: 'Cette adresse email est déjà utilisée' });
    }
    console.log('✅ Email admin disponible');

    console.log('🔐 Hashage du mot de passe admin...');
    // Hasher le mot de passe
    const hash = await bcrypt.hash(motDePasse, parseInt(process.env.BCRYPT_SALT || '10'));
    console.log('✅ Mot de passe admin hashé');
    
    console.log('👤 Création de l\'administrateur...');
    // Créer l'administrateur
    const admin = await Administrateur.create({ 
      nom, 
      email, 
      motDePasse: hash 
    });
    console.log('✅ Administrateur créé avec ID:', admin.id);

    console.log('🎫 Génération du token JWT admin...');
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
    console.log('✅ Token admin généré');

    console.log('✅ INSCRIPTION ADMINISTRATEUR RÉUSSIE - ID:', admin.id);
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
    console.error('❌ Erreur inscription admin:', err);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
  console.log('=== FIN INSCRIPTION ADMINISTRATEUR ===\n');
};

exports.loginAdmin = async (req, res) => {
  console.log('=== DÉBUT CONNEXION ADMINISTRATEUR ===');
  console.log('Données reçues:', { 
    email: req.body.email, 
    motDePasse: req.body.motDePasse ? '[MOT_DE_PASSE_MASQUÉ]' : 'NON_FOURNI'
  });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Erreurs de validation:', errors.array());
    return res.status(400).json({ 
      error: 'Données invalides',
      details: errors.array() 
    });
  }

  const { email, motDePasse } = req.body;
  
  try {
    console.log('🔍 Recherche de l\'administrateur par email...');
    // Rechercher l'administrateur
    const admin = await Administrateur.findOne({ where: { email } });
    if (!admin) {
      console.log('❌ Administrateur non trouvé pour email:', email);
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    console.log('✅ Administrateur trouvé - ID:', admin.id);

    console.log('🔐 Vérification du mot de passe admin...');
    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(motDePasse, admin.motDePasse);
    if (!validPassword) {
      console.log('❌ Mot de passe admin incorrect pour email:', email);
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    console.log('✅ Mot de passe admin correct');

    console.log('🎫 Génération du token JWT admin...');
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
    console.log('✅ Token admin généré');

    console.log('✅ CONNEXION ADMINISTRATEUR RÉUSSIE - ID:', admin.id);
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
    console.error('❌ Erreur connexion admin:', err);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
  console.log('=== FIN CONNEXION ADMINISTRATEUR ===\n');
};

// ===== FONCTIONS LEGACY (pour compatibilité) =====

exports.register = async (req, res) => {
  console.log('=== DÉBUT INSCRIPTION LEGACY (redirection vers particulier) ===');
  // Rediriger vers l'inscription particulier par défaut
  return exports.registerParticulier(req, res);
};

exports.login = async (req, res) => {
  console.log('=== DÉBUT CONNEXION MIXTE (particulier + admin) ===');
  console.log('Données reçues:', { 
    email: req.body.email, 
    motDePasse: req.body.motDePasse ? '[MOT_DE_PASSE_MASQUÉ]' : 'NON_FOURNI'
  });

  const { email, motDePasse } = req.body;
  
  try {
    console.log('🔍 Recherche dans la table Particulier...');
    // Recherche dans les deux tables
    let user = await Particulier.findOne({ where: { email } });
    let role = 'particulier';
    
    if (!user) {
      console.log('❌ Particulier non trouvé, recherche dans Administrateur...');
      user = await Administrateur.findOne({ where: { email } });
      role = 'admin';
    }
    
    if (!user) {
      console.log('❌ Aucun utilisateur trouvé pour email:', email);
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    console.log('✅ Utilisateur trouvé - ID:', user.id, 'Role:', role);

    console.log('🔐 Vérification du mot de passe...');
    const valid = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!valid) {
      console.log('❌ Mot de passe incorrect pour email:', email);
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    console.log('✅ Mot de passe correct');

    console.log('🎫 Génération du token JWT mixte...');
    const token = jwt.sign(
      { 
        id: user.id, 
        role,
        email: user.email 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    console.log('✅ Token mixte généré');
    
    console.log('✅ CONNEXION MIXTE RÉUSSIE - ID:', user.id, 'Role:', role);
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
    console.error('❌ Erreur connexion mixte:', err);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
  console.log('=== FIN CONNEXION MIXTE ===\n');
};

// ===== FONCTIONS UTILITAIRES =====

exports.verifyToken = async (req, res) => {
  console.log('=== VÉRIFICATION TOKEN ===');
  console.log('Token reçu:', req.headers.authorization ? 'PRÉSENT' : 'ABSENT');
  console.log('Utilisateur dans req.user:', req.user);
  
  try {
    // Le middleware auth a déjà vérifié le token
    console.log('✅ Token valide');
    res.json({ 
      valid: true, 
      user: req.user 
    });
  } catch (err) {
    console.log('❌ Token invalide:', err.message);
    res.status(401).json({ error: 'Token invalide' });
  }
  console.log('=== FIN VÉRIFICATION TOKEN ===\n');
};

exports.logout = async (req, res) => {
  console.log('=== DÉCONNEXION ===');
  console.log('Utilisateur déconnecté:', req.user);
  // Avec JWT, la déconnexion se fait côté client
  // Le serveur ne peut pas invalider un token JWT
  console.log('✅ Déconnexion réussie (côté client)');
  res.json({ message: 'Déconnexion réussie' });
  console.log('=== FIN DÉCONNEXION ===\n');
};

// ===== GESTION DU PROFIL =====

exports.getProfile = async (req, res) => {
  console.log('=== DÉBUT RÉCUPÉRATION PROFIL ===');
  console.log('Utilisateur demandé:', req.user);
  
  try {
    const { id, role } = req.user;
    
    let user;
    if (role === 'particulier') {
      user = await Particulier.findByPk(id, {
        attributes: ['id', 'nom', 'email', 'telephone', 'createdAt', 'updatedAt']
      });
    } else if (role === 'admin') {
      user = await Administrateur.findByPk(id, {
        attributes: ['id', 'nom', 'email', 'createdAt', 'updatedAt']
      });
    }
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé - ID:', id, 'Role:', role);
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    console.log('✅ Profil récupéré avec succès - ID:', user.id);
    res.json({ 
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        telephone: user.telephone || null,
        role: role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error('❌ Erreur récupération profil:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
  }
  console.log('=== FIN RÉCUPÉRATION PROFIL ===\n');
};

exports.updateProfile = async (req, res) => {
  console.log('=== DÉBUT MISE À JOUR PROFIL ===');
  console.log('Utilisateur:', req.user);
  console.log('Données à mettre à jour:', { 
    nom: req.body.nom, 
    email: req.body.email, 
    telephone: req.body.telephone 
  });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Erreurs de validation:', errors.array());
    return res.status(400).json({ 
      error: 'Données invalides',
      details: errors.array() 
    });
  }

  try {
    const { id, role } = req.user;
    const { nom, email, telephone } = req.body;
    
    let user;
    if (role === 'particulier') {
      user = await Particulier.findByPk(id);
    } else if (role === 'admin') {
      user = await Administrateur.findByPk(id);
    }
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé - ID:', id, 'Role:', role);
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== user.email) {
      let existingUser;
      if (role === 'particulier') {
        existingUser = await Particulier.findOne({ where: { email } });
      } else if (role === 'admin') {
        existingUser = await Administrateur.findOne({ where: { email } });
      }
      
      if (existingUser) {
        console.log('❌ Email déjà utilisé:', email);
        return res.status(409).json({ error: 'Cette adresse email est déjà utilisée' });
      }
    }
    
    // Mettre à jour les champs fournis
    const updateData = {};
    if (nom !== undefined) updateData.nom = nom;
    if (email !== undefined) updateData.email = email;
    if (telephone !== undefined && role === 'particulier') updateData.telephone = telephone;
    
    await user.update(updateData);
    
    console.log('✅ Profil mis à jour avec succès - ID:', user.id);
    res.json({ 
      message: 'Profil mis à jour avec succès',
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        telephone: user.telephone || null,
        role: role,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error('❌ Erreur mise à jour profil:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
  }
  console.log('=== FIN MISE À JOUR PROFIL ===\n');
};

exports.changePassword = async (req, res) => {
  console.log('=== DÉBUT CHANGEMENT MOT DE PASSE ===');
  console.log('Utilisateur:', req.user);
  console.log('Données reçues:', { 
    ancienMotDePasse: req.body.ancienMotDePasse ? '[MASQUÉ]' : 'NON_FOURNI',
    nouveauMotDePasse: req.body.nouveauMotDePasse ? '[MASQUÉ]' : 'NON_FOURNI'
  });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Erreurs de validation:', errors.array());
    return res.status(400).json({ 
      error: 'Données invalides',
      details: errors.array() 
    });
  }

  try {
    const { id, role } = req.user;
    const { ancienMotDePasse, nouveauMotDePasse } = req.body;
    
    let user;
    if (role === 'particulier') {
      user = await Particulier.findByPk(id);
    } else if (role === 'admin') {
      user = await Administrateur.findByPk(id);
    }
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé - ID:', id, 'Role:', role);
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    // Vérifier l'ancien mot de passe
    const validOldPassword = await bcrypt.compare(ancienMotDePasse, user.motDePasse);
    if (!validOldPassword) {
      console.log('❌ Ancien mot de passe incorrect - ID:', user.id);
      return res.status(401).json({ error: 'Ancien mot de passe incorrect' });
    }
    
    // Hasher le nouveau mot de passe
    const newHash = await bcrypt.hash(nouveauMotDePasse, parseInt(process.env.BCRYPT_SALT || '10'));
    
    // Mettre à jour le mot de passe
    await user.update({ motDePasse: newHash });
    
    console.log('✅ Mot de passe changé avec succès - ID:', user.id);
    res.json({ message: 'Mot de passe changé avec succès' });
  } catch (err) {
    console.error('❌ Erreur changement mot de passe:', err);
    res.status(500).json({ error: 'Erreur lors du changement de mot de passe' });
  }
  console.log('=== FIN CHANGEMENT MOT DE PASSE ===\n');
}; 