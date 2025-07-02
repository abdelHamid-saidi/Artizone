module.exports = (sequelize, DataTypes) => {
  const Artisan = sequelize.define('Artisan', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    nom: DataTypes.STRING,
    telephone: DataTypes.STRING,
    langue: DataTypes.STRING,
    noteMoyenne: DataTypes.FLOAT
  }, { tableName: 'artisans' });

  Artisan.associate = models => {
    Artisan.hasOne(models.AdresseArtisan, { foreignKey: 'artisanId' });
    Artisan.hasMany(models.Service, { foreignKey: 'artisanId' });
    Artisan.hasMany(models.Disponibilite, { foreignKey: 'artisanId' });
    Artisan.hasMany(models.Commande, { foreignKey: 'artisanId' });
    // Ajoute d'autres relations si besoin
  };

  return Artisan;
}; 