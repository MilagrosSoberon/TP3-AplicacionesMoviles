import { StyleSheet, View } from 'react-native';
import { Picker, type PickerProps } from '@react-native-picker/picker';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedPickerProps = PickerProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedPicker({
  style,
  lightColor,
  darkColor,
  ...rest
}: ThemedPickerProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const textColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'border');
  return (
    <View style={[styles.container,{ borderColor, backgroundColor }]}>
      <Picker
        style={[{ color: textColor }, style]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
