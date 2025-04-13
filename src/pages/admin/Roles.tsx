import { useEffect, useState } from 'react';
import axios from 'axios';  
type Role = {
  id: number;
  name: string;
};

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const [nuevoRol, setNuevoRol] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);

  const fetchRoles = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/roles/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRoles(res.data);
    } catch (error) {
      console.error('Error al obtener roles', error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarRol = async (id: number) => {
    if (!confirm('¿Estás seguro que deseas eliminar este rol?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/v1/roles/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchRoles(); // refresca la lista
    } catch (error) {
      alert('No se pudo eliminar el rol');
    }
  };
  

  const crearRol = async () => {
    if (!nuevoRol.trim()) return alert('El nombre del rol es obligatorio');
  
    try {
      await axios.post(
        'http://localhost:8000/api/v1/roles/',
        { name: nuevoRol },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchRoles();
      setNuevoRol('');
      setModalAbierto(false);
    } catch (error) {
      alert('Error al crear el rol');
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div>
      <h2>🔐 Lista de Roles</h2>

      <button onClick={() => setModalAbierto(true)} style={styles.addButton}>
        ➕ Agregar rol
      </button>

      {loading ? (
        <p>Cargando roles...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.name}</td>
              <td>
                <button style={styles.deleteBtn} onClick={() => eliminarRol(role.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
            
            ))}
          </tbody>
        </table>
        
      )}
      {modalAbierto && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <h3>Nuevo rol</h3>
      <input
        type="text"
        placeholder="Nombre del rol"
        value={nuevoRol}
        onChange={(e) => setNuevoRol(e.target.value)}
        style={styles.input}
      />
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button onClick={crearRol} style={styles.createButton}>Crear</button>
        <button onClick={() => setModalAbierto(false)} style={styles.cancelButton}>Cancelar</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  deleteBtn: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
  },
  
  addButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '1rem',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
  },
  input: {
    padding: '0.5rem',
    width: '100%',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  createButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
    color: '#111',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  },
};

export default Roles;
