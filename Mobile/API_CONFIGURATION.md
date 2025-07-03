# 🔧 Configuration API - Artizone Mobile

## 📋 Vue d'ensemble

Ce document explique comment configurer la communication entre l'application mobile Artizone et l'API backend.

## 🌐 Configuration des adresses IP

### Problème courant
React Native/Expo ne peut pas accéder à `localhost` depuis un appareil physique ou un émulateur. Il faut utiliser l'adresse IP de votre machine.

### Solution

#### 1. Détecter votre adresse IP locale
```bash
# Dans le dossier Mobile
npm run get-ip
```

#### 2. Configurer l'API dans l'application mobile
Modifiez `src/config/api.ts` :
```typescript
const ENV = {
  development: {
    // Remplacez par votre adresse IP locale
    API_BASE_URL: 'http://172.20.10.2:3000/api',
  },
  // ...
};
```

#### 3. Configurer CORS côté serveur
L'API backend doit autoriser les requêtes depuis votre IP. Modifiez `Api/app.js` :
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://172.20.10.2:3000', // Votre IP locale
'http://172.20.10.2:8081', // Metro bundler
    // ...
  ],
  // ...
};
```

## 🔄 Étapes de configuration

### Étape 1 : Démarrer l'API
```bash
cd Api
npm start
```

### Étape 2 : Détecter l'IP
```bash
cd Mobile
npm run get-ip
```

### Étape 3 : Configurer l'application mobile
1. Copiez l'URL API affichée
2. Modifiez `src/config/api.ts`
3. Remplacez `API_BASE_URL`

### Étape 4 : Redémarrer l'application mobile
```bash
npm start
```

## 🚨 Résolution des problèmes

### Erreur CORS
```
Access to fetch at 'http://localhost:3000/api/auth/particulier/login' 
from origin 'http://localhost:8081' has been blocked by CORS policy
```

**Solution :**
1. Vérifiez que l'API utilise l'adresse IP correcte
2. Redémarrez le serveur API
3. Vérifiez la configuration CORS

### Erreur de connexion réseau
```
net::ERR_FAILED
```

**Solution :**
1. Vérifiez que l'API est démarrée
2. Vérifiez l'adresse IP dans la configuration
3. Testez la connectivité : `ping 172.20.10.2`

### Erreur de timeout
```
Délai d'attente dépassé. Vérifiez votre connexion internet.
```

**Solution :**
1. Augmentez `API_TIMEOUT` dans `src/config/api.ts`
2. Vérifiez la performance réseau
3. Vérifiez que l'API répond rapidement

## 📱 Test de la configuration

### Test simple
```javascript
// Dans la console de l'app mobile
console.log('API URL:', API_CONFIG.API_BASE_URL);
```

### Test de connexion
1. Ouvrez l'application mobile
2. Allez à l'écran de connexion
3. Essayez de vous connecter avec des identifiants valides
4. Vérifiez les logs dans la console

## 🔧 Configuration avancée

### Variables d'environnement
Vous pouvez utiliser des variables d'environnement pour différentes configurations :

```typescript
const ENV = {
  development: {
    API_BASE_URL: process.env.API_URL || 'http://172.20.10.2:3000/api',
  },
  // ...
};
```

### Configuration automatique
Pour une configuration plus avancée, vous pouvez :
1. Détecter automatiquement l'IP
2. Utiliser des services de découverte
3. Configurer des fallbacks

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs de l'API
2. Vérifiez les logs de l'application mobile
3. Testez la connectivité réseau
4. Consultez la documentation Expo/React Native 