import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Alert,
  TextInput,
  Button,
  View,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Picker } from "@react-native-picker/picker";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedPicker } from "@/components/ThemedPicker";

//firebase
import AsyncStorage from "@react-native-async-storage/async-storage"; 

//data
import {
  initializeDatabase,
  addHabit,
  getImportanceLevels,
} from "@/database/database";

const AgregarHabitosScreen = () => {
  const [habitName, setHabitName] = useState<string>("");
  const [habitImportance, setHabitImportance] = useState<number | undefined>(
    undefined
  );
  const [habitDescription, setHabitDescription] = useState<string>("");
  const [importanceLevels, setImportanceLevels] = useState<
    { id: number; nombre: string }[]
  >([]);

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
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    try {
      // Obtiene el ID del usuario desde AsyncStorage
      const userId = await AsyncStorage.getItem("userId");
      console.log("ID de usuario:", userId); 

      if (!userId) {
        Alert.alert("Error", "No se encontró el ID de usuario.");
        return;
      }

      // Llama a addHabit con el ID de usuario
      const success = await addHabit(
        userId,
        habitName,
        habitImportance,
        habitDescription
      );
      if (success) {
        Alert.alert("Éxito", `Hábito agregado con éxito.`);
        // Limpiar los campos
        setHabitName("");
        setHabitImportance(undefined);
        setHabitDescription("");
      } else {
        Alert.alert("Error", "Error al agregar hábito.");
      }
    } catch (error) {
      console.error("Error al agregar hábito:", error);
      Alert.alert("Error", "Hubo un problema al agregar el hábito.");
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
      <ThemedText type="subtitle" style={{ marginTop: 40 }}>
          Agregar nuevos hábitos
        </ThemedText>
      </ThemedView>

      <View style={styles.formContainer}>
        <ThemedInput
          placeholder="Nombre del hábito"
          value={habitName}
          onChangeText={setHabitName}
        />

        {/* Contenedor para el Picker con borde blanco */}
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

        <ThemedInput
          placeholder="Descripción"
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
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    color: "#FFFFFF",
  },
  formContainer: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "#FFFFFF",
    color: "#FFFFFF",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  pickerContainer: {
    borderRadius: 5,
    marginBottom: 12,
    overflow: "hidden",
  },
});

export default AgregarHabitosScreen;
