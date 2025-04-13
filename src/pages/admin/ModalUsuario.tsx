import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Role {
  id: number;
  name: string;
}

interface ModalUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (usuario: {
    username: string;
    email: string;
    password: string;
    role_id: number;
  }) => void;
}

const ModalUsuario = ({ isOpen, onClose, onCreate }: ModalUsuarioProps) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role_id: 1,
  });

  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/roles/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setRoles(res.data);
      } catch (error) {
        console.error('Error al cargar roles', error);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'role_id' ? Number(value) : value });
  };

  const handleSubmit = () => {
    onCreate(form);
    setForm({ username: '', email: '', password: '', role_id: 1 });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Agregar Usuario"
      style={modalStyles}
    >
      <h2>Nuevo Usuario</h2>
      <div style={styles.formContainer}>
        <input name="username" placeholder="Usuario" value={form.username} onChange={handleChange}  style={styles.input}/>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange}  style={styles.input}/>
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} style={styles.input} />

        <select name="role_id" value={form.role_id} onChange={handleChange}  style={styles.input}>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between' }}>
          <button style={styles.createButton} onClick={handleSubmit}>Crear</button>
          <button onClick={onClose} style={styles.cancelButton}>Cancelar</button>
        </div>
      </div>
    </Modal>
  );
};

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    padding: '2rem',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    height: 'auto',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    overflow: 'auto',
  },
};

const styles: { [key: string]: React.CSSProperties } = {
  input: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  createButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    flex: 1,
    minWidth: '120px',
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
    color: '#111',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    flex: 1,
    minWidth: '120px',
  },
};

export default ModalUsuario;