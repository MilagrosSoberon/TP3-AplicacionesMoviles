import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedInput } from "@/components/ThemedInput";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../assets/types";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const Login = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");

  const handleLogin = () => {
    // Credenciales hardcodeadas
    const hardcodedEmail = "usuario@example.com";
    const hardcodedPin = "1234";

    if (!email || !pin) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }

    if (email === hardcodedEmail && pin === hardcodedPin) {
      // Navegar a la pantalla de inicio
      navigation.navigate("(tabs)");
    } else {
      // Mostrar un mensaje de error
      Alert.alert("Error", "Usuario o PIN incorrectos");
    }
  };

  const handleRegistro = () => {
    navigation.navigate("registro");
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Iniciar Sesión</ThemedText>
        <ThemedInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <ThemedInput
          placeholder="PIN"
          value={pin}
          onChangeText={setPin}
          secureTextEntry
          keyboardType="numeric"
        />

        {/* Botón de olvidé pin */}
        <TouchableOpacity onPress={handleRegistro}>
          <ThemedText style={styles.buttonRestaurarPin}>
            Olvidé mi pin
          </ThemedText>
        </TouchableOpacity>

        {/* Botón de inicio de sesión */}
        <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
          <ThemedText style={styles.buttonTextWhite}>Iniciar Sesión</ThemedText>
        </TouchableOpacity>

        {/* Botón de registro */}
        <TouchableOpacity onPress={handleRegistro}>
          <ThemedText style={styles.buttonRegistro}>Registrarme</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  buttonRestaurarPin: {
    color: "#003366", // Azul oscuro
    textDecorationLine: "underline",
    textAlign: "left",
    marginTop: 0,
  },
  buttonLogin: {
    backgroundColor: "#007BFF", // celeste
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 30,
  },
  buttonTextWhite: {
    color: "#FFFFFF", // blanco
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonRegistro: {
    color: "#003366", // Azul oscuro
    textDecorationLine: "underline",
    textAlign: "center",
    marginTop: 20,
  },
  buttonTextBlack: {
    color: "#000000", // negro
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Login;
