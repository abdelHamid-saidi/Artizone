import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import tabNavigatorStyles from '../styles/tabNavigator';

interface AnimatedTabIconProps {
  icon: React.ReactElement;
  color: string;
  size: number;
  focused: boolean;
  badge?: number;
}

const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({
  icon,
  color,
  size,
  focused,
  badge,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: focused ? 1.1 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: focused ? 1 : 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused, scaleAnim, opacityAnim]);

  return (
    <View style={{ position: 'relative' }}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }}
      >
        {icon}
      </Animated.View>
      {badge && (
        <Animated.View
          style={[
            tabNavigatorStyles.badge,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={tabNavigatorStyles.badgeText}>{badge}</Text>
        </Animated.View>
      )}
    </View>
  );
};

export default AnimatedTabIcon; 