import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Platform, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../assets/types";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Icon from "react-native-vector-icons/Ionicons";
import { useThemeColor } from "@/hooks/useThemeColor";

//import data
import { obtenerHabitos } from "../../data/crud-habitos";

type ScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const iconColor = useThemeColor({}, "text");

  const [habitos, setHabitos] = useState<{id: number,  nombre: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHabitos = async () => {
      try {
        const data = await obtenerHabitos();
        setHabitos(data);
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };

    fetchHabitos();
  }, []);
  if (loading) {
    return <ThemedText>Cargando...</ThemedText>;
  }

  if (error) {
    return <ThemedText>Error al cargar los hábitos: {error}</ThemedText>;
  }

  const handleLogout = () => {
    navigation.navigate("index");
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image source={require("@/assets/images/partial-react-logo.png")} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="log-out-outline" size={24} color={iconColor} />
        </TouchableOpacity>
        <ThemedText style={styles.title}> Lista de Hábitos </ThemedText>
        <HelloWave />
      </ThemedView>
      <ScrollView style={styles.container}>
      {habitos.map((item) => (
        <ThemedView key={item.id} style={styles.habitItem}>
          <ThemedText>{item.nombre}</ThemedText>
        </ThemedView>
      ))}
    </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "column",
    position: "relative",
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
  habitItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
