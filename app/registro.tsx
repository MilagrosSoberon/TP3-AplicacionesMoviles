import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
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

//componentes
import validarDataRegistroUsuario from "../components/validaciones/validarDataRegistroUsuario";


type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "index"
>;

const Registro = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [numeroCelular, setNumeroCelular] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña


  const handleRegistro = async () => {
    if (!validarDataRegistroUsuario(nombre, email, numeroCelular, password)) {
      return;
    }

    Alert.alert(
      "Registro exitoso",
      `Nombre: ${nombre}\nEmail: ${email}\nNúmero Celular: ${numeroCelular}\nContraseña: ${password}`
    );

    // Espera 2 segundos antes de navegar
    setTimeout(() => {
      navigation.navigate("index");
    }, 800);
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
      <ThemedText style={styles.title}>Registro</ThemedText>
      <ThemedInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <ThemedInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <ThemedInput
        placeholder="Número Celular"
        value={numeroCelular}
        onChangeText={setNumeroCelular}
        keyboardType="phone-pad"
      />
      <ThemedInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // Controlar si se debe ocultar la contraseña
          showPasswordToggle={true} 
          onToggleShowPassword={() => setShowPassword(!showPassword)} // Alternar visibilidad
        />

      {/* boton registro */}
      <TouchableOpacity
        style={styles.buttonRegistarme}
        onPress={handleRegistro}
      >
        <ThemedText style={styles.buttonTextWhite}>Registrarme</ThemedText>
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
    width: '80%',
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  title: {
    fontSize: 24,
    marginTop: 150,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonRegistarme: {
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
  buttonTextBlack: {
    color: "#000000", // negro
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Registro;
