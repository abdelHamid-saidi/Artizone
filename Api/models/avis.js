module.exports = (sequelize, DataTypes) => {
  const Avis = sequelize.define('Avis', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    note: DataTypes.INTEGER,
    commentaire: DataTypes.STRING,
    date: DataTypes.DATE,
    particulierId: { type: DataTypes.UUID, allowNull: true },
    commandeId: { type: DataTypes.UUID, allowNull: false }
  }, { tableName: 'avis' });

  Avis.associate = models => {
    Avis.belongsTo(models.Commande, { foreignKey: 'commandeId' });
    Avis.belongsTo(models.Particulier, { foreignKey: 'particulierId' });
  };

  return Avis;
}; 