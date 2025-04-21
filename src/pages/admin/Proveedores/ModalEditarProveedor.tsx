import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import axios from 'axios';
  import { showSuccess, showError } from '../../../utils/toastUtils';
  
  interface Props {
    open: boolean;
    onClose: () => void;
    onUpdated: () => void;
    proveedor: {
      id: number;
      nombre_empresa: string;
      contacto_nombre: string;
      email: string;
      telefono: string;
      direccion?: string;
    };
  }
  
  const ModalEditarProveedor = ({ open, onClose, onUpdated, proveedor }: Props) => {
    const [nombre_empresa, setNombreEmpresa] = useState('');
    const [contacto_nombre, setContactoNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
  
    const API_URL = import.meta.env.VITE_API_URL;
  
    useEffect(() => {
      if (open && proveedor) {
        setNombreEmpresa(proveedor.nombre_empresa);
        setContactoNombre(proveedor.contacto_nombre);
        setEmail(proveedor.email);
        setTelefono(proveedor.telefono);
        setDireccion(proveedor.direccion || '');
      }
    }, [open, proveedor]);
  
    const handleUpdate = async () => {
      try {
        await axios.put(`${API_URL}/api/v1/proveedores/${proveedor.id}`, {
          nombre_empresa, contacto_nombre, email, telefono, direccion
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        showSuccess('Proveedor actualizado');
        onUpdated();
        onClose();
      } catch {
        showError('No se pudo actualizar el proveedor');
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Editar Proveedor</DialogTitle>
        <DialogContent>
          <TextField label="Nombre Empresa" fullWidth margin="normal" value={nombre_empresa} onChange={(e) => setNombreEmpresa(e.target.value)} />
          <TextField label="Nombre Contacto" fullWidth margin="normal" value={contacto_nombre} onChange={(e) => setContactoNombre(e.target.value)} />
          <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Teléfono" fullWidth margin="normal" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          <TextField label="Dirección" fullWidth margin="normal" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleUpdate} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ModalEditarProveedor;
  