'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notifications', {
      id: { allowNull: false, primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
      type: Sequelize.STRING,
      contenu: Sequelize.STRING,
      dateEnvoi: Sequelize.DATE,
      statut: Sequelize.STRING,
      particulierId: { type: Sequelize.UUID, allowNull: true, references: { model: 'particuliers', key: 'id' }, onDelete: 'SET NULL' },
      administrateurId: { type: Sequelize.UUID, allowNull: true, references: { model: 'administrateurs', key: 'id' }, onDelete: 'SET NULL' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('notifications');
  }
}; 