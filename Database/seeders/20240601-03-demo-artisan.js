'use strict';
const artisanIds = [
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666',
  '77777777-7777-7777-7777-777777777777'
];
module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    await queryInterface.bulkInsert('artisans', [
      { id: artisanIds[0], nom: 'Jean Plombier', telephone: '0700000001', langue: 'fr', noteMoyenne: 4.8, createdAt: now, updatedAt: now },
      { id: artisanIds[1], nom: 'Sophie Electricienne', telephone: '0700000002', langue: 'fr', noteMoyenne: 4.6, createdAt: now, updatedAt: now },
      { id: artisanIds[2], nom: 'Karim Chauffagiste', telephone: '0700000003', langue: 'fr', noteMoyenne: 4.7, createdAt: now, updatedAt: now },
      { id: artisanIds[3], nom: 'Lucie Menuisière', telephone: '0700000004', langue: 'fr', noteMoyenne: 4.9, createdAt: now, updatedAt: now },
      { id: artisanIds[4], nom: 'Paul Maçon', telephone: '0700000005', langue: 'fr', noteMoyenne: 4.5, createdAt: now, updatedAt: now },
      { id: artisanIds[5], nom: 'Nadia Peintre', telephone: '0700000006', langue: 'fr', noteMoyenne: 4.4, createdAt: now, updatedAt: now },
      { id: artisanIds[6], nom: 'Olivier Serrurier', telephone: '0700000007', langue: 'fr', noteMoyenne: 4.3, createdAt: now, updatedAt: now }
    ], {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('artisans', null, {});
  }
}; 