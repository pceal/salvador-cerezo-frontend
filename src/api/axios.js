import axios from 'axios';

/**
 * Configuración de la instancia de Axios
 */
const api = axios.create({
  // Se recomienda usar variables de entorno. 
  // En Vite: import.meta.env.VITE_API_URL
  baseURL: 'https://tu-api-ejemplo.com/api',
  timeout: 10000, // 10 segundos antes de cancelar la petición
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Interceptor de Peticiones:
 * Agrega el token Bearer automáticamente desde localStorage
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Respuestas:
 * Maneja errores globales como el 401 (no autorizado)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el servidor responde con 401, el token probablemente expiró
    if (error.response && error.response.status === 401) {
      console.error('Sesión expirada. Redirigiendo al login...');
      localStorage.removeItem('token');
      
      // Solo redirigir si no estamos ya en la página de login para evitar bucles
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Manejo de errores de conexión (servidor caído)
    if (!error.response) {
      console.error('Error de red: Asegúrate de que el servidor esté encendido.');
    }

    return Promise.reject(error);
  }
);

export default api;