// Validación de contraseña (al menos 6 caracteres)
export const validatePassword = (password) => {
    return password.length >= 8;
  };
  
  // Validación de nombre de usuario (no vacío y mínimo 3 caracteres)
  export const validateUsername = (username) => {
    return username.length >= 3;
  };
  
  // Validación de confirmación de contraseña
  export const validatePasswordMatch = (password, confirmPassword) => {
    return password === confirmPassword;
  };
  
  // Validación general para los formularios
  export const validateForm = (data) => {
    let errors = {};
  
    if (!data.username || !validateUsername(data.username)) {
      errors.username = 'El nombre de usuario debe tener al menos 3 caracteres.';
    }
  
    if (!data.password || !validatePassword(data.password)) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres.';
    }
  
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden.';
    }
  
    return errors;
  };
  