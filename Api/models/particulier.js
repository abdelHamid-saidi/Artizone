module.exports = (sequelize, DataTypes) => {
  const Particulier = sequelize.define('Particulier', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    nom: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    motDePasse: DataTypes.STRING,
    telephone: DataTypes.STRING
  }, { tableName: 'particuliers' });

  Particulier.associate = models => {
    Particulier.hasMany(models.AdresseParticulier, { foreignKey: 'particulierId' });
    Particulier.hasMany(models.Commande, { foreignKey: 'particulierId' });
    Particulier.hasMany(models.Notification, { foreignKey: 'particulierId' });
  };

  return Particulier;
}; 