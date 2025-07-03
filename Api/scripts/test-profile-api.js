#!/usr/bin/env node

const axios = require('axios');

/**
 * Script de test pour l'API de profil
 * Usage: node scripts/test-profile-api.js
 */

const API_BASE_URL = 'http://172.20.10.2:3000/api';

async function testProfileAPI() {
  console.log('🧪 === TEST API PROFIL ===\n');
  
  try {
    // Test 1: Vérifier que l'API est accessible
    console.log('1️⃣ Test de connectivité...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ API accessible:', healthResponse.data);
    
    // Test 2: Connexion avec un utilisateur test
    console.log('\n2️⃣ Test de connexion...');
    const loginData = {
      email: 'test@example.com',
      motDePasse: 'password123'
    };
    
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/particulier/login`, loginData);
    const token = loginResponse.data.token;
    console.log('✅ Connexion réussie, token obtenu');
    
    // Test 3: Récupération du profil
    console.log('\n3️⃣ Test de récupération du profil...');
    const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Profil récupéré:', profileResponse.data);
    
    // Test 4: Mise à jour du profil
    console.log('\n4️⃣ Test de mise à jour du profil...');
    const updateData = {
      nom: 'Test User Updated',
      telephone: '+33 6 12 34 56 78'
    };
    
    const updateResponse = await axios.put(`${API_BASE_URL}/auth/profile`, updateData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Profil mis à jour:', updateResponse.data);
    
    console.log('\n🎉 Tous les tests sont passés avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('💡 Suggestion: Vérifiez que l\'utilisateur test existe dans la base de données');
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Suggestion: Vérifiez que l\'API est démarrée sur le port 3000');
    }
  }
}

// Exécuter le test si le script est appelé directement
if (require.main === module) {
  testProfileAPI();
}

module.exports = { testProfileAPI }; 