'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('services', {
      id: { allowNull: false, primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
      nom: Sequelize.STRING,
      description: Sequelize.TEXT,
      prixUnitaire: Sequelize.FLOAT,
      dureeEstimee: Sequelize.STRING,
      artisanId: { type: Sequelize.UUID, allowNull: false, references: { model: 'artisans', key: 'id' }, onDelete: 'CASCADE' },
      categorieId: { type: Sequelize.UUID, allowNull: true, references: { model: 'categories', key: 'id' }, onDelete: 'SET NULL' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('services');
  }
}; 