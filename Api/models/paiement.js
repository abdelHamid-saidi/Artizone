module.exports = (sequelize, DataTypes) => {
  const Paiement = sequelize.define('Paiement', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    montant: DataTypes.FLOAT,
    methode: DataTypes.STRING,
    date: DataTypes.DATE,
    statut: DataTypes.STRING,
    commandeId: { type: DataTypes.UUID, allowNull: false }
  }, { tableName: 'paiements' });

  Paiement.associate = models => {
    Paiement.belongsTo(models.Commande, { foreignKey: 'commandeId', as: 'commande' });
  };

  return Paiement;
}; 