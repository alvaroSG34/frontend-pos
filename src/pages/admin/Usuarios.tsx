import { useEffect, useState } from 'react';
import axios from 'axios';
import ModalUsuario from './ModalUsuario'; // ajustá la ruta según tu estructura
import ModalRolUsuario from './ModalRolUsuario'; // ajustá la ruta si es necesario
type User = {
  id: number;
  username: string;
  email: string;
  role: {
    name: string;
  };
};

type NewUser = {
  username: string;
  email: string;
  password: string;
  role_id: number;
};

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [rolModalIsOpen, setRolModalIsOpen] = useState(false);
  const [usuarioSeleccionadoId, setUsuarioSeleccionadoId] = useState<number | null>(null);
  const abrirModalRol = (id: number) => {
    setUsuarioSeleccionadoId(id);
    setRolModalIsOpen(true);
  };

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsuarios(res.data);
    } catch (error) {
      console.error('Error al obtener usuarios', error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id: number) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      alert('No se pudo eliminar');
    }
  };

  const crearUsuario = async (data: NewUser) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/users/`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchUsuarios(); // refresca la tabla
    } catch (error) {
      alert('Error al crear el usuario');
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div>
      <h2>👤 Lista de Usuarios</h2>

      <button onClick={() => setModalIsOpen(true)} style={styles.addButton}>
        Agregar usuario
      </button>

      <ModalUsuario
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onCreate={crearUsuario}
      />

      {usuarioSeleccionadoId !== null && (
        <ModalRolUsuario
          isOpen={rolModalIsOpen}
          userId={usuarioSeleccionadoId}
          onClose={() => setRolModalIsOpen(false)}
          onRolUpdated={fetchUsuarios} // para refrescar la tabla
        />
      )}


      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user, i) => (
                <tr key={user.id} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role?.name ?? 'Sin rol'}</td>
                  <td>
                    <button style={styles.deleteBtn} onClick={() => eliminarUsuario(user.id)}>
                      Eliminar
                    </button>
                    <button
                      style={{ ...styles.deleteBtn, backgroundColor: '#3b82f6', marginRight: '0.5rem' }}
                      onClick={() => abrirModalRol(user.id)}
                    >
                      Cambiar rol
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  addButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '1rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px',
  },
  rowEven: {
    backgroundColor: '#f9fafb',
  },
  rowOdd: {
    backgroundColor: '#ffffff',
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
  },
};

export default Usuarios;
