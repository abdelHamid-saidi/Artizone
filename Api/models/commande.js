module.exports = (sequelize, DataTypes) => {
  const Commande = sequelize.define('Commande', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    dateCommande: DataTypes.DATE,
    statut: DataTypes.STRING,
    description: DataTypes.TEXT,
    prixTotal: DataTypes.FLOAT,
    particulierId: { type: DataTypes.UUID, allowNull: false },
    serviceId: { type: DataTypes.UUID, allowNull: false },
    disponibiliteId: { type: DataTypes.UUID, allowNull: false },
    adresseParticulierId: { type: DataTypes.UUID, allowNull: false },
    artisanId: { type: DataTypes.UUID, allowNull: false }
  }, { tableName: 'commandes' });

  Commande.associate = models => {
    Commande.belongsTo(models.Particulier, { foreignKey: 'particulierId', as: 'particulier' });
    Commande.belongsTo(models.Service, { foreignKey: 'serviceId', as: 'service' });
    Commande.belongsTo(models.Disponibilite, { foreignKey: 'disponibiliteId', as: 'disponibilite' });
    Commande.belongsTo(models.AdresseParticulier, { foreignKey: 'adresseParticulierId', as: 'adresseParticulier' });
    Commande.belongsTo(models.Artisan, { foreignKey: 'artisanId', as: 'artisan' });
    Commande.hasOne(models.Paiement, { foreignKey: 'commandeId', as: 'paiement' });
    Commande.hasOne(models.Avis, { foreignKey: 'commandeId', as: 'avis' });
  };

  return Commande;
}; 