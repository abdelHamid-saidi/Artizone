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

const adresseParticulierIds = [
  'a1a1a1a1-aaaa-aaaa-aaaa-111111111111',
  'b2b2b2b2-bbbb-bbbb-bbbb-222222222222',
  'c3c3c3c3-cccc-cccc-cccc-333333333333',
  'd4d4d4d4-dddd-dddd-dddd-444444444444',
  'e5e5e5e5-eeee-eeee-eeee-555555555555',
  'f6f6f6f6-ffff-ffff-ffff-666666666666',
  'g7g7g7g7-gggg-gggg-gggg-777777777777'
];

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    await queryInterface.bulkInsert('adresses_particulier', [
      { id: adresseParticulierIds[0], rue: '1 rue de Paris', ville: 'Paris', codePostal: '75001', pays: 'France', latitude: 48.86, longitude: 2.35, particulierId: particulierIds[0], createdAt: now, updatedAt: now },
      { id: adresseParticulierIds[1], rue: '2 rue de Lyon', ville: 'Lyon', codePostal: '69001', pays: 'France', latitude: 45.76, longitude: 4.83, particulierId: particulierIds[1], createdAt: now, updatedAt: now },
      { id: adresseParticulierIds[2], rue: '3 rue de Lille', ville: 'Lille', codePostal: '59000', pays: 'France', latitude: 50.63, longitude: 3.06, particulierId: particulierIds[2], createdAt: now, updatedAt: now },
      { id: adresseParticulierIds[3], rue: '4 rue de Bordeaux', ville: 'Bordeaux', codePostal: '33000', pays: 'France', latitude: 44.84, longitude: -0.58, particulierId: particulierIds[3], createdAt: now, updatedAt: now },
      { id: adresseParticulierIds[4], rue: '5 rue de Nice', ville: 'Nice', codePostal: '06000', pays: 'France', latitude: 43.70, longitude: 7.27, particulierId: particulierIds[4], createdAt: now, updatedAt: now },
      { id: adresseParticulierIds[5], rue: '6 rue de Nantes', ville: 'Nantes', codePostal: '44000', pays: 'France', latitude: 47.22, longitude: -1.55, particulierId: particulierIds[5], createdAt: now, updatedAt: now },
      { id: adresseParticulierIds[6], rue: '7 rue de Marseille', ville: 'Marseille', codePostal: '13000', pays: 'France', latitude: 43.30, longitude: 5.37, particulierId: particulierIds[6], createdAt: now, updatedAt: now }
    ], {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('adresses_particulier', null, {});
  }
}; 