import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform , Button} from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedInput } from '@/components/ThemedInput';

// data
import { agregarHabito} from '../../data/crud-habitos'

export default function AgregarHabitosScreen() {
  const [habit, setHabit] = useState('');

  const handleAddHabit = async () => {
    if (!habit) return; // Validar entrada

    try {
      const data = await agregarHabito(habit);
      console.log('Hábito agregado:', data);
      setHabit(''); // Limpiar entrada después de enviar
    } catch (error) {
      console.error('Error al agregar el hábito:', error);
    }
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Agregar nuevos hábitos con validación</ThemedText>
        <ThemedInput
          placeholder="Escribe tu hábito"
          value={habit}
          onChangeText={setHabit}
        />
        <Button title="Agregar Hábito" onPress={handleAddHabit} />
      </ThemedView>
    </ParallaxScrollView>
  );
}
const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
