# Artizone - Interface Web Admin

Interface d'administration web pour la plateforme Artizone, développée avec React.js et Material-UI.

## Vue d'ensemble

Cette interface web permet aux administrateurs de gérer la plateforme Artizone, de suivre les commandes, les utilisateurs et d'analyser les statistiques en temps réel.

## Technologies Utilisées

- **React.js** - Framework frontend
- **Material-UI** - Composants UI modernes
- **React Router** - Navigation entre pages
- **Recharts** - Graphiques et statistiques
- **Axios** - Appels API
- **Tailwind CSS** - Styling utilitaire
- **JWT Decode** - Gestion des tokens d'authentification

## Installation

### Prérequis
- Node.js (v18 ou supérieur)
- npm ou yarn
- API Artizone en cours d'exécution

### Installation des dépendances
```bash
cd Web
npm install
```

### Configuration
Créer un fichier `.env` dans le dossier `Web/` :
```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ADMIN_EMAIL=admin@artizone.com
```

### Démarrage
```bash
npm start
```

L'interface sera disponible sur `http://localhost:3001`

## Fonctionnalités

### Authentification
- Connexion sécurisée pour les administrateurs
- Gestion des sessions avec JWT
- Protection des routes sensibles

### Dashboard
- **Statistiques en temps réel** :
  - Nombre total d'utilisateurs
  - Commandes en cours
  - Revenus générés
  - Artisans actifs
- **Graphiques interactifs** :
  - Évolution des commandes
  - Répartition par catégorie
  - Performance des artisans

### Gestion des Utilisateurs
- **Liste des particuliers** avec filtres et recherche
- **Liste des artisans** avec statut et validation
- **Détails complets** de chaque utilisateur
- **Actions d'administration** :
  - Activer/désactiver des comptes
  - Modérer les profils
  - Gérer les signalements

### Gestion des Commandes
- **Vue d'ensemble** de toutes les commandes
- **Filtres avancés** :
  - Par statut (en cours, terminée, annulée)
  - Par date
  - Par artisan
  - Par particulier
- **Détails complets** de chaque commande
- **Actions d'administration** :
  - Valider des commandes
  - Résoudre des litiges
  - Suivre les paiements

### Gestion des Artisans
- **Profils détaillés** des artisans
- **Validation des comptes** artisan
- **Gestion des services** proposés
- **Suivi des performances** et avis

### Statistiques et Rapports
- **Tableaux de bord** personnalisables
- **Export de données** en CSV/PDF
- **Analyses temporelles** des performances
- **Rapports de modération**

## Interface Utilisateur

### Design System
- **Material-UI** pour une interface cohérente
- **Thème personnalisé** aux couleurs d'Artizone
- **Responsive design** pour tous les écrans
- **Accessibilité** conforme aux standards WCAG

### Composants Principaux
- **Sidebar** - Navigation principale
- **Topbar** - Actions rapides et notifications
- **StatCards** - Métriques importantes
- **DataTables** - Affichage des données
- **Charts** - Visualisations graphiques

## Scripts Disponibles

```bash
# Développement
npm start              # Démarrage en mode développement
npm run build          # Build de production
npm test               # Exécuter les tests
npm run eject          # Éjecter la configuration (irréversible)

# Production
npm run build          # Créer le build optimisé
serve -s build         # Servir le build de production
```

## Pages Principales

### `/` - Page de Connexion
- Formulaire d'authentification admin
- Validation des identifiants
- Redirection automatique après connexion

### `/dashboard` - Tableau de Bord
- Vue d'ensemble des métriques
- Graphiques de performance
- Actions rapides

### `/commandes` - Gestion des Commandes
- Liste de toutes les commandes
- Filtres et recherche
- Actions en lot

### `/commandes/:id` - Détail d'une Commande
- Informations complètes
- Historique des actions
- Actions d'administration

### `/utilisateurs` - Gestion des Utilisateurs
- Liste des particuliers et artisans
- Filtres par statut et type
- Actions de modération

### `/artisans` - Gestion des Artisans
- Profils détaillés
- Validation des comptes
- Suivi des performances

### `/signalements` - Modération
- Signalements en attente
- Actions de modération
- Historique des décisions

## Sécurité

### Authentification
- **JWT tokens** pour l'authentification
- **Expiration automatique** des sessions
- **Protection des routes** sensibles

### Autorisations
- **Rôles d'administrateur** avec permissions
- **Validation côté client** et serveur
- **Audit trail** des actions d'administration

## Tests

### Tests Unitaires
```bash
npm test
```

### Tests d'Intégration
```bash
npm run test:integration
```

## Build et Déploiement

### Build de Production
```bash
npm run build
```

### Variables d'Environnement
```env
REACT_APP_API_URL=https://api.artizone.com
REACT_APP_ENV=production
REACT_APP_VERSION=1.0.0
```

## Dépannage

### Problèmes Courants

1. **Erreur de connexion API**
   - Vérifier que l'API est en cours d'exécution
   - Contrôler l'URL dans `.env`

2. **Problèmes de build**
   - Nettoyer le cache : `npm run build -- --reset-cache`
   - Vérifier les dépendances : `npm install`

3. **Erreurs de CORS**
   - Vérifier la configuration CORS de l'API
   - Contrôler les origines autorisées

## Contribution

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

Ce projet fait partie d'Artizone. Tous droits réservés © 2025.

---

**Interface Admin Artizone** - Gérer la plateforme avec efficacité !
