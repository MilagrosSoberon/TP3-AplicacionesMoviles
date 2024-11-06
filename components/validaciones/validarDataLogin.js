import { Alert } from "react-native";

const validarDataLogin = (email, password) => {
if (!email || !password) {
    Alert.alert("Error", "Por favor, complete todos los campos.");
    return;
  }
  // Validación del formato del correo electrónico
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    Alert.alert("Error", "Por favor ingresa un correo electrónico válido.");
    return;
  }

  // Validación de la longitud mínima de la contraseña
  if (password.length < 6) {
    Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
    return;
  }
  return true; // Si todas las validaciones pasan
};

export default validarDataLogin;