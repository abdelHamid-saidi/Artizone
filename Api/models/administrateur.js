module.exports = (sequelize, DataTypes) => {
  const Administrateur = sequelize.define('Administrateur', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    nom: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    motDePasse: DataTypes.STRING
  }, { tableName: 'administrateurs' });

  Administrateur.associate = models => {
    // Relations éventuelles à ajouter
  };

  return Administrateur;
}; 