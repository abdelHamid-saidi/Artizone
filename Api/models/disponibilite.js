module.exports = (sequelize, DataTypes) => {
  const Disponibilite = sequelize.define('Disponibilite', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    jour: DataTypes.STRING,
    heureDebut: DataTypes.TIME,
    heureFin: DataTypes.TIME,
    isDisponible: DataTypes.BOOLEAN,
    artisanId: { type: DataTypes.UUID, allowNull: false }
  }, { tableName: 'disponibilites' });

  Disponibilite.associate = models => {
    Disponibilite.belongsTo(models.Artisan, { foreignKey: 'artisanId', as: 'artisan' });
    Disponibilite.hasMany(models.Commande, { foreignKey: 'disponibiliteId', as: 'commandes' });
  };

  return Disponibilite;
}; 