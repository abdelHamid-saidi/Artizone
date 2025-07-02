'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('commandes', {
      id: { allowNull: false, primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
      dateCommande: Sequelize.DATE,
      statut: Sequelize.STRING,
      description: Sequelize.TEXT,
      prixTotal: Sequelize.FLOAT,
      particulierId: { type: Sequelize.UUID, allowNull: false, references: { model: 'particuliers', key: 'id' }, onDelete: 'CASCADE' },
      serviceId: { type: Sequelize.UUID, allowNull: false, references: { model: 'services', key: 'id' }, onDelete: 'CASCADE' },
      disponibiliteId: { type: Sequelize.UUID, allowNull: false, references: { model: 'disponibilites', key: 'id' }, onDelete: 'CASCADE' },
      adresseParticulierId: { type: Sequelize.UUID, allowNull: false, references: { model: 'adresses_particulier', key: 'id' }, onDelete: 'CASCADE' },
      artisanId: { type: Sequelize.UUID, allowNull: false, references: { model: 'artisans', key: 'id' }, onDelete: 'CASCADE' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('commandes');
  }
}; 