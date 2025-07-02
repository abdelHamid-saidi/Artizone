module.exports = (sequelize, DataTypes) => {
  const Avis = sequelize.define('Avis', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    note: DataTypes.INTEGER,
    commentaire: DataTypes.STRING,
    date: DataTypes.DATE,
    commandeId: { type: DataTypes.UUID, allowNull: false }
  }, { tableName: 'avis' });

  Avis.associate = models => {
    Avis.belongsTo(models.Commande, { foreignKey: 'commandeId' });
  };

  return Avis;
}; 