import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import sharedStyles from '../styles/shared';
import colors from '../styles/colors';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  size?: number;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onToggle, size = 22, disabled = false }) => {
  return (
    <TouchableOpacity 
      style={[
        sharedStyles.checkbox, 
        { 
          width: size, 
          height: size,
          backgroundColor: checked ? colors.primary : 'transparent',
          borderColor: checked ? colors.primary  : colors.border,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: disabled ? 0.5 : 1,
        }
      ]} 
      onPress={onToggle}
      activeOpacity={0.7}
      disabled={disabled}
    >
      {checked && (
        <AntDesign name="check" size={size * 0.6} color="#fff" />
      )}
    </TouchableOpacity>
  );
};

export default Checkbox; 