import { useAuth } from '../../auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import Productos from '../admin/Productos/Productos';
import Reportes from './Reportes/Reportes';
import Roles from './Roles/Roles';
import Usuarios from './Usuarios/Usuarios';
import Categorias from './Categorias/Categorias';
import Proveedores from './Proveedores/Proveedores';
import Inventario from './Inventario/Inventario';
import ProductoProveedor from './ProductoProveedor/ProductoProveedor';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState('usuarios');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { key: 'usuarios', label: '👤 Gestión de Usuarios' },
    { key: 'productos', label: '📦 Productos' },
    { key: 'reportes', label: '📊 Reportes' },
    { key: 'roles', label: '🔐 Roles y permisos' },
    { key: 'categorias', label: '🗂️ Categorías' },
    { key: 'proveedores', label: '🏭 Proveedores' },
    { key: 'inventario', label: '📦 Inventario' },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSelect = (key: string) => {
    setSelected(key);
    if (isMobile) setSidebarOpen(false); // cerrar sidebar en móvil
  };

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      {(sidebarOpen || !isMobile) && (
        <aside style={styles.sidebar}>
          <div>
            <h2 style={styles.logo}>Admin</h2>
            <nav>
              {menuItems.map((item) => (
                <div
                  key={item.key}
                  style={{
                    ...styles.menuItem,
                    backgroundColor: selected === item.key ? '#e5e7eb' : 'transparent',
                  }}
                  onClick={() => handleSelect(item.key)}
                >
                  {item.label}
                </div>
              ))}
            </nav>
          </div>

          <button onClick={handleLogout} style={styles.logoutButton}>
            Cerrar sesión
          </button>
        </aside>
      )}

      {/* Main content */}
      <main style={styles.content}>
        {isMobile && (
          <button onClick={toggleSidebar} style={styles.menuToggle}>
            ☰
          </button>
        )}
        {selected === 'usuarios' && <Usuarios />}
        {selected === 'productos' && <Productos />}
        {selected === 'reportes' && <Reportes />}
        {selected === 'roles' && <Roles />}
        {selected === 'categorias' && <Categorias />}
        {selected === 'proveedores' && <Proveedores />}
        {selected === 'inventario' && <Inventario />}
        {selected === 'producto-proveedor' && <ProductoProveedor />}
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  layout: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    fontFamily: 'Segoe UI, sans-serif',
    overflow: 'hidden',
    position: 'relative',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#f3f4f6',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRight: '1px solid #e5e7eb',
    height: '100vh',
    position: 'relative',
    zIndex: 10,
  },
  logo: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
  },
  menuItem: {
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '0.5rem',
    transition: 'background 0.2s ease',
  },
  logoutButton: {
    marginTop: '2rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  content: {
    flex: 1,
    padding: '2rem',
    backgroundColor: '#f9fafb',
    overflowY: 'auto',
    position: 'relative',
  },
  menuToggle: {
    background: 'none',
    border: 'none',
    fontSize: '2rem',
    cursor: 'pointer',
    marginBottom: '1rem',
  },
};

export default AdminDashboard;
