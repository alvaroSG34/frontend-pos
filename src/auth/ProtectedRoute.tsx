import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { JSX } from 'react';

interface Props {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated, initialized } = useAuth();

  if (!initialized) {
    // Mientras se verifica el estado del token, podemos mostrar un loader o nada
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
