const jwt = require('jsonwebtoken');

module.exports = (roles = []) => {
  return (req, res, next) => {
    console.log('=== DÉBUT VÉRIFICATION MIDDLEWARE AUTH ===');
    console.log('URL demandée:', req.originalUrl);
    console.log('Méthode HTTP:', req.method);
    console.log('Rôles autorisés:', roles.length > 0 ? roles : 'TOUS');
    
    const authHeader = req.headers['authorization'];
    console.log('Header Authorization:', authHeader ? 'PRÉSENT' : 'ABSENT');
    
    if (!authHeader) {
      console.log('❌ Token manquant dans les headers');
      return res.status(401).json({ error: 'Token manquant' });
    }
    
    const token = authHeader.split(' ')[1];
    console.log('Token extrait:', token ? 'PRÉSENT' : 'ABSENT');
    
    if (!token) {
      console.log('❌ Token non trouvé dans le header Authorization');
      return res.status(401).json({ error: 'Token manquant' });
    }
    
    try {
      console.log('🔍 Vérification du token JWT...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token décodé avec succès');
      console.log('Utilisateur décodé:', {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email
      });
      
      if (roles.length && !roles.includes(decoded.role)) {
        console.log('❌ Rôle insuffisant. Rôle actuel:', decoded.role, 'Rôles requis:', roles);
        return res.status(403).json({ error: 'Accès refusé' });
      }
      
      console.log('✅ Autorisation accordée');
      req.user = decoded;
      next();
    } catch (err) {
      console.log('❌ Erreur lors de la vérification du token:', err.message);
      res.status(401).json({ error: 'Token invalide' });
    }
    console.log('=== FIN VÉRIFICATION MIDDLEWARE AUTH ===\n');
  };
}; 