import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ImportanceChipProps = {
  level: number; // 1: Alto, 2: Medio, 3: Bajo
};

const ImportanceChip: React.FC<ImportanceChipProps> = ({ level }) => {
  let backgroundColor;
  let label;

  switch (level) {
    case 1:
      backgroundColor = 'red'; // Alto
      label = 'Alto';
      break;
    case 2:
      backgroundColor = 'orange'; // Medio
      label = 'Medio';
      break;
    case 3:
      backgroundColor = 'blue'; // Bajo
      label = 'Bajo';
      break;
    default:
      backgroundColor = 'gray';
      label = 'Desconocido';
  }

  return (
    <View style={[styles.chip, { backgroundColor }]}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginRight: 8,
    alignSelf: 'flex-start',
  },
  chipText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ImportanceChip;