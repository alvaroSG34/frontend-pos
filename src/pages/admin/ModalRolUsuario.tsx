import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Role {
  id: number;
  name: string;
}

interface ModalRolUsuarioProps {
  isOpen: boolean;
  userId: number;
  onClose: () => void;
  onRolUpdated: () => void;
}

const ModalRolUsuario = ({ isOpen, userId, onClose, onRolUpdated }: ModalRolUsuarioProps) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number>(1);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/roles/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setRoles(res.data);
      } catch (err) {
        console.error('Error al cargar roles', err);
      }
    };
    if (isOpen) fetchRoles();

    
  }, [isOpen]);

  const actualizarRol = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/users/${userId}/role`, {
        role_id: selectedRoleId,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      onRolUpdated();
      onClose();
    } catch (err) {
      alert('Error al actualizar el rol');
    }
  };
  

  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Actualizar Rol"
      style={modalStyles}
    >
      <h2>Actualizar Rol</h2>
      <select
        value={selectedRoleId}
        onChange={(e) => setSelectedRoleId(Number(e.target.value))}
        style={{ padding: '0.5rem', marginBottom: '1rem', borderRadius: '6px' }}
      >
        {roles.map((role) => (
          <option key={role.id} value={role.id}>{role.name}</option>
        ))}
      </select>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button style={styles.confirmBtn} onClick={actualizarRol}>Guardar</button>
        <button style={styles.cancelBtn} onClick={onClose}>Cancelar</button>
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
    maxWidth: '400px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
};

const styles: { [key: string]: React.CSSProperties } = {
  confirmBtn: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  cancelBtn: {
    backgroundColor: '#e5e7eb',
    color: '#111',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default ModalRolUsuario;
