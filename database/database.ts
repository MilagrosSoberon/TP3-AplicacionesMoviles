import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

const db = SQLite.openDatabaseAsync('db_habitos.db');

export const initializeDatabase = async () => {
  const database = await db;

  //empezar de 0
//   try {
//     await database.execAsync(`DROP TABLE IF EXISTS Registro;`);
//     await database.execAsync(`DROP TABLE IF EXISTS Habito;`);
//     await database.execAsync(`DROP TABLE IF EXISTS Usuario;`);
//     await database.execAsync(`DROP TABLE IF EXISTS NivelImportancia;`);

//     console.log('Todas las tablas han sido eliminadas con éxito');
//   } catch (error) {
//     console.error('Error al eliminar las tablas:', error);
//   }
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
      contraseña TEXT NOT NULL
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
//   await database.execAsync(
//     `INSERT INTO NivelImportancia (nombre) VALUES ('Alto');`
//   );

//   await database.execAsync(
//     `INSERT INTO NivelImportancia (nombre) VALUES ('Medio');`
//   );

//   await database.execAsync(
//     `INSERT INTO NivelImportancia (nombre) VALUES ('Bajo');`
//   );
};

//agregar habito
export const addHabit = async (habitName: string, habitImportance: number, habitDescription: string) => {
  const database = await db;

  try {
    const result = await database.runAsync(
      'INSERT INTO Habito (idUsuario, idNivelImportancia, nombre, descripcion) VALUES (?, ?, ?, ?)',
      [1, habitImportance, habitName, habitDescription]
    );

    return result.lastInsertRowId ? true : false;
  } catch (error) {
    console.error("Error al agregar el hábito:", error);
    return false;
  }
};

//obtener niveles de importancia
type ImportanceLevel = {
    id: number;
    nombre: string;
  };
  
  export const getImportanceLevels = async (): Promise<ImportanceLevel[]> => {
    const database = await db;
  
    try {
      const result = await database.getAllAsync('SELECT * FROM NivelImportancia');
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
      const result = await database.getAllAsync('SELECT * FROM Habito');
      return result as Habit[]; 
    } catch (error) {
      console.error("Error al obtener los hábitos:", error);
      return [];
    }
  };

  //agregar usuario

  export const addUser = async (nombre: string, email: string, numeroCelular: string, passwordHash: string) => {
    const database = await db;
 
    try {
      await database.runAsync(
        'INSERT INTO Usuario (nombre, email, contraseña) VALUES (?, ?, ?)',
        [nombre, email, passwordHash]
      );
      return true;
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
      return false;
    }
 };

 // database.ts
 export const getHabitById = async (id: number): Promise<Habit | null> => {
  const database = await db;
  try {
    // Llama a getFirstAsync con la consulta y los parámetros
    const result = await database.getFirstAsync('SELECT * FROM Habito WHERE id = ?', [id]);
    return result as Habit | null; // Devuelve el hábito encontrado o null si no se encuentra
  } catch (error) {
    console.error("Error al obtener el hábito:", error);
    return null;
  }
};
export const updateHabit = async (id: number, nombre: string, descripcion: string): Promise<boolean> => {
  const database = await db;
  try {
    await database.runAsync('UPDATE Habito SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion, id]);
    return true;
  } catch (error) {
    console.error("Error al actualizar el hábito:", error);
    return false;
  }
};

export const deleteHabit = async (id: number): Promise<boolean> => {
  const database = await db;
  try {
    await database.runAsync('DELETE FROM Habito WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error("Error al eliminar el hábito:", error);
    return false;
  }
};