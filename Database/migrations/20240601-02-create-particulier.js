'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('particuliers', {
      id: { allowNull: false, primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
      nom: Sequelize.STRING,
      email: { type: Sequelize.STRING, unique: true },
      motDePasse: Sequelize.STRING,
      telephone: Sequelize.STRING,
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('particuliers');
  }
}; 