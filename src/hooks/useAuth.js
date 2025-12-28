import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook personalizado para acceder al contexto de autenticación.
 * Permite obtener el usuario, estado de carga y funciones de login/logout
 * sin necesidad de importar useContext en cada componente.
 */
const useAuth = () => {
  const context = useContext(AuthContext);

  // Validación de seguridad: se asegura que el hook se use dentro del proveedor
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }

  return context;
};

export default useAuth;