import api from './axios'; // Importamos la instancia configurada en el paso anterior

/**
 * Servicio encargado de la comunicación con los endpoints de identidad.
 * No maneja lógica de UI, solo peticiones y retorno de datos.
 */
const authService = {
  
  /**
   * Envía las credenciales al servidor para obtener un token.
   * @param {Object} credentials - Objeto con { email, password }
   * @returns {Promise} Datos de la respuesta (usualmente incluyen el token y datos del usuario)
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // Retornamos directamente la data para que el componente no tenga que lidiar con la estructura de Axios
      return response.data;
    } catch (error) {
      // Re-lanzamos el error para que el componente pueda mostrar un mensaje al usuario
      throw error;
    }
  },

  /**
   * Registra un nuevo usuario en el sistema.
   * @param {Object} data - Objeto con los campos requeridos por tu API
   * @returns {Promise} Datos del usuario creado
   */
  register: async (data) => {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Limpia la sesión del usuario. 
   * A veces solo requiere borrar el localStorage, 
   * pero si tu API tiene un endpoint de logout, se llama aquí.
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Si tienes un endpoint de logout:
    // return api.post('/auth/logout');
  }
};

export default authService;