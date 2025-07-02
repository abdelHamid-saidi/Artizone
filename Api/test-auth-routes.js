const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE_URL = 'http://localhost:3000/api';

// Fonction utilitaire pour tester les routes
async function testRoute(method, endpoint, data = null, customHeaders = {}) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...customHeaders
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    console.log(`\n🔍 Test: ${method} ${endpoint}`);
    if (data) {
      console.log('📤 Données envoyées:', data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const responseData = await response.json();

    console.log(`📊 Status: ${response.status}`);
    console.log('📥 Réponse:', JSON.stringify(responseData, null, 2));

    return { success: response.ok, data: responseData, status: response.status };
  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Tests des routes d'authentification
async function runAuthTests() {
  console.log('🚀 Tests des routes d\'authentification Artizone\n');

  // Test 1: Inscription particulier
  console.log('='.repeat(50));
  console.log('TEST 1: Inscription particulier');
  console.log('='.repeat(50));
  
  const particulierData = {
    nom: 'Jean Dupont',
    email: 'jean.dupont@test.com',
    motDePasse: 'password123',
    telephone: '0123456789'
  };

  const registerResult = await testRoute('POST', '/auth/particulier/register', particulierData);

  // Test 2: Connexion particulier
  console.log('\n' + '='.repeat(50));
  console.log('TEST 2: Connexion particulier');
  console.log('='.repeat(50));
  
  const loginData = {
    email: 'jean.dupont@test.com',
    motDePasse: 'password123'
  };

  const loginResult = await testRoute('POST', '/auth/particulier/login', loginData);

  // Test 3: Inscription administrateur
  console.log('\n' + '='.repeat(50));
  console.log('TEST 3: Inscription administrateur');
  console.log('='.repeat(50));
  
  const adminData = {
    nom: 'Admin Test',
    email: 'admin@test.com',
    motDePasse: 'admin123'
  };

  const adminRegisterResult = await testRoute('POST', '/auth/admin/register', adminData);

  // Test 4: Connexion administrateur
  console.log('\n' + '='.repeat(50));
  console.log('TEST 4: Connexion administrateur');
  console.log('='.repeat(50));
  
  const adminLoginData = {
    email: 'admin@test.com',
    motDePasse: 'admin123'
  };

  const adminLoginResult = await testRoute('POST', '/auth/admin/login', adminLoginData);

  // Test 5: Route legacy (mixte)
  console.log('\n' + '='.repeat(50));
  console.log('TEST 5: Route legacy (connexion mixte)');
  console.log('='.repeat(50));
  
  const legacyLoginResult = await testRoute('POST', '/auth/login', loginData);

  // Test 6: Vérification de token (si connexion réussie)
  if (loginResult.success && loginResult.data.token) {
    console.log('\n' + '='.repeat(50));
    console.log('TEST 6: Vérification de token');
    console.log('='.repeat(50));
    
    const verifyResult = await testRoute('GET', '/auth/verify', null, {
      'Authorization': `Bearer ${loginResult.data.token}`
    });
  }

  // Résumé des tests
  console.log('\n' + '='.repeat(50));
  console.log('📋 RÉSUMÉ DES TESTS');
  console.log('='.repeat(50));
  
  const tests = [
    { name: 'Inscription particulier', result: registerResult },
    { name: 'Connexion particulier', result: loginResult },
    { name: 'Inscription admin', result: adminRegisterResult },
    { name: 'Connexion admin', result: adminLoginResult },
    { name: 'Route legacy', result: legacyLoginResult }
  ];

  tests.forEach(test => {
    const status = test.result.success ? '✅' : '❌';
    console.log(`${status} ${test.name}: ${test.result.success ? 'SUCCÈS' : 'ÉCHEC'} (${test.result.status || 'N/A'})`);
  });

  console.log('\n🎉 Tests terminés !');
}

// Exécuter les tests
runAuthTests().catch(console.error); 