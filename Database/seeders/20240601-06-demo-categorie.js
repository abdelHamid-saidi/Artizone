'use strict';
const categorieIds = [
  'cat1111-1111-1111-1111-111111111111',
  'cat2222-2222-2222-2222-222222222222',
  'cat3333-3333-3333-3333-333333333333',
  'cat4444-4444-4444-4444-444444444444',
  'cat5555-5555-5555-5555-555555555555',
  'cat6666-6666-6666-6666-666666666666',
  'cat7777-7777-7777-7777-777777777777',
  'cat8888-8888-8888-8888-888888888888'
];

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    await queryInterface.bulkInsert('categories', [
      { 
        id: categorieIds[0], 
        nom: 'Plomberie', 
        description: 'Services de plomberie et réparation d\'installations sanitaires',
        icone: 'faucet',
        couleur: '#0066cc',
        createdAt: now, 
        updatedAt: now 
      },
      { 
        id: categorieIds[1], 
        nom: 'Électricité', 
        description: 'Installation et réparation d\'équipements électriques',
        icone: 'bolt',
        couleur: '#ffcc00',
        createdAt: now, 
        updatedAt: now 
      },
      { 
        id: categorieIds[2], 
        nom: 'Chauffage', 
        description: 'Installation et entretien de systèmes de chauffage',
        icone: 'fire',
        couleur: '#ff6600',
        createdAt: now, 
        updatedAt: now 
      },
      { 
        id: categorieIds[3], 
        nom: 'Menuiserie', 
        description: 'Travaux de menuiserie et pose d\'éléments en bois',
        icone: 'hammer',
        couleur: '#8b4513',
        createdAt: now, 
        updatedAt: now 
      },
      { 
        id: categorieIds[4], 
        nom: 'Maçonnerie', 
        description: 'Travaux de construction et réparation de murs',
        icone: 'building',
        couleur: '#666666',
        createdAt: now, 
        updatedAt: now 
      },
      { 
        id: categorieIds[5], 
        nom: 'Peinture', 
        description: 'Services de peinture et décoration intérieure',
        icone: 'paint-brush',
        couleur: '#ff69b4',
        createdAt: now, 
        updatedAt: now 
      },
      { 
        id: categorieIds[6], 
        nom: 'Serrurerie', 
        description: 'Services de serrurerie et sécurité',
        icone: 'key',
        couleur: '#333333',
        createdAt: now, 
        updatedAt: now 
      },
      { 
        id: categorieIds[7], 
        nom: 'Jardinage', 
        description: 'Entretien et aménagement de jardins',
        icone: 'leaf',
        couleur: '#228b22',
        createdAt: now, 
        updatedAt: now 
      }
    ], {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('categories', null, {});
  }
}; 