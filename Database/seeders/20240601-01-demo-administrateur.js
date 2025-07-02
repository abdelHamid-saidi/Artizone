'use strict';
const bcrypt = require('bcryptjs');

const adminIds = [
  '11111111-aaaa-aaaa-aaaa-111111111111',
  '22222222-bbbb-bbbb-bbbb-222222222222',
  '33333333-cccc-cccc-cccc-333333333333',
  '44444444-dddd-dddd-dddd-444444444444',
  '55555555-eeee-eeee-eeee-555555555555',
  '66666666-ffff-ffff-ffff-666666666666',
  '77777777-gggg-gggg-gggg-777777777777'
];

module.exports = {
  up: async (queryInterface) => {
    const hash = await bcrypt.hash('admin123', 10);
    const now = new Date();
    await queryInterface.bulkInsert('administrateurs', [
      { id: adminIds[0], nom: 'Admin 1', email: 'admin1@artizone.com', motDePasse: hash, createdAt: now, updatedAt: now },
      { id: adminIds[1], nom: 'Admin 2', email: 'admin2@artizone.com', motDePasse: hash, createdAt: now, updatedAt: now },
      { id: adminIds[2], nom: 'Admin 3', email: 'admin3@artizone.com', motDePasse: hash, createdAt: now, updatedAt: now },
      { id: adminIds[3], nom: 'Admin 4', email: 'admin4@artizone.com', motDePasse: hash, createdAt: now, updatedAt: now },
      { id: adminIds[4], nom: 'Admin 5', email: 'admin5@artizone.com', motDePasse: hash, createdAt: now, updatedAt: now },
      { id: adminIds[5], nom: 'Admin 6', email: 'admin6@artizone.com', motDePasse: hash, createdAt: now, updatedAt: now },
      { id: adminIds[6], nom: 'Admin 7', email: 'admin7@artizone.com', motDePasse: hash, createdAt: now, updatedAt: now }
    ], {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('administrateurs', null, {});
  }
}; 