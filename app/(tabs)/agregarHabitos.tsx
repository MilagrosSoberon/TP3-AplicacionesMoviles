import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Alert, TextInput, Button, View, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { initializeDatabase, addHabit, getImportanceLevels } from '@/database/database';
import { Picker } from '@react-native-picker/picker';

const AgregarHabitosScreen = () => {
  const [habitName, setHabitName] = useState<string>('');
  const [habitImportance, setHabitImportance] = useState<number | undefined>(undefined);
  const [habitDescription, setHabitDescription] = useState<string>('');
  const [importanceLevels, setImportanceLevels] = useState<{ id: number; nombre: string }[]>([]);

  useEffect(() => {
    const setupDatabase = async () => {
      await initializeDatabase();
      const levels = await getImportanceLevels();
      setImportanceLevels(levels);
    };

    setupDatabase();
  }, []);

  const handleAddHabit = async () => {
    if (!habitName || habitImportance === undefined) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    const success = await addHabit(habitName, habitImportance, habitDescription);
    if (success) {
      Alert.alert('Éxito', `Hábito agregado con éxito.`);
      // limpia los campos
      setHabitName('');
      setHabitImportance(undefined);
      setHabitDescription('');
    } else {
      Alert.alert('Error', 'Error al agregar hábito.');
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.headerImage} 
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.title}>Agregar nuevos hábitos con validación</ThemedText>
      </ThemedView>
      
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del hábito"
          placeholderTextColor="#FFFFFF" 
          value={habitName}
          onChangeText={setHabitName}
        />
        
        {/* Contenedor para el Picker con borde blanco */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={habitImportance}
            style={styles.picker}
            onValueChange={(itemValue) => setHabitImportance(itemValue)}
          >
            <Picker.Item label="Seleccione un nivel de importancia" value={undefined} />
            {importanceLevels.map(level => (
              <Picker.Item key={level.id} label={level.nombre} value={level.id} />
            ))}
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Descripción"
          placeholderTextColor="#FFFFFF"
          value={habitDescription}
          onChangeText={setHabitDescription}
        />
        
        <Button title="Agregar Hábito" onPress={handleAddHabit} />
      </View>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF', 
  },
  formContainer: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#FFFFFF',
    color: '#FFFFFF', 
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
  },
  pickerContainer: {
    borderColor: '#FFFFFF', 
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    overflow: 'hidden', 
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#FFFFFF',
  },
});

export default AgregarHabitosScreen;