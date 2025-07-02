const http = require('http');

// Test de la route de santé
const testHealth = () => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('Réponse:', data);
    });
  });

  req.on('error', (e) => {
    console.error(`Erreur: ${e.message}`);
  });

  req.end();
};

// Test de la route d'inscription
const testRegister = () => {
  const postData = JSON.stringify({
    nom: 'Test User',
    email: 'test@example.com',
    motDePasse: 'password123',
    telephone: '0123456789'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('Réponse:', data);
    });
  });

  req.on('error', (e) => {
    console.error(`Erreur: ${e.message}`);
  });

  req.write(postData);
  req.end();
};

console.log('Test de la route de santé...');
testHealth();

setTimeout(() => {
  console.log('\nTest de la route d\'inscription...');
  testRegister();
}, 1000); 