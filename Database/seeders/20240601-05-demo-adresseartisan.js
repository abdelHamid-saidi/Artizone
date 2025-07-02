'use strict';
const { v4: uuidv4 } = require('uuid');
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
    await queryInterface.bulkInsert('adresses_artisan', [
      { id: uuidv4(), rue: '1 rue des Artisans', ville: 'Paris', codePostal: '75001', pays: 'France', latitude: 48.86, longitude: 2.35, artisanId: artisanIds[0], createdAt: now, updatedAt: now },
      { id: uuidv4(), rue: '2 rue des Artisans', ville: 'Lyon', codePostal: '69001', pays: 'France', latitude: 45.76, longitude: 4.83, artisanId: artisanIds[1], createdAt: now, updatedAt: now },
      { id: uuidv4(), rue: '3 rue des Artisans', ville: 'Lille', codePostal: '59000', pays: 'France', latitude: 50.63, longitude: 3.06, artisanId: artisanIds[2], createdAt: now, updatedAt: now },
      { id: uuidv4(), rue: '4 rue des Artisans', ville: 'Bordeaux', codePostal: '33000', pays: 'France', latitude: 44.84, longitude: -0.58, artisanId: artisanIds[3], createdAt: now, updatedAt: now },
      { id: uuidv4(), rue: '5 rue des Artisans', ville: 'Nice', codePostal: '06000', pays: 'France', latitude: 43.70, longitude: 7.27, artisanId: artisanIds[4], createdAt: now, updatedAt: now },
      { id: uuidv4(), rue: '6 rue des Artisans', ville: 'Nantes', codePostal: '44000', pays: 'France', latitude: 47.22, longitude: -1.55, artisanId: artisanIds[5], createdAt: now, updatedAt: now },
      { id: uuidv4(), rue: '7 rue des Artisans', ville: 'Marseille', codePostal: '13000', pays: 'France', latitude: 43.30, longitude: 5.37, artisanId: artisanIds[6], createdAt: now, updatedAt: now }
    ], {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('adresses_artisan', null, {});
  }
}; 