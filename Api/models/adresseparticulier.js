module.exports = (sequelize, DataTypes) => {
  const AdresseParticulier = sequelize.define('AdresseParticulier', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    rue: DataTypes.STRING,
    ville: DataTypes.STRING,
    codePostal: DataTypes.STRING,
    pays: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    particulierId: { type: DataTypes.UUID, allowNull: false }
  }, { tableName: 'adresses_particulier' });

  AdresseParticulier.associate = models => {
    AdresseParticulier.belongsTo(models.Particulier, { foreignKey: 'particulierId' });
  };

  return AdresseParticulier;
}; 