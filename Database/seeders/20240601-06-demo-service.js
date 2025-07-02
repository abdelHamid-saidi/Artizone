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
const serviceIds = [
  'aaaa1111-1111-1111-1111-111111111111',
  'bbbb2222-2222-2222-2222-222222222222',
  'cccc3333-3333-3333-3333-333333333333',
  'dddd4444-4444-4444-4444-444444444444',
  'eeee5555-5555-5555-5555-555555555555',
  'ffff6666-6666-6666-6666-666666666666',
  'gggg7777-7777-7777-7777-777777777777'
];
const categorieIds = [
  'cat1111-1111-1111-1111-111111111111', // Plomberie
  'cat2222-2222-2222-2222-222222222222', // Électricité
  'cat3333-3333-3333-3333-333333333333', // Chauffage
  'cat4444-4444-4444-4444-444444444444', // Menuiserie
  'cat5555-5555-5555-5555-555555555555', // Maçonnerie
  'cat6666-6666-6666-6666-666666666666', // Peinture
  'cat7777-7777-7777-7777-777777777777'  // Serrurerie
];

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    await queryInterface.bulkInsert('services', [
      { id: serviceIds[0], nom: 'Plomberie', description: 'Réparation fuite', prixUnitaire: 80, dureeEstimee: '1h', artisanId: artisanIds[0], categorieId: categorieIds[0], createdAt: now, updatedAt: now },
      { id: serviceIds[1], nom: 'Électricité', description: 'Installation prise', prixUnitaire: 60, dureeEstimee: '45min', artisanId: artisanIds[1], categorieId: categorieIds[1], createdAt: now, updatedAt: now },
      { id: serviceIds[2], nom: 'Chauffage', description: 'Entretien chaudière', prixUnitaire: 120, dureeEstimee: '2h', artisanId: artisanIds[2], categorieId: categorieIds[2], createdAt: now, updatedAt: now },
      { id: serviceIds[3], nom: 'Menuiserie', description: 'Pose porte', prixUnitaire: 150, dureeEstimee: '2h', artisanId: artisanIds[3], categorieId: categorieIds[3], createdAt: now, updatedAt: now },
      { id: serviceIds[4], nom: 'Maçonnerie', description: 'Réparation mur', prixUnitaire: 200, dureeEstimee: '3h', artisanId: artisanIds[4], categorieId: categorieIds[4], createdAt: now, updatedAt: now },
      { id: serviceIds[5], nom: 'Peinture', description: 'Peinture chambre', prixUnitaire: 100, dureeEstimee: '1h30', artisanId: artisanIds[5], categorieId: categorieIds[5], createdAt: now, updatedAt: now },
      { id: serviceIds[6], nom: 'Serrurerie', description: 'Ouverture porte', prixUnitaire: 90, dureeEstimee: '1h', artisanId: artisanIds[6], categorieId: categorieIds[6], createdAt: now, updatedAt: now }
    ], {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('services', null, {});
  }
}; 