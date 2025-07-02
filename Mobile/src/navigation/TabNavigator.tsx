import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View, Text } from 'react-native';
import { AntDesign, Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import HistoriqueScreen from '../screens/HistoriqueScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import CompteScreen from '../screens/CompteScreen';
import ReservationScreen from '../screens/ReservationScreen';
import colors from '../styles/colors';
import tabNavigatorStyles from '../styles/tabNavigator';
import AnimatedTabIcon from '../components/AnimatedTabIcon';

// Import conditionnel de BlurView
let BlurView: any = null;
try {
  BlurView = require('expo-blur').BlurView;
} catch (error) {
  console.log('BlurView non disponible, utilisation du fallback');
}

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: tabNavigatorStyles.tabBar,
        tabBarBackground: () =>
          Platform.OS === 'ios' && BlurView ? (
            <BlurView
              intensity={80}
              tint="light"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: colors.tabBackground,
              }}
            />
          ) : null,
        tabBarActiveTintColor: tabNavigatorStyles.colors.active,
        tabBarInactiveTintColor: tabNavigatorStyles.colors.inactive,
        tabBarLabelStyle: { 
          display: 'none',
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIconStyle: tabNavigatorStyles.icon,
        tabBarItemStyle: tabNavigatorStyles.item,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              icon={
                <AntDesign 
                  name="home" 
                  size={focused ? 24 : 22} 
                  color={color}
                />
              }
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      
      <Tab.Screen
        name="Historique"
        component={HistoriqueScreen}
        options={{
          tabBarLabel: 'Historique',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              icon={
                <MaterialIcons 
                  name="history" 
                  size={focused ? 24 : 22} 
                  color={color}
                />
              }
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      
      {/* <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              icon={
                <Ionicons 
                  name="notifications" 
                  size={focused ? 24 : 22} 
                  color={color}
                />
              }
              color={color}
              size={size}
              focused={focused}
              badge={3}
            />
          ),
        }}
      /> */}

      <Tab.Screen
        name="Reservation"
        component={ReservationScreen}
        options={{
          tabBarLabel: 'Réservation',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              icon={
                <Feather 
                  name="grid" 
                  size={focused ? 24 : 22} 
                  color={color}
                />
              }
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      
      <Tab.Screen
        name="Compte"
        component={CompteScreen}
        options={{
          tabBarLabel: 'Compte',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              icon={
                <Feather 
                  name="user" 
                  size={focused ? 24 : 22} 
                  color={color}
                />
              }
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />

    </Tab.Navigator>
  );
};

export default TabNavigator; 