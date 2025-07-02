import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import colors from '../styles/colors';
import tabNavigatorStyles from '../styles/tabNavigator';

interface CustomHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showNotification?: boolean;
  onNotificationPress?: () => void;
  notificationCount?: number;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  showNotification = false,
  onNotificationPress,
  notificationCount = 0,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.right}>
        {showNotification && (
          <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
            <View style={{ position: 'relative' }}>
              <Feather name="bell" size={24} color={colors.text} />
              {notificationCount > 0 && (
                <View style={[tabNavigatorStyles.badge, styles.headerBadge]}>
                  <Text style={tabNavigatorStyles.badgeText}>{notificationCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.bottomLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    position: 'relative',
  },
  left: {
    width: 40,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  iconButton: {
    padding: 4,
  },
  bottomLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  headerBadge: {
    top: -6,
    right: -6,
  },
});

export default CustomHeader; 