import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

const db = SQLite.openDatabaseAsync("db_habitos.db");

export const initializeDatabase = async () => {
  const database = await db;

  // empezar de 0
  // try {
  //   // await database.execAsync(`DROP TABLE IF EXISTS Registro;`);
  //   // await database.execAsync(`DROP TABLE IF EXISTS Habito;`);
  //   await database.execAsync(`DROP TABLE IF EXISTS Usuario;`);
  //   //await database.execAsync(`DROP TABLE IF EXISTS NivelImportancia;`);

  //   console.log('Todas las tablas han sido eliminadas con éxito');
  // } catch (error) {
  //   console.error('Error al eliminar las tablas:', error);
  // }
  // };

  await database.execAsync(
    `CREATE TABLE IF NOT EXISTS Habito (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idUsuario INTEGER,
      idNivelImportancia INTEGER,
      nombre TEXT NOT NULL,
      descripcion TEXT
    );`
  );

  await database.execAsync(
    `CREATE TABLE IF NOT EXISTS Usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL,
      contraseña TEXT NOT NULL,
      firebaseId TEXT
    );`
  );

  await database.execAsync(
    `CREATE TABLE IF NOT EXISTS NivelImportancia (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL
    );`
  );

  await database.execAsync(
    `CREATE TABLE IF NOT EXISTS Registro (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idHabito INTEGER,
      fecha TEXT NOT NULL,
      completado BOOLEAN NOT NULL,
      nota TEXT,
      FOREIGN KEY (idHabito) REFERENCES Habito(id)
    );`
  );

  // Cargar niveles de importancia ALTO, BAJO Y MEDIO
  // await database.execAsync(
  //   `INSERT INTO NivelImportancia (nombre) VALUES ('Alto');`
  // );

  // await database.execAsync(
  //   `INSERT INTO NivelImportancia (nombre) VALUES ('Medio');`
  // );

  // await database.execAsync(
  //   `INSERT INTO NivelImportancia (nombre) VALUES ('Bajo');`
  // );
};
//  initializeDatabase();

//obtener niveles de importancia
type ImportanceLevel = {
  id: number;
  nombre: string;
};

export const getImportanceLevels = async (): Promise<ImportanceLevel[]> => {
  const database = await db;

  try {
    const result = await database.getAllAsync("SELECT * FROM NivelImportancia");
    return result as ImportanceLevel[];
  } catch (error) {
    console.error("Error al obtener los niveles de importancia:", error);
    return [];
  }
};

type Habit = {
  id: number;
  idUsuario: number;
  idNivelImportancia: number;
  nombre: string;
  descripcion?: string;
};

// Obtener todos los hábitos
export const getHabits = async (): Promise<Habit[]> => {
  const database = await db;

  try {
    const result = await database.getAllAsync("SELECT * FROM Habito");
    return result as Habit[];
  } catch (error) {
    console.error("Error al obtener los hábitos:", error);
    return [];
  }
};
// database.ts
export const getHabitById = async (id: number): Promise<Habit | null> => {
  const database = await db;
  try {
    // Llama a getFirstAsync con la consulta y los parámetros
    const result = await database.getFirstAsync(
      "SELECT * FROM Habito WHERE id = ?",
      [id]
    );
    return result as Habit | null; // Devuelve el hábito encontrado o null si no se encuentra
  } catch (error) {
    console.error("Error al obtener el hábito:", error);
    return null;
  }
};

export const getHabitByIdUser = async (idUsuario: string): Promise<Habit[]> => {
  const database = await db;
  try {
    const result = await database.getAllAsync(
      "SELECT * FROM Habito WHERE idUsuario = ?",
      [idUsuario]
    );

    // Verifica que result sea un arreglo y cada elemento sea del tipo Habit
    if (Array.isArray(result)) {
      return result.map((item) => item as Habit); // Asegúrate de que cada elemento sea del tipo Habit
    } else {
      console.warn("Se esperaba un arreglo, pero se obtuvo:", result);
      return []; // Devuelve un arreglo vacío si no es un arreglo
    }
  } catch (error) {
    console.error("Error al obtener los hábitos:", error);
    return []; // Devuelve un arreglo vacío en caso de error
  }
};
//agregar habito
export const addHabit = async (
  idUsuario: string,
  habitName: string,
  habitImportance: number,
  habitDescription: string
) => {
  const database = await db;

  try {
    const result = await database.runAsync(
      "INSERT INTO Habito (idUsuario, idNivelImportancia, nombre, descripcion) VALUES (?, ?, ?, ?)",
      [idUsuario, habitImportance, habitName, habitDescription]
    );

    return result.lastInsertRowId ? true : false;
  } catch (error) {
    console.error("Error al agregar el hábito:", error);
    return false;
  }
};

