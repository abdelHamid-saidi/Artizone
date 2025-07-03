module.exports = (sequelize, DataTypes) => {
  const Categorie = sequelize.define('Categorie', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    icone: DataTypes.STRING,
    couleur: DataTypes.STRING
  }, { tableName: 'categories' });

  Categorie.associate = models => {
    Categorie.hasMany(models.Service, { foreignKey: 'categorieId', as: 'services' });
  };

  return Categorie;
}; 