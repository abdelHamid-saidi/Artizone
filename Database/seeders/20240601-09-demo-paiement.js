'use strict';
const paiementIds = [
  'p1p1p1p1-1111-1111-1111-111111111111',
  'p2p2p2p2-2222-2222-2222-222222222222',
  'p3p3p3p3-3333-3333-3333-333333333333',
  'p4p4p4p4-4444-4444-4444-444444444444',
  'p5p5p5p5-5555-5555-5555-555555555555',
  'p6p6p6p6-6666-6666-6666-666666666666',
  'p7p7p7p7-7777-7777-7777-777777777777'
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
    await queryInterface.bulkInsert('paiements', [
      { id: paiementIds[0], montant: 80, methode: 'carte', date: now, statut: 'en_attente', commandeId: commandeIds[0], createdAt: now, updatedAt: now },
      { id: paiementIds[1], montant: 60, methode: 'carte', date: now, statut: 'payé', commandeId: commandeIds[1], createdAt: now, updatedAt: now },
      { id: paiementIds[2], montant: 120, methode: 'paypal', date: now, statut: 'refusé', commandeId: commandeIds[2], createdAt: now, updatedAt: now },
      { id: paiementIds[3], montant: 150, methode: 'carte', date: now, statut: 'payé', commandeId: commandeIds[3], createdAt: now, updatedAt: now },
      { id: paiementIds[4], montant: 200, methode: 'carte', date: now, statut: 'en_attente', commandeId: commandeIds[4], createdAt: now, updatedAt: now },
      { id: paiementIds[5], montant: 100, methode: 'paypal', date: now, statut: 'payé', commandeId: commandeIds[5], createdAt: now, updatedAt: now },
      { id: paiementIds[6], montant: 90, methode: 'carte', date: now, statut: 'payé', commandeId: commandeIds[6], createdAt: now, updatedAt: now }
    ], {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('paiements', null, {});
  }
}; 