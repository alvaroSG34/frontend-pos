import { useEffect, useState } from 'react';
import axios from 'axios';
import ModalCrearUsuario from './ModalCrearUsuario';
import ModalEditarUsuario from './ModalEditarUsuario';
import ModalRolUsuario from '../Roles/ModalRolUsuario';
import { showError, showSuccess } from '../../../utils/toastUtils';

interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  role: {
    name: string;
  };
}

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [modalRolOpen, setModalRolOpen] = useState(false);

  const [usuarioEditar, setUsuarioEditar] = useState<User | null>(null);
  const [usuarioSeleccionadoId, setUsuarioSeleccionadoId] = useState<number | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/users/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsuarios(res.data);
      showSuccess('Usuarios cargados con éxito');
    } catch (error) {
      showError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const crearUsuario = async (data: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    password: string;
    role_id: number;
  }) => {
    try {
      await axios.post(`${API_URL}/api/v1/users/`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchUsuarios();
      showSuccess('Usuario creado con éxito');
    } catch {
      showError('Error al crear el usuario');
    }
  };


  const eliminarUsuario = async (id: number) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    try {
      await axios.delete(`${API_URL}/api/v1/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      showSuccess('Usuario eliminado con éxito');
    } catch {
      showError('Error al eliminar el usuario');
    }
  };

  const abrirModalEditar = (user: User) => {
    setUsuarioEditar(user);
    setModalEditarOpen(true);
  };

  const abrirModalRol = (id: number) => {
    setUsuarioSeleccionadoId(id);
    setModalRolOpen(true);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div>
      <h2 style={{ color: 'black' }}>👤 Lista de Usuarios</h2>

      <button onClick={() => setModalCrearOpen(true)} style={styles.addButton}>
        Agregar usuario
      </button>

      <ModalCrearUsuario
        isOpen={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onCreate={crearUsuario}
      />

      {usuarioEditar && (
        <ModalEditarUsuario
          isOpen={modalEditarOpen}
          onClose={() => setModalEditarOpen(false)}
          user={usuarioEditar}
          onUpdated={fetchUsuarios}
        />
      )}

      {usuarioSeleccionadoId !== null && (
        <ModalRolUsuario
          isOpen={modalRolOpen}
          userId={usuarioSeleccionadoId}
          onClose={() => setModalRolOpen(false)}
          onRolUpdated={fetchUsuarios}
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
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user, i) => (
                <tr key={user.id} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                  <td>{user.id}</td>
                  <td>{`${user.nombre} ${user.apellido}`}</td>
                  <td>{user.email}</td>
                  <td>{user.telefono}</td>
                  <td>{user.role?.name ?? 'Sin rol'}</td>
                  <td>
                    <button style={styles.deleteBtn} onClick={() => eliminarUsuario(user.id)}>
                      Eliminar
                    </button>
                    <button
                      style={{ ...styles.deleteBtn, backgroundColor: '#10b981', marginRight: '0.5rem' }}
                      onClick={() => abrirModalEditar(user)}
                    >
                      Editar
                    </button>
                    <button
                      style={{ ...styles.deleteBtn, backgroundColor: '#3b82f6' }}
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
