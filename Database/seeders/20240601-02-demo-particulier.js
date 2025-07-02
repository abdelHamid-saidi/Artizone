'use strict';
const bcrypt = require('bcryptjs');

const particulierIds = [
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
    const hash = await bcrypt.hash('password123', 10);
    const now = new Date();
    await queryInterface.bulkInsert('particuliers', [
      { id: particulierIds[0], nom: 'Alice Martin', email: 'alice1@mail.com', motDePasse: hash, telephone: '0600000001', createdAt: now, updatedAt: now },
      { id: particulierIds[1], nom: 'Bob Dupont', email: 'bob2@mail.com', motDePasse: hash, telephone: '0600000002', createdAt: now, updatedAt: now },
      { id: particulierIds[2], nom: 'Chloé Bernard', email: 'chloe3@mail.com', motDePasse: hash, telephone: '0600000003', createdAt: now, updatedAt: now },
      { id: particulierIds[3], nom: 'David Petit', email: 'david4@mail.com', motDePasse: hash, telephone: '0600000004', createdAt: now, updatedAt: now },
      { id: particulierIds[4], nom: 'Emma Leroy', email: 'emma5@mail.com', motDePasse: hash, telephone: '0600000005', createdAt: now, updatedAt: now },
      { id: particulierIds[5], nom: 'Félix Moreau', email: 'felix6@mail.com', motDePasse: hash, telephone: '0600000006', createdAt: now, updatedAt: now },
      { id: particulierIds[6], nom: 'Gisèle Laurent', email: 'gisele7@mail.com', motDePasse: hash, telephone: '0600000007', createdAt: now, updatedAt: now }
    ], {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('particuliers', null, {});
  }
}; 