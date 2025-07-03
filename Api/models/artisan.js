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
    Artisan.hasMany(models.AdresseArtisan, { foreignKey: 'artisanId', as: 'AdresseArtisans' });
    Artisan.hasMany(models.Service, { foreignKey: 'artisanId', as: 'services' });
    Artisan.hasMany(models.Disponibilite, { foreignKey: 'artisanId', as: 'disponibilites' });
    Artisan.hasMany(models.Commande, { foreignKey: 'artisanId', as: 'commandes' });
    // Artisan.hasMany(models.Avis, { foreignKey: 'artisanId', as: 'avis' }); // SUPPRIMÉ car pas de colonne artisanId dans avis
    // Ajoute d'autres relations si besoin
  };

  return Artisan;
}; 