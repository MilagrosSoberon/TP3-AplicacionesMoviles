import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence, Auth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDxrhmrUU_BjVDFhCrNaPZzkIMpyUJBVBQ",
  authDomain: "tp3-aplicacionesmoviles.firebaseapp.com",
  projectId: "tp3-aplicacionesmoviles",
  storageBucket: "tp3-aplicacionesmoviles.appspot.com",
  messagingSenderId: "580831365883",
  appId: "1:580831365883:web:2df00413304306696dfe5e",
  measurementId: "G-RLNFRCQD46",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth con persistencia condicional
let auth = Auth;

if (Platform.OS === "web") {
  // Para la web, usa la configuración predeterminada de `getAuth`
  auth = getAuth(app);
} else {
  // Para dispositivos móviles, usa `initializeAuth` con persistencia `AsyncStorage`
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { app, auth };
