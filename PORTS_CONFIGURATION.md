# Configuration des Ports - Artizone

## 🚀 Ports utilisés par défaut

### **API Backend** - Port 3000
- **URL locale :** `http://localhost:3000`
- **URL réseau :** `http://172.20.10.2:3000`
- **Documentation :** `http://localhost:3000/api-docs`
- **Health check :** `http://localhost:3000/health`

### **Application Web** - Port 3001
- **URL locale :** `http://localhost:3001`
- **Interface d'administration**

### **Application Mobile** - Port 19006 (Expo)
- **URL locale :** `http://localhost:19006`
- **URL réseau :** `http://172.20.10.2:19006`

## 🔧 Démarrage des services

### 1. **Démarrer l'API Backend**
```bash
cd Api
npm start
# Accessible sur http://localhost:3000
```

### 2. **Démarrer l'Application Web**
```bash
cd Web
npm start
# Accessible sur http://localhost:3001
```

### 3. **Démarrer l'Application Mobile**
```bash
cd Mobile
npm start
# Accessible sur http://localhost:19006
```

## 📱 Configuration Mobile

L'application mobile est configurée pour se connecter à l'API via l'adresse IP réseau :
- **API_BASE_URL :** `http://172.20.10.2:3000/api`

## 🌐 Configuration Web

L'application web est configurée pour se connecter à l'API en local :
- **API_BASE_URL :** `http://localhost:3000/api`

## 🔍 Vérification des ports

### Vérifier les ports utilisés
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :19006

# Linux/Mac
lsof -i :3000
lsof -i :3001
lsof -i :19006
```

### Libérer un port si nécessaire
```bash
# Windows
taskkill /PID [PID_NUMBER] /F

# Linux/Mac
kill -9 [PID_NUMBER]
```

## 🚨 Résolution des conflits

Si vous obtenez une erreur `EADDRINUSE` :

1. **Vérifiez quels processus utilisent le port :**
   ```bash
   netstat -ano | findstr :3000
   ```

2. **Arrêtez le processus conflictuel :**
   ```bash
   taskkill /PID [PID_NUMBER] /F
   ```

3. **Ou utilisez un port différent :**
   - Modifiez le script dans `package.json`
   - Exemple : `set PORT=3002 && react-scripts start`

## 📋 Checklist de démarrage

- [ ] API Backend démarrée sur le port 3000
- [ ] Application Web démarrée sur le port 3001
- [ ] Application Mobile démarrée sur le port 19006
- [ ] Base de données accessible
- [ ] Tous les services répondent aux health checks 