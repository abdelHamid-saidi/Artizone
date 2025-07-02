'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('avis', {
      id: { allowNull: false, primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
      note: Sequelize.INTEGER,
      commentaire: Sequelize.STRING,
      date: Sequelize.DATE,
      commandeId: { type: Sequelize.UUID, allowNull: false, references: { model: 'commandes', key: 'id' }, onDelete: 'CASCADE' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('avis');
  }
}; 