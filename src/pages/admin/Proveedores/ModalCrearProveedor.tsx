import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField
  } from '@mui/material';
  import { useState } from 'react';
  import axios from 'axios';
  import { showSuccess, showError } from '../../../utils/toastUtils';
  
  interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
  }
  
  const ModalCrearProveedor = ({ open, onClose, onCreated }: Props) => {
    const [nombre_empresa, setNombreEmpresa] = useState('');
    const [contacto_nombre, setContactoNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
  
    const API_URL = import.meta.env.VITE_API_URL;
  
    const handleSubmit = async () => {
      try {
        await axios.post(`${API_URL}/api/v1/proveedores`, {
          nombre_empresa, contacto_nombre, email, telefono, direccion
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        showSuccess('Proveedor creado');
        onCreated();
        onClose();
        resetForm();
      } catch {
        showError('No se pudo crear el proveedor');
      }
    };
  
    const resetForm = () => {
      setNombreEmpresa('');
      setContactoNombre('');
      setEmail('');
      setTelefono('');
      setDireccion('');
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Nuevo Proveedor</DialogTitle>
        <DialogContent>
          <TextField label="Nombre Empresa" fullWidth margin="normal" value={nombre_empresa} onChange={(e) => setNombreEmpresa(e.target.value)} />
          <TextField label="Nombre Contacto" fullWidth margin="normal" value={contacto_nombre} onChange={(e) => setContactoNombre(e.target.value)} />
          <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Teléfono" fullWidth margin="normal" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          <TextField label="Dirección" fullWidth margin="normal" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ModalCrearProveedor;
  