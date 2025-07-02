module.exports = (sequelize, DataTypes) => {
  const Artisan = sequelize.define('Artisan', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    nom: DataTypes.STRING,
    telephone: DataTypes.STRING,
    langue: DataTypes.STRING,
    noteMoyenne: DataTypes.FLOAT,
    ville: DataTypes.STRING,
    pays: DataTypes.STRING
  }, { tableName: 'artisans' });

  Artisan.associate = models => {
    Artisan.hasMany(models.AdresseArtisan, { foreignKey: 'artisanId' });
    Artisan.hasMany(models.Service, { foreignKey: 'artisanId' });
    Artisan.hasMany(models.Disponibilite, { foreignKey: 'artisanId' });
    Artisan.hasMany(models.Commande, { foreignKey: 'artisanId' });
    Artisan.hasMany(models.Avis, { foreignKey: 'artisanId' });
    // Ajoute d'autres relations si besoin
  };

  return Artisan;
}; 