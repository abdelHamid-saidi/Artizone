const { Particulier, Administrateur } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { nom, email, motDePasse, telephone } = req.body;
  try {
    const hash = await bcrypt.hash(motDePasse, parseInt(process.env.BCRYPT_SALT));
    const user = await Particulier.create({ nom, email, motDePasse: hash, telephone });
    res.status(201).json({ message: 'Inscription réussie', user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
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
    if (!user) return res.status(401).json({ error: 'Utilisateur non trouvé' });

    const valid = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token, role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 