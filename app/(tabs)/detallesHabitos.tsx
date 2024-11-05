import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Alert, TextInput, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native"; 
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getHabitById, updateHabit, deleteHabit } from '@/database/database'; 

// Definición de la interfaz Habit
interface Habit {
  id: number;
  nombre: string;
  descripcion?: string; 
}

type RootStackParamList = {
  DetallesHabitos: { habitId: number };
};

type RouteParams = RouteProp<RootStackParamList, 'DetallesHabitos'>;


const DetallesHabitosScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteParams>(); 
  const habitId = route.params?.habitId; 

  const [habit, setHabit] = useState<Habit | null>(null); 
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");


  useEffect(() => {
    if (habitId) {
      const loadHabit = async () => {
        const fetchedHabit = await getHabitById(habitId); 
        if (fetchedHabit) {
          setHabit(fetchedHabit);
          setNombre(fetchedHabit.nombre);
          setDescripcion(fetchedHabit.descripcion || "");
        }
      };

      loadHabit();
    }
  }, [habitId]);

  const handleUpdate = async () => {
    if (!nombre) {
      Alert.alert("Error", "El nombre no puede estar vacío.");
      return;
    }

    await updateHabit(habitId!, nombre, descripcion); 
    Alert.alert("Éxito", "Hábito actualizado con éxito.");
    navigation.goBack();
  };

  const handleDelete = async () => {
    Alert.alert(
      "Eliminar Hábito",
      "¿Estás seguro de que deseas eliminar este hábito?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: async () => {
            await deleteHabit(habitId!); 
            Alert.alert("Éxito", "Hábito eliminado con éxito.");
            navigation.goBack(); 
          }
        }
      ]
    );
  };

  if (!habit) return null; 

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="code-slash" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Detalles del Hábito</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Nombre del hábito"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
        />
        
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <ThemedText style={styles.buttonText}>Actualizar</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
          <ThemedText style={styles.buttonText}>Eliminar</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "column",
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "#FF4C4C", 
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DetallesHabitosScreen;