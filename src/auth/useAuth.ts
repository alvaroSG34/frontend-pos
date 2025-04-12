import { useContext } from 'react';
import { AuthContext } from './AuthContext';

// Tipo del contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
