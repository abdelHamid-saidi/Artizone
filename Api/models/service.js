module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    nom: DataTypes.STRING,
    description: DataTypes.TEXT,
    prixUnitaire: DataTypes.FLOAT,
    dureeEstimee: DataTypes.STRING,
    artisanId: { type: DataTypes.UUID, allowNull: false },
    categorieId: { type: DataTypes.UUID, allowNull: true }
  }, { tableName: 'services' });

  Service.associate = models => {
    Service.belongsTo(models.Artisan, { foreignKey: 'artisanId', as: 'artisan' });
    Service.belongsTo(models.Categorie, { foreignKey: 'categorieId', as: 'categorie' });
    Service.hasMany(models.Commande, { foreignKey: 'serviceId', as: 'commandes' });
  };

  return Service;
}; 