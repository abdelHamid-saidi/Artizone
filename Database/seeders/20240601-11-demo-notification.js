'use strict';
const notificationIds = [
  'n1n1n1n1-1111-1111-1111-111111111111',
  'n2n2n2n2-2222-2222-2222-222222222222',
  'n3n3n3n3-3333-3333-3333-333333333333',
  'n4n4n4n4-4444-4444-4444-444444444444',
  'n5n5n5n5-5555-5555-5555-555555555555',
  'n6n6n6n6-6666-6666-6666-666666666666',
  'n7n7n7n7-7777-7777-7777-777777777777'
];
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
    const now = new Date();
    await queryInterface.bulkInsert('notifications', [
      { id: notificationIds[0], type: 'commande', contenu: 'Votre commande a été reçue', dateEnvoi: now, statut: 'envoyée', particulierId: particulierIds[0], createdAt: now, updatedAt: now },
      { id: notificationIds[1], type: 'paiement', contenu: 'Paiement accepté', dateEnvoi: now, statut: 'envoyée', particulierId: particulierIds[1], createdAt: now, updatedAt: now },
      { id: notificationIds[2], type: 'commande', contenu: 'Commande validée', dateEnvoi: now, statut: 'envoyée', particulierId: particulierIds[2], createdAt: now, updatedAt: now },
      { id: notificationIds[3], type: 'commande', contenu: 'Commande refusée', dateEnvoi: now, statut: 'envoyée', particulierId: particulierIds[3], createdAt: now, updatedAt: now },
      { id: notificationIds[4], type: 'paiement', contenu: 'Paiement en attente', dateEnvoi: now, statut: 'envoyée', particulierId: particulierIds[4], createdAt: now, updatedAt: now },
      { id: notificationIds[5], type: 'commande', contenu: 'Commande en cours', dateEnvoi: now, statut: 'envoyée', particulierId: particulierIds[5], createdAt: now, updatedAt: now },
      { id: notificationIds[6], type: 'commande', contenu: 'Commande terminée', dateEnvoi: now, statut: 'envoyée', particulierId: particulierIds[6], createdAt: now, updatedAt: now }
    ], {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('notifications', null, {});
  }
}; 