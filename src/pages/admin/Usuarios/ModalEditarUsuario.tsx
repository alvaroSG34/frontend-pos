import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { showError, showSuccess } from '../../../utils/toastUtils';

interface User {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
}

interface ModalEditarUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdated: () => void;
}

const ModalEditarUsuario = ({ isOpen, onClose, user, onUpdated }: ModalEditarUsuarioProps) => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
  });

  useEffect(() => {
    if (isOpen && user) {
      setForm({
        nombre: user.nombre,
        apellido: user.apellido,
        telefono: user.telefono,
      });
    }
  }, [isOpen, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/users/${user.id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      onUpdated();
      showSuccess('Usuario actualizado con éxito');
      onClose();
    } catch (error) {
      showError('Error al actualizar el usuario');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Editar Usuario"
      style={modalStyles}
    >
      <h2>Editar Usuario</h2>
      <div style={styles.formContainer}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} style={styles.input} />
        <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} style={styles.input} />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} style={styles.input} />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between' }}>
          <button style={styles.createButton} onClick={handleSubmit}>Guardar</button>
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
    backgroundColor: '#3b82f6',
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

export default ModalEditarUsuario;
