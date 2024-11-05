import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  RefreshControl , ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedInput } from "@/components/ThemedInput";
import ImportanceChip from "@/components/ImportanceChip";
import { useThemeColor } from "@/hooks/useThemeColor";

//firebase
import AsyncStorage from "@react-native-async-storage/async-storage";

//data
import {
  getHabitByIdUser,
  updateHabit,
  deleteHabit,
} from "@/database/database";

export default function DetallesHabitosScreen() {
  // Definición de la interfaz Habit
  type Habit = {
    id: number;
    idUsuario: number;
    idNivelImportancia: number;
    nombre: string;
    descripcion?: string;
  };

  const iconColor = useThemeColor({}, "text");
  const [refreshing, setRefreshing] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

 // carga los habitos
 const loadHabits = async () => {
  try {
    // Obtener el Firebase ID del almacenamiento
    const firebaseId = await AsyncStorage.getItem("userId");
    console.log("Número Usuario de Firebase:", firebaseId);

    if (firebaseId) {
      // Usar el firebaseId para obtener los hábitos
      const fetchedHabits = await getHabitByIdUser(firebaseId); 
      console.log("Hábitos recuperados:", fetchedHabits); 

      if (fetchedHabits && fetchedHabits.length > 0) {
        setHabits(fetchedHabits); // Establece los hábitos
      } else {
        console.warn("No existen hábitos para este usuario");
      }
    } else {
      console.warn("No se encontró ningún ID de Firebase en AsyncStorage");
    }
  } catch (error) {
    console.error("Error al cargar los hábitos:", error);
  }
};

  useEffect(() => {
    loadHabits();
  }, []);

  const handleUpdate = async () => {
    if (!nombre) {
      Alert.alert("Error", "El nombre no puede estar vacío.");
      return;
    }
    await updateHabit(selectedHabit!.id, nombre, descripcion);
    Alert.alert("Éxito", "Hábito actualizado con éxito.");
    loadHabits();
    setModalVisible(false); // Cerrar modal
    setNombre(""); // Resetear campos
    setDescripcion("");
    setSelectedHabit(null);
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Eliminar Hábito",
      "¿Estás seguro de que deseas eliminar este hábito?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            await deleteHabit(id);
            Alert.alert("Éxito", "Hábito eliminado con éxito.");
            loadHabits();
          },
        },
      ]
    );
  };
  const openUpdateModal = (habit: Habit) => {
    setSelectedHabit(habit);
    setNombre(habit.nombre);
    setDescripcion(habit.descripcion || "");
    setModalVisible(true);
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="code-slash" style={styles.headerImage} />
      }
    >
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadHabits} // Llama a loadHabits al refrescar
          />
        }
      >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Detalles del Hábito</ThemedText>
        <TouchableOpacity onPress={loadHabits} style={styles.refreshButton}>
          <Icon name="refresh-outline" size={24} color={iconColor} />
        </TouchableOpacity>
        {habits.map((item) => (
          <TouchableOpacity key={item.id} style={styles.habitItem}>
            <View style={styles.habitContent}>
              <ThemedText style={styles.habitName}>{item.nombre}</ThemedText>
              <ThemedText style={styles.habitDescription}>
                {item.descripcion}
              </ThemedText>
            </View>
            <TouchableOpacity
              onPress={() => openUpdateModal(item)}
              style={styles.button}
            >
              <ThemedText style={styles.buttonText}>Actualizar</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={[styles.button, styles.deleteButton]}
            >
              <ThemedText style={styles.buttonText}>Eliminar</ThemedText>
            </TouchableOpacity>
            <ImportanceChip level={item.idNivelImportancia} />
          </TouchableOpacity>
        ))}
        {/* Modal para actualizar hábitos */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ThemedText type="title">Actualizar Hábito</ThemedText>
              <ThemedInput
                placeholder="Nombre del hábito"
                value={nombre}
                onChangeText={setNombre}
              />
              <ThemedInput
                placeholder="Descripción"
                value={descripcion}
                onChangeText={setDescripcion}
              />
              <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <ThemedText style={styles.buttonText}>
                  Guardar Cambios
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => setModalVisible(false)}
              >
                <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ThemedView>
      </ScrollView>
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
  refreshButton: {
    position: "absolute",
    top: 10,
    right: 0,
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
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  deleteButton: {
    backgroundColor: "#FF4C4C",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  habitItem: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  habitContent: {
    marginRight: 10,
  },
  habitName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  habitDescription: {
    fontSize: 14,
    color: "#666",
  },
  // Estilos para el modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    paddingVertical: "20%",
    paddingHorizontal: "10%",
    //borderRadius: "10%",
  },
});
