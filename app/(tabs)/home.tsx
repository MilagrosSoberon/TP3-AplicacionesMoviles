import { Image, StyleSheet, TouchableOpacity, Alert, View, RefreshControl , ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../assets/types";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Icon from "react-native-vector-icons/Ionicons";
import { useThemeColor } from '@/hooks/useThemeColor';
import { useEffect, useState } from "react";
import { getHabits, addHabit } from '@/database/database'; 
import ImportanceChip from '@/components/ImportanceChip'; 

type ScreenNavigationProp = StackNavigationProp<RootStackParamList>;

type Habit = {
  id: number;
  idUsuario: number;
  idNivelImportancia: number;
  nombre: string;
  descripcion?: string;
};

export default function HomeScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const iconColor = useThemeColor({}, 'text');
  const [habits, setHabits] = useState<Habit[]>([]); // almacena los hábitos
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = () => {
    navigation.navigate("index");
  };

  // carga los habitos
  const loadHabits = async () => {
    const fetchedHabits = await getHabits();
    setHabits(fetchedHabits);
  };

  useEffect(() => {
    loadHabits(); 
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
        />
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
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="log-out-outline" size={24} color={iconColor} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Listado de hábitos actuales</ThemedText>
        <TouchableOpacity onPress={loadHabits} style={styles.refreshButton}>
          <Icon name="refresh-outline" size={24} color={iconColor} />
        </TouchableOpacity>
      </ThemedView>

      {/* Lista de hábitos */}
      {habits.map(item => (
        <TouchableOpacity key={item.id} style={styles.habitItem}>
          <View style={styles.habitContent}>
            <ThemedText style={styles.habitName}>{item.nombre}</ThemedText>
            <ThemedText style={styles.habitDescription}>{item.descripcion}</ThemedText>
          </View>
          <ImportanceChip level={item.idNivelImportancia} />
        </TouchableOpacity>
      ))}
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "column",
    position: "relative",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginTop: 50,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
  logoutButton: {
    position: "absolute",
    top: 10,
    right: 0,
  },
  refreshButton: {
    position: "absolute",
    top: 10,
    right: 50,
  },
  habitItem: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between'
  },
  habitContent: {
    flex: 1, 
    marginRight: 10, 
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  habitDescription: {
    fontSize: 14,
    color: '#666'
  }
});