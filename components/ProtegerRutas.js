import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setIsAuthenticated(true);
      } else {
        navigation.navigate("index"); // Redirige a la pantalla de inicio de sesión si no está autenticado
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <ActivityIndicator />; // Muestra un indicador mientras se verifica la autenticación
  }

  return isAuthenticated ? children : null; // Renderiza los hijos si está autenticado
};

export default ProtectedRoute;