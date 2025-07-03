# Guide de Dépannage - Notifications

## Problème : Impossible de récupérer les notifications

### 🔍 Étapes de diagnostic

#### 1. Vérifier que l'API est démarrée
```bash
# Dans le dossier Api
cd Api
npm start
```

**Vérification :** L'API doit afficher un message comme "Serveur démarré sur le port 3000"

#### 2. Tester la base de données
```bash
# Dans le dossier Api
node scripts/test-notifications.js
```

Ce script va :
- Vérifier la connexion à la base de données
- Créer la table notifications si elle n'existe pas
- Créer des notifications de test
- Tester la récupération

#### 3. Vérifier la configuration de l'API côté mobile

**Fichier :** `Mobile/src/config/api.ts`

Assurez-vous que l'URL correspond à votre configuration :
```typescript
API_BASE_URL: 'http://10.92.4.40:3000/api', // Remplacez par votre IP
```

**Pour trouver votre IP :**
- Windows : `ipconfig` dans le terminal
- Mac/Linux : `ifconfig` ou `ip addr`

#### 4. Tester l'endpoint API directement

Avec Postman ou curl :
```bash
curl -X GET "http://10.92.4.40:3000/api/notifications/particulier/VOTRE_USER_ID" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json"
```

#### 5. Vérifier l'authentification

Dans l'app mobile, vérifiez que :
- L'utilisateur est bien connecté
- Le token d'authentification est valide
- L'ID utilisateur est correct

### 🐛 Problèmes courants et solutions

#### Problème 1 : "Accès non autorisé" (403)
**Cause :** L'utilisateur n'est pas autorisé à accéder aux notifications
**Solution :** 
- Vérifier que l'utilisateur est connecté
- Vérifier que l'ID utilisateur correspond à celui dans la base

#### Problème 2 : "Route non trouvée" (404)
**Cause :** L'API n'est pas démarrée ou l'URL est incorrecte
**Solution :**
- Démarrer l'API : `npm start` dans le dossier Api
- Vérifier l'URL dans `Mobile/src/config/api.ts`

#### Problème 3 : "Timeout" ou erreur réseau
**Cause :** Problème de connexion réseau
**Solution :**
- Vérifier que l'app mobile et l'API sont sur le même réseau
- Vérifier l'adresse IP dans la configuration
- Tester la connectivité : `ping 10.92.4.40`

#### Problème 4 : "Aucune notification" affichée
**Cause :** Pas de notifications dans la base de données
**Solution :**
- Exécuter le script de test : `node scripts/test-notifications.js`
- Créer des notifications de test manuellement

### 🔧 Outils de debug

#### 1. Logs côté API
Dans `Api/app.js`, les requêtes sont loggées. Vérifiez :
- Les requêtes arrivent-elles à l'API ?
- Y a-t-il des erreurs dans les logs ?

#### 2. Logs côté mobile
Dans l'app mobile, ouvrez les DevTools et vérifiez :
- Les requêtes réseau dans l'onglet Network
- Les logs dans la console

#### 3. Test de connectivité
```bash
# Tester si l'API répond
curl http://10.92.4.40:3000/health

# Tester l'endpoint de santé
curl http://10.92.4.40:3000/api/health
```

### 📋 Checklist de vérification

- [ ] L'API est démarrée sur le port 3000
- [ ] La base de données est accessible
- [ ] La table notifications existe
- [ ] Il y a des notifications dans la base
- [ ] L'URL de l'API est correcte dans la config mobile
- [ ] L'utilisateur est connecté avec un token valide
- [ ] L'ID utilisateur correspond à celui dans la base
- [ ] Le réseau permet la connexion entre mobile et API

### 🚀 Test rapide

1. **Démarrer l'API :**
```bash
cd Api
npm start
```

2. **Exécuter le script de test :**
```bash
node scripts/test-notifications.js
```

3. **Vérifier la configuration mobile :**
- Ouvrir `Mobile/src/config/api.ts`
- Vérifier que l'IP correspond à votre machine

4. **Tester dans l'app :**
- Se connecter avec un utilisateur
- Aller dans l'écran Notifications
- Vérifier les logs dans la console

### 📞 Si le problème persiste

1. **Collecter les informations :**
   - Logs de l'API
   - Logs de l'app mobile
   - Configuration actuelle
   - Message d'erreur exact

2. **Tester avec Postman :**
   - Créer une requête GET vers l'endpoint
   - Ajouter le header Authorization
   - Vérifier la réponse

3. **Vérifier la base de données :**
   - Connexion à la base
   - Contenu de la table notifications
   - Relations entre tables 