export const updateHabit = async (
  id: number,
  habitImportance: number,
  nombre: string,
  descripcion: string
): Promise<boolean> => {
  const database = await db;
  try {
    await database.runAsync(
      "UPDATE Habito SET idNivelImportancia= ?, nombre = ?, descripcion = ? WHERE id = ?",
      [habitImportance, nombre, descripcion, id]
    );
    return true;
  } catch (error) {
    console.error("Error al actualizar el hábito:", error);
    return false;
  }
};

export const deleteHabit = async (id: number): Promise<boolean> => {
  const database = await db;
  try {
    await database.runAsync("DELETE FROM Habito WHERE id = ?", [id]);
    return true;
  } catch (error) {
    console.error("Error al eliminar el hábito:", error);
    return false;
  }
};

//Usuarios
type Usuario = {
  id: number;
  nombre: string;
  email: string;
  passwordHash: string;
  firebaseId: string;
};

// Obtener todos los usuarios
export const getUsuarios = async (): Promise<Usuario[]> => {
  const database = await db;

  try {
    // Cambia la consulta para seleccionar de la tabla Usuario
    const result = await database.getAllAsync("SELECT * FROM Usuario");
    console.log("Usuarios obtenidos:", result);
    return result as Usuario[]; // Asegúrate de que el resultado se ajuste a la interfaz Usuario
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    return []; // Retorna un arreglo vacío en caso de error
  }
};

//agregar usuario
export const addUser = async (
  nombre: string,
  email: string,
  numeroCelular: string,
  passwordHash: string,
  firebaseId: string
) => {
  const database = await db;

  try {
    await database.runAsync(
      "INSERT INTO Usuario (nombre, email, contraseña, firebaseId) VALUES (?, ?, ?, ?)",
      [nombre, email, passwordHash, firebaseId] // Almacena el firebaseId
    );
    return true;
  } catch (error) {
    console.error("Error al agregar el usuario:", error);
    return false;
  }
};

// Función para actualizar el firebaseId en la base de datos
export const updateFirebaseId = async (
  email: string,
  firebaseId: string
): Promise<boolean> => {
  const database = await db;

  try {
    await database.runAsync(
      "UPDATE Usuario SET firebaseId = ? WHERE email = ?",
      [firebaseId, email]
    );
    return true; // Retorna true si la actualización fue exitosa
  } catch (error) {
    console.error("Error al actualizar el firebaseId:", error);
    return false; // Retorna false en caso de error
  }
};

export const getNumericIdByFirebaseId = async (
  firebaseId: string
): Promise<number | null> => {
  const database = await db;

  try {
    const result = await database.getFirstAsync<{ id: number }>(
      "SELECT id FROM Usuario WHERE firebaseId = ?",
      [firebaseId]
    );
    console.log("el id con el firebase es:", result); // Log del resultado de la consulta
    return result ? result.id : null; // Devuelve el ID numérico si se encuentra, o null
  } catch (error) {
    console.error("Error al obtener el ID numérico por Firebase ID:", error);
    return null; // Retorna null en caso de error
  }
};
export const getUserByFirebaseId = async (
  firebaseId: string
): Promise<Usuario | null> => {
  const database = await db;
  try {
    const result = await database.getFirstAsync(
      "SELECT * FROM Usuario WHERE firebaseId = ?",
      [firebaseId]
    );
    console.log(
      "Usuario encontrado por -getUserByFirebaseId- Firebase ID:",
      result
    ); // Log del usuario encontrado
    return result ? (result as Usuario) : null; // Devuelve el usuario encontrado o null
  } catch (error) {
    console.error("Error al obtener el usuario por Firebase ID:", error);
    return null;
  }
};
