import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
}: CustomButtonProps) {
  
  const getBgColor = () => {
    if (disabled) return '#3f3f46'; // zinc-700
    switch (variant) {
      case 'primary': return '#4ade80'; // emerald-400 (ChrysaLink theme)
      case 'secondary': return '#27272a'; // zinc-800
      case 'outline': return 'transparent';
      default: return '#4ade80';
    }
  };

  const getTextColor = () => {
    if (disabled) return '#a1a1aa'; // zinc-400
    if (variant === 'outline') return '#4ade80';
    return '#ffffff';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        { backgroundColor: getBgColor() },
        variant === 'outline' && styles.outlineBorder,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  outlineBorder: {
    borderWidth: 2,
    borderColor: '#4ade80',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});