import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from '@expo/vector-icons/AntDesign';
import {
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  RefreshControl,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Picker } from "@react-native-picker/picker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedInput } from "@/components/ThemedInput";
import ImportanceChip from "@/components/ImportanceChip";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedPicker } from "@/components/ThemedPicker";

//firebase
import AsyncStorage from "@react-native-async-storage/async-storage";

//data
import {
  getHabitByIdUser,
  getImportanceLevels,
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
  const [habitImportance, setHabitImportance] = useState<number | undefined>(
    undefined
  );
  const [importanceLevels, setImportanceLevels] = useState<
    { id: number; nombre: string }[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // carga los habitos
  const loadHabits = async () => {
    try {
      // Obtiene el Firebase ID del almacenamiento
      const firebaseId = await AsyncStorage.getItem("userId");
      console.log("Número Usuario de Firebase:", firebaseId);

      if (firebaseId) {
        // Usa el firebaseId para obtener los hábitos
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

  const loadHabitImportance = async () => {
    const levels = await getImportanceLevels();
    setImportanceLevels(levels);
  };

  useEffect(() => {
    loadHabits();
    loadHabitImportance();
  }, []);

  const handleUpdate = async () => {
    if (!nombre) {
      Alert.alert("Error", "El nombre no puede estar vacío.");
      return;
    }
    if (habitImportance !== undefined) {
      await updateHabit(
        selectedHabit!.id,
        habitImportance,
        nombre,
        descripcion
      );
    } else {
      Alert.alert("Error", "Debe seleccionar un nivel de importancia.");
    }
    Alert.alert("Éxito", "Hábito actualizado con éxito.");
    loadHabits();
    setModalVisible(false); // Cerrar modal
    // Resetear campos
    setNombre(""); 
    setDescripcion("");
    setHabitImportance(undefined);
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
    setHabitImportance(habit.idNivelImportancia);
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
          <ThemedText type="subtitle" style={{ marginTop: 40 }}>Detalles del Hábito</ThemedText>
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
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => openUpdateModal(item)}
                  style={[styles.button, styles.editButtonIcon]}
                >
                  <AntDesign name="edit" size={24} color="green" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={[styles.button, styles.deleteButtonIcon]}
                >
                  <AntDesign name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
              {/* <ImportanceChip level={item.idNivelImportancia} /> */}
            </TouchableOpacity>
          ))}
          {/* Modal para actualizar hábitos */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <ThemedView style={styles.modalContainer}>
              <ThemedView style={styles.modalContent}>
                <ThemedText type="subtitle" style={styles.modalTitle}>Actualizar Hábito</ThemedText>
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
                <ThemedView style={styles.pickerContainer}>
                  <ThemedPicker
                    selectedValue={habitImportance}
                    onValueChange={(itemValue) => {
                      const value =
                        itemValue !== undefined ? Number(itemValue) : undefined;
                      setHabitImportance(value);
                    }}
                  >
                    <Picker.Item
                      label="Seleccione un nivel de importancia"
                      value={undefined}
                    />
                    {importanceLevels.map((level) => (
                      <Picker.Item
                        key={level.id}
                        label={level.nombre}
                        value={level.id}
                      />
                    ))}
                  </ThemedPicker>
                </ThemedView>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={[styles.button, styles.flexButton]} onPress={handleUpdate}>
                    <ThemedText style={styles.buttonText}>Guardar</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton, styles.flexButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
                  </TouchableOpacity>
                </View>
              </ThemedView>
            </ThemedView>
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
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "red",
  },
  deleteButtonIcon: {
    backgroundColor: "white",
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 0,
  },
  editButtonIcon: {
    backgroundColor: "white",
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 5,
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
    justifyContent: "flex-start",
  },
  habitContent: {
    flex: 1,
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
    paddingVertical: "20%",
    paddingHorizontal: "10%",
    borderRadius: 10,
    shadowColor: "#000",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: -10,
    textAlign: "center",
  },
  pickerContainer: {
    width: "100%",
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 20,
   
  },
  cancelButton: {
    backgroundColor: "red",
    borderColor: "red",
    borderWidth: 1,
    
  },
  flexButton: {
    flex: 0.5,
    marginHorizontal: 5, 
    alignItems: 'center',
  },
  

});
