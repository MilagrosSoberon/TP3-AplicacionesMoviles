import React, { useState } from "react";
import {
  Image,
  View,
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
import { addUser } from '@/database/database'; 
import SHA256 from 'crypto-js/sha256'; 
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

//validacion
import validarDataRegistroUsuario  from '../components/validaciones/validarDataRegistroUsuario';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "index">;

const Registro = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [numeroCelular, setNumeroCelular] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); //  mostrar/ocultar contraseña

  const handleRegistro = async () => {
    // Validar los datos del registro
    if (!validarDataRegistroUsuario(nombre, email, numeroCelular, password)) {
        Alert.alert('Error', 'Por favor completa todos los campos correctamente. Asegúrate de que la contraseña tenga al menos 8 caracteres, incluya números y al menos una mayúscula. Además, verifica que el email sea válido y termine en .com.');
        return;
    }

    // Hashear la contraseña
    const hashedPassword = SHA256(password).toString();

    try {
        // Inicializar Firebase Auth
        const auth = getAuth(); 

        // Crear el usuario en Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password); 
        
        // Agregar el usuario a la base de datos local
        const success = await addUser(nombre, email, numeroCelular, hashedPassword);
        if (!success) {
            Alert.alert('Error', 'El usuario fue registrado en Firebase, pero no se pudo guardar en la base de datos local.');
            return;
        }

        Alert.alert(
            "Registro exitoso",
            `Nombre: ${nombre}\nEmail: ${email}\nNúmero Celular: ${numeroCelular}`
        );

        // Espera 2 segundos antes de navegar
        setTimeout(() => {
            navigation.navigate("index");
        }, 800);
    } catch (error) {
        Alert.alert('Error', 'No se pudo registrar el usuario. ' + (error as Error).message);
    }
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

        {/* Botón registro */}
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
});

export default Registro;