// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDxrhmrUU_BjVDFhCrNaPZzkIMpyUJBVBQ",
  authDomain: "tp3-aplicacionesmoviles.firebaseapp.com",
  projectId: "tp3-aplicacionesmoviles",
  storageBucket: "tp3-aplicacionesmoviles.appspot.com",
  messagingSenderId: "580831365883",
  appId: "1:580831365883:web:2df00413304306696dfe5e",
  measurementId: "G-RLNFRCQD46"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth con persistencia
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { app, auth };