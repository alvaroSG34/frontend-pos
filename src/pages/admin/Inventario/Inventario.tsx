import { useEffect, useState } from 'react';
import {
  Typography, Button, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Paper, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalCrearInventario from './ModalCrearInventario';
import ModalEditarInventario from './ModalEditarInventario';
import axios from 'axios';
import { showError, showSuccess } from '../../../utils/toastUtils';

interface Inventario {
  id: number;
  id_producto: number;
  stock_actual: number;
  stock_minimo: number;
  fecha_actualizacion: string;
  producto: {
    nombre: string;
  };
}

const Inventario = () => {
  const [inventarios, setInventarios] = useState<Inventario[]>([]);
  const [openCrear, setOpenCrear] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [inventarioEditar, setInventarioEditar] = useState<Inventario | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchInventarios = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/inventario/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setInventarios(res.data);
    } catch {
      showError('Error al cargar inventario');
    }
  };

  const eliminarInventario = async (id: number) => {
    if (!confirm('¿Eliminar registro de inventario?')) return;
    try {
      await axios.delete(`${API_URL}/api/v1/inventario/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      showSuccess('Inventario eliminado');
      setInventarios(prev => prev.filter(i => i.id !== id));
    } catch {
      showError('No se pudo eliminar');
    }
  };

  useEffect(() => {
    fetchInventarios();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h5" gutterBottom>Inventario</Typography>

      <Button variant="contained" onClick={() => setOpenCrear(true)}>
        Nuevo Inventario
      </Button>

      <ModalCrearInventario
        open={openCrear}
        onClose={() => setOpenCrear(false)}
        onCreated={fetchInventarios}
      />

      {inventarioEditar && (
        <ModalEditarInventario
          open={openEditar}
          onClose={() => {
            setOpenEditar(false);
            setInventarioEditar(null);
          }}
          inventario={inventarioEditar}
          onUpdated={fetchInventarios}
        />
      )}

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Stock Actual</TableCell>
              <TableCell>Stock Mínimo</TableCell>
              <TableCell>Última Actualización</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventarios.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell>{inv.producto?.nombre || 'Sin nombre'}</TableCell>
                <TableCell>{inv.stock_actual}</TableCell>
                <TableCell>{inv.stock_minimo}</TableCell>
                <TableCell>{new Date(inv.fecha_actualizacion).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => {
                    setInventarioEditar(inv);
                    setOpenEditar(true);
                  }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => eliminarInventario(inv.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!inventarios.length && (
              <TableRow>
                <TableCell colSpan={5}>No hay registros de inventario</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Inventario;
