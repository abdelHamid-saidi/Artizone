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
const disponibiliteIds = [
  '1111aaaa-aaaa-aaaa-aaaa-111111111111',
  '2222bbbb-bbbb-bbbb-bbbb-222222222222',
  '3333cccc-cccc-cccc-cccc-333333333333',
  '4444dddd-dddd-dddd-dddd-444444444444',
  '5555eeee-eeee-eeee-eeee-555555555555',
  '6666ffff-ffff-ffff-ffff-666666666666',
  '7777gggg-gggg-gggg-gggg-777777777777'
];

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    await queryInterface.bulkInsert('disponibilites', [
      { id: disponibiliteIds[0], jour: 'Lundi', heureDebut: '08:00', heureFin: '12:00', isDisponible: true, artisanId: artisanIds[0], createdAt: now, updatedAt: now },
      { id: disponibiliteIds[1], jour: 'Mardi', heureDebut: '09:00', heureFin: '13:00', isDisponible: true, artisanId: artisanIds[1], createdAt: now, updatedAt: now },
      { id: disponibiliteIds[2], jour: 'Mercredi', heureDebut: '10:00', heureFin: '14:00', isDisponible: true, artisanId: artisanIds[2], createdAt: now, updatedAt: now },
      { id: disponibiliteIds[3], jour: 'Jeudi', heureDebut: '11:00', heureFin: '15:00', isDisponible: true, artisanId: artisanIds[3], createdAt: now, updatedAt: now },
      { id: disponibiliteIds[4], jour: 'Vendredi', heureDebut: '12:00', heureFin: '16:00', isDisponible: true, artisanId: artisanIds[4], createdAt: now, updatedAt: now },
      { id: disponibiliteIds[5], jour: 'Samedi', heureDebut: '13:00', heureFin: '17:00', isDisponible: true, artisanId: artisanIds[5], createdAt: now, updatedAt: now },
      { id: disponibiliteIds[6], jour: 'Dimanche', heureDebut: '14:00', heureFin: '18:00', isDisponible: true, artisanId: artisanIds[6], createdAt: now, updatedAt: now }
    ], {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('disponibilites', null, {});
  }
}; 