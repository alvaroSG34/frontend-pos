import { useEffect, useState } from 'react';
import {
  Typography, Button, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Paper, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalCrearProveedor from './ModalCrearProveedor';
import ModalEditarProveedor from './ModalEditarProveedor';
import axios from 'axios';
import { showError, showSuccess } from '../../../utils/toastUtils';

interface Proveedor {
  id: number;
  nombre_empresa: string;
  contacto_nombre: string;
  email: string;
  telefono: string;
  direccion?: string;
}

const Proveedores = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [openCrear, setOpenCrear] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [proveedorEditar, setProveedorEditar] = useState<Proveedor | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchProveedores = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/proveedores/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProveedores(res.data);
    } catch {
      showError('Error al cargar proveedores');
    }
  };

  const eliminarProveedor = async (id: number) => {
    if (!confirm('¿Deseas eliminar este proveedor?')) return;
    try {
      await axios.delete(`${API_URL}/api/v1/proveedores/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      showSuccess('Proveedor eliminado');
      setProveedores((prev) => prev.filter((p) => p.id !== id));
    } catch {
      showError('No se pudo eliminar el proveedor');
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h5" gutterBottom>Proveedores</Typography>

      <Button variant="contained" onClick={() => setOpenCrear(true)}>
        Nuevo Proveedor
      </Button>

      <ModalCrearProveedor
        open={openCrear}
        onClose={() => setOpenCrear(false)}
        onCreated={fetchProveedores}
      />

      {proveedorEditar && (
        <ModalEditarProveedor
          open={openEditar}
          onClose={() => {
            setOpenEditar(false);
            setProveedorEditar(null);
          }}
          proveedor={proveedorEditar}
          onUpdated={fetchProveedores}
        />
      )}

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Empresa</TableCell>
              <TableCell>Contacto</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proveedores.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.nombre_empresa}</TableCell>
                <TableCell>{p.contacto_nombre}</TableCell>
                <TableCell>{p.email}</TableCell>
                <TableCell>{p.telefono}</TableCell>
                <TableCell>{p.direccion}</TableCell>
                <TableCell>
                  <IconButton onClick={() => {
                    setProveedorEditar(p);
                    setOpenEditar(true);
                  }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => eliminarProveedor(p.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!proveedores.length && (
              <TableRow>
                <TableCell colSpan={6}>No hay proveedores registrados</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Proveedores;
