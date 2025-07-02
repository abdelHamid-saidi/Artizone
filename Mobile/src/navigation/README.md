# TabNavigator - Navigation par Onglets

## 🎨 Améliorations Design iOS

Le TabNavigator a été modernisé pour offrir une expérience utilisateur optimale sur iOS et Android.

### ✨ Fonctionnalités

#### 🎯 **Design Adaptatif**
- **iOS** : Barre avec effet de flou (BlurView) et hauteur adaptée (88px)
- **Android** : Barre avec élévation et ombre portée
- **Responsive** : Adaptation automatique selon la plateforme

#### 🎭 **Animations Fluides**
- **Scale Animation** : Les icônes s'agrandissent légèrement quand sélectionnées
- **Opacity Animation** : Transition douce entre les états actif/inactif
- **Badge Animation** : Les badges s'animent avec les icônes

#### 🏷️ **Badges Intelligents**
- **Notifications** : Badge rouge avec compteur (ex: 3)
- **Messages** : Badge rouge avec compteur (ex: 1)
- **Design iOS** : Bordure blanche et positionnement précis

#### 🎨 **Styles Modernes**
- **Couleurs** : Palette cohérente avec l'identité visuelle
- **Typographie** : Police optimisée pour la lisibilité
- **Espacement** : Marges et paddings adaptés à chaque plateforme

### 📁 Structure des Fichiers

```
src/
├── navigation/
│   ├── TabNavigator.tsx          # Composant principal
│   └── README.md                 # Documentation
├── components/
│   └── AnimatedTabIcon.tsx       # Composant d'animation
└── styles/
    └── tabNavigator.ts           # Styles centralisés
```

### 🔧 Configuration

#### **Styles Centralisés** (`tabNavigator.ts`)
- Styles réutilisables et maintenables
- Configuration adaptative iOS/Android
- Couleurs et espacements standardisés

#### **Composant Animé** (`AnimatedTabIcon.tsx`)
- Animations fluides avec `Animated.parallel`
- Gestion des badges intégrée
- Performance optimisée avec `useNativeDriver`

### 🚀 Utilisation

```tsx
import TabNavigator from '../navigation/TabNavigator';

// Dans votre AppNavigator
<TabNavigator />
```

### 🎯 Onglets Disponibles

1. **🏠 Accueil** - Page principale
2. **📋 Historique** - Historique des commandes
3. **🔔 Notifications** - Alertes et mises à jour
4. **💬 Messages** - Communication avec artisans
5. **👤 Compte** - Gestion du profil

### 🔄 Mise à Jour des Badges

Pour mettre à jour les badges dynamiquement :

```tsx
// Dans votre composant parent
const [notificationCount, setNotificationCount] = useState(3);
const [messageCount, setMessageCount] = useState(1);

// Mise à jour via API ou événements
useEffect(() => {
  // Logique de mise à jour
}, []);
```

### 🎨 Personnalisation

#### **Couleurs**
Modifiez `src/styles/colors.ts` pour changer la palette :

```tsx
const colors = {
  primary: '#9A53C0',        // Couleur active
  // ... autres couleurs
};
```

#### **Styles**
Modifiez `src/styles/tabNavigator.ts` pour ajuster l'apparence :

```tsx
export const tabNavigatorStyles = {
  tabBar: {
    // Styles de la barre
  },
  badge: {
    // Styles des badges
  },
  // ... autres styles
};
```

### 📱 Compatibilité

- ✅ **iOS 12+** : Support complet avec BlurView
- ✅ **Android 6+** : Support complet avec élévation
- ✅ **Expo** : Compatible avec toutes les versions
- ✅ **React Navigation 6+** : Utilise les dernières APIs

### 🎉 Résultat

Un TabNavigator moderne, fluide et adapté aux standards iOS/Android qui offre une expérience utilisateur exceptionnelle ! 