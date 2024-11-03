import axios from 'axios';

const URL_Agregar = 'https://localhost:7185/Habito/Agregar'; 
const URL_Obtener = 'https://localhost:7185/Habito/Obtener'; 


export const agregarHabito = async (habit) => {
  try {
    const response = await axios.post(URL_Agregar, { name: habit });
    return response.data; // Retorna la respuesta del servidor
  } catch (error) {
    console.error('Error al agregar el hábito:', error);
    throw error; // Lanza el error para manejarlo en otro lugar
  }
};

// Función para obtener los hábitos
export const obtenerHabitos = async () => {
  try {
    const response = await axios.get(URL_Obtener);
    console.log("la data es:" ,response.data);
    return response.data; // Retorna la lista de hábitos
    
  } catch (error) {
    console.error('Error al obtener los hábitos:', error);
    throw error; // Lanza el error para manejarlo en otro lugar
  }
};