module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    type: DataTypes.STRING,
    contenu: DataTypes.STRING,
    dateEnvoi: DataTypes.DATE,
    statut: DataTypes.STRING,
    particulierId: { type: DataTypes.UUID, allowNull: true },
    administrateurId: { type: DataTypes.UUID, allowNull: true }
  }, { tableName: 'notifications' });

  Notification.associate = models => {
    Notification.belongsTo(models.Particulier, { foreignKey: 'particulierId' });
    Notification.belongsTo(models.Administrateur, { foreignKey: 'administrateurId' });
  };

  return Notification;
}; 