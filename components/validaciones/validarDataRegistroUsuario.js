import { Alert } from "react-native";

const validarDataRegistroUsuario = (nombre, email, numeroCelular, password) => {
  if (!nombre || !email || !numeroCelular || !password) {
    Alert.alert("Error", "Por favor, completa todos los campos.");
    return false; // Salir si hay campos vacíos
  }

  // Validar formato del email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Alert.alert("Error", "Por favor, ingresa un email válido.");
    return false;
  }

  // Validar que el número celular sea solo números
  const phoneRegex = /^[0-9]+$/;
  if (!phoneRegex.test(numeroCelular)) {
    Alert.alert("Error", "El número celular debe contener solo números.");
    return false;
  }

  if (password.length < 6) {
    Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
    return;
  }

  return true; // Si todas las validaciones pasan
};

export default validarDataRegistroUsuario;
