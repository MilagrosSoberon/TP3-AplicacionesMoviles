import { Alert } from "react-native";

const validarDataRegistroUsuario = (nombre, email, numeroCelular, pin) => {
  if (!nombre || !email || !numeroCelular || !pin) {
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

  // Validar que el PIN sea de al menos 4 dígitos
  if (pin.length < 4) {
    Alert.alert("Error", "El código PIN debe tener al menos 4 dígitos.");
    return false;
  }

  return true; // Si todas las validaciones pasan
};

export default validarDataRegistroUsuario;
