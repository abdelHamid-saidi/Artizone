#!/usr/bin/env node

const os = require('os');

/**
 * Script utilitaire pour détecter l'adresse IP locale
 * Usage: node scripts/get-local-ip.js
 */

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Ignorer les interfaces non IPv4 et les adresses locales
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push({
          name: name,
          address: iface.address,
          netmask: iface.netmask
        });
      }
    }
  }

  return addresses;
}

function main() {
  console.log('🔍 Détection de l\'adresse IP locale...\n');
  
  const addresses = getLocalIP();
  
  if (addresses.length === 0) {
    console.log('❌ Aucune adresse IP locale trouvée');
    return;
  }

  console.log('📱 Adresses IP disponibles pour React Native/Expo :\n');
  
  addresses.forEach((addr, index) => {
    console.log(`${index + 1}. Interface: ${addr.name}`);
    console.log(`   IP: ${addr.address}`);
    console.log(`   URL API: http://${addr.address}:3000/api`);
    console.log('');
  });

  console.log('💡 Pour utiliser une de ces adresses :');
  console.log('   1. Copiez l\'URL API souhaitée');
  console.log('   2. Modifiez Mobile/src/config/api.ts');
  console.log('   3. Remplacez API_BASE_URL par l\'URL copiée');
  console.log('   4. Redémarrez votre application mobile\n');

  console.log('🔧 Exemple de configuration :');
      console.log('   API_BASE_URL: \'http://192.168.1.56:3000/api\'');
}

if (require.main === module) {
  main();
}

module.exports = { getLocalIP }; 