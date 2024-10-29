import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
};

export function ThemedInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
}: ThemedInputProps) {
  const borderColor = useThemeColor({}, 'border'); // Usa 'border' como nombre del color
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { borderColor, color: textColor }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={textColor} // Cambia el color del placeholder
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 5,
    overflow: 'hidden',
  },
  input: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 5,
    fontSize: 16,
    lineHeight: 24,
  },
});