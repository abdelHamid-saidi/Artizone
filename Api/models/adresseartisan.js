module.exports = (sequelize, DataTypes) => {
  const AdresseArtisan = sequelize.define('AdresseArtisan', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    rue: DataTypes.STRING,
    ville: DataTypes.STRING,
    codePostal: DataTypes.STRING,
    pays: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    artisanId: { type: DataTypes.UUID, allowNull: false }
  }, { tableName: 'adresses_artisan' });

  AdresseArtisan.associate = models => {
    AdresseArtisan.belongsTo(models.Artisan, { foreignKey: 'artisanId' });
  };

  return AdresseArtisan;
}; 