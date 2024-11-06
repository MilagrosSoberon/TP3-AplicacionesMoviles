import React from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import Icon from 'react-native-vector-icons/MaterialIcons';

export type ThemedInputProps = {
  lightColor?: string;
  darkColor?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  showPasswordToggle?: boolean; // Nueva prop para mostrar/ocultar contraseña
  onToggleShowPassword?: () => void; // Función para alternar la visibilidad
};

export function ThemedInput({
  lightColor,
  darkColor,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  showPasswordToggle = false,
  onToggleShowPassword,
}: ThemedInputProps) {
  const borderColor = useThemeColor({}, 'border'); 
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { borderColor, color: textColor }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={textColor} 
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
      {showPasswordToggle && (
        <TouchableOpacity onPress={onToggleShowPassword} style={styles.eyeIcon}>
          <Icon name={secureTextEntry ? "visibility-off" : "visibility"} size={24} color="gray" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  input: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 5,
    fontSize: 16,
    lineHeight: 24,
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10, 
    top: '50%',
    transform: [{ translateY: -12 }], 
    zIndex: 1, 
  },
});