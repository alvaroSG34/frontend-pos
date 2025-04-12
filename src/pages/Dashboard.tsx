import { useAuth } from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Bienvenido al Dashboard</h1>
      <button onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Dashboard;
