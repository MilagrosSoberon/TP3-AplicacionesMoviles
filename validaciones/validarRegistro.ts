const validarDataRegistroUsuario = (nombre: string, email: string, numeroCelular: string, password: string): boolean => {
  // campos vacios
  if (!nombre || !email || !numeroCelular || !password) {
      return false; 
  }

  // valida la contraseña
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // Al menos 8 caracteres, al menos un número y al menos una mayúscula
  if (!passwordRegex.test(password)) {
      return false; 
  }

  // validar el email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // una @ y que termine en .com
  if (!emailRegex.test(email) || !email.endsWith('.com')) {
      return false; 
  }

  return true;
};

export default validarDataRegistroUsuario;