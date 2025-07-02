'use strict';
const avisIds = [
  'a1a1a1a1-1111-1111-1111-111111111111',
  'a2a2a2a2-2222-2222-2222-222222222222',
  'a3a3a3a3-3333-3333-3333-333333333333',
  'a4a4a4a4-4444-4444-4444-444444444444',
  'a5a5a5a5-5555-5555-5555-555555555555',
  'a6a6a6a6-6666-6666-6666-666666666666',
  'a7a7a7a7-7777-7777-7777-777777777777'
];
const commandeIds = [
  'c1c1c1c1-1111-1111-1111-111111111111',
  'c2c2c2c2-2222-2222-2222-222222222222',
  'c3c3c3c3-3333-3333-3333-333333333333',
  'c4c4c4c4-4444-4444-4444-444444444444',
  'c5c5c5c5-5555-5555-5555-555555555555',
  'c6c6c6c6-6666-6666-6666-666666666666',
  'c7c7c7c7-7777-7777-7777-777777777777'
];

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    await queryInterface.bulkInsert('avis', [
      { id: avisIds[0], note: 5, commentaire: 'Excellent travail', date: now, commandeId: commandeIds[0], createdAt: now, updatedAt: now },
      { id: avisIds[1], note: 4, commentaire: 'Très bien', date: now, commandeId: commandeIds[1], createdAt: now, updatedAt: now },
      { id: avisIds[2], note: 3, commentaire: 'Correct', date: now, commandeId: commandeIds[2], createdAt: now, updatedAt: now },
      { id: avisIds[3], note: 5, commentaire: 'Rapide et efficace', date: now, commandeId: commandeIds[3], createdAt: now, updatedAt: now },
      { id: avisIds[4], note: 2, commentaire: 'Peut mieux faire', date: now, commandeId: commandeIds[4], createdAt: now, updatedAt: now },
      { id: avisIds[5], note: 4, commentaire: 'Satisfait', date: now, commandeId: commandeIds[5], createdAt: now, updatedAt: now },
      { id: avisIds[6], note: 5, commentaire: 'Parfait', date: now, commandeId: commandeIds[6], createdAt: now, updatedAt: now }
    ], {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('avis', null, {});
  }
}; 