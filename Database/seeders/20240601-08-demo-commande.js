'use strict';
const { v4: uuidv4 } = require('uuid');

const particulierIds = [
  '11111111-aaaa-aaaa-aaaa-111111111111',
  '22222222-bbbb-bbbb-bbbb-222222222222',
  '33333333-cccc-cccc-cccc-333333333333',
  '44444444-dddd-dddd-dddd-444444444444',
  '55555555-eeee-eeee-eeee-555555555555',
  '66666666-ffff-ffff-ffff-666666666666',
  '77777777-gggg-gggg-gggg-777777777777'
];
const serviceIds = [
  'aaaa1111-1111-1111-1111-111111111111',
  'bbbb2222-2222-2222-2222-222222222222',
  'cccc3333-3333-3333-3333-333333333333',
  'dddd4444-4444-4444-4444-444444444444',
  'eeee5555-5555-5555-5555-555555555555',
  'ffff6666-6666-6666-6666-666666666666',
  'gggg7777-7777-7777-7777-777777777777'
];
const disponibiliteIds = [
  '1111aaaa-aaaa-aaaa-aaaa-111111111111',
  '2222bbbb-bbbb-bbbb-bbbb-222222222222',
  '3333cccc-cccc-cccc-cccc-333333333333',
  '4444dddd-dddd-dddd-dddd-444444444444',
  '5555eeee-eeee-eeee-eeee-555555555555',
  '6666ffff-ffff-ffff-ffff-666666666666',
  '7777gggg-gggg-gggg-gggg-777777777777'
];
const adresseParticulierIds = [
  'a1a1a1a1-aaaa-aaaa-aaaa-111111111111',
  'b2b2b2b2-bbbb-bbbb-bbbb-222222222222',
  'c3c3c3c3-cccc-cccc-cccc-333333333333',
  'd4d4d4d4-dddd-dddd-dddd-444444444444',
  'e5e5e5e5-eeee-eeee-eeee-555555555555',
  'f6f6f6f6-ffff-ffff-ffff-666666666666',
  'g7g7g7g7-gggg-gggg-gggg-777777777777'
];
const artisanIds = [
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666',
  '77777777-7777-7777-7777-777777777777'
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
    await queryInterface.bulkInsert('commandes', [
      { id: commandeIds[0], dateCommande: now, statut: 'en_attente_paiement', description: 'Commande 1', prixTotal: 80, particulierId: particulierIds[0], serviceId: serviceIds[0], disponibiliteId: disponibiliteIds[0], adresseParticulierId: adresseParticulierIds[0], artisanId: artisanIds[0], createdAt: now, updatedAt: now },
      { id: commandeIds[1], dateCommande: now, statut: 'payée', description: 'Commande 2', prixTotal: 60, particulierId: particulierIds[1], serviceId: serviceIds[1], disponibiliteId: disponibiliteIds[1], adresseParticulierId: adresseParticulierIds[1], artisanId: artisanIds[1], createdAt: now, updatedAt: now },
      { id: commandeIds[2], dateCommande: now, statut: 'refusée', description: 'Commande 3', prixTotal: 120, particulierId: particulierIds[2], serviceId: serviceIds[2], disponibiliteId: disponibiliteIds[2], adresseParticulierId: adresseParticulierIds[2], artisanId: artisanIds[2], createdAt: now, updatedAt: now },
      { id: commandeIds[3], dateCommande: now, statut: 'payée', description: 'Commande 4', prixTotal: 150, particulierId: particulierIds[3], serviceId: serviceIds[3], disponibiliteId: disponibiliteIds[3], adresseParticulierId: adresseParticulierIds[3], artisanId: artisanIds[3], createdAt: now, updatedAt: now },
      { id: commandeIds[4], dateCommande: now, statut: 'en_attente_paiement', description: 'Commande 5', prixTotal: 200, particulierId: particulierIds[4], serviceId: serviceIds[4], disponibiliteId: disponibiliteIds[4], adresseParticulierId: adresseParticulierIds[4], artisanId: artisanIds[4], createdAt: now, updatedAt: now },
      { id: commandeIds[5], dateCommande: now, statut: 'payée', description: 'Commande 6', prixTotal: 100, particulierId: particulierIds[5], serviceId: serviceIds[5], disponibiliteId: disponibiliteIds[5], adresseParticulierId: adresseParticulierIds[5], artisanId: artisanIds[5], createdAt: now, updatedAt: now },
      { id: commandeIds[6], dateCommande: now, statut: 'payée', description: 'Commande 7', prixTotal: 90, particulierId: particulierIds[6], serviceId: serviceIds[6], disponibiliteId: disponibiliteIds[6], adresseParticulierId: adresseParticulierIds[6], artisanId: artisanIds[6], createdAt: now, updatedAt: now }
    ], {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('commandes', null, {});
  }
}; 