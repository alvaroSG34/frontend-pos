import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { JSX } from 'react';

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, token } = useAuth();

  // Decodificar el token para extraer el rol (o mejor aún, tenerlo guardado en el contexto)
  const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const role = payload?.role;

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  if (role !== 'admin') {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default AdminRoute;
