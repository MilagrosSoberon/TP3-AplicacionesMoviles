import React, { useState } from "react";
import { Image, StyleSheet, Alert, TouchableOpacity } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedInput } from "@/components/ThemedInput";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../assets/types";

//firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

//componentes
import validarDataLogin from "../components/validaciones/validarDataLogin";

//data
import { getUserByFirebaseId } from "@/database/database";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const Login = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña

  const handleLogin = async () => {
    if (!validarDataLogin(email, password)) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    try {
      //Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseId = userCredential.user.uid; // Obtiene el ID de Firebase
      const token = await userCredential.user.getIdToken(); //token JWT

      // almaceno token
      await AsyncStorage.setItem("userToken", token);

      // Obtiene el usuario de la base de datos local usando el firebaseId
      const user = await getUserByFirebaseId(firebaseId);

      if (user) {
        await AsyncStorage.setItem("userId", user.id.toString());
        console.log("Usuario recuperado:", user);
      } else {
        console.warn("No se encontró el usuario en la base de datos local");
      }
      navigation.navigate("(tabs)");
    } catch (error) {
      Alert.alert(
        "Error, la combinación de usuario y contraseña es incorrecta",
        (error as Error).message
      );
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
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // control si se debe ocultar la contraseña
          showPasswordToggle={true}
          onToggleShowPassword={() => setShowPassword(!showPassword)} // Alternar visibilidad
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
    width: "80%",
    bottom: 10,
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
});

export default Login;
