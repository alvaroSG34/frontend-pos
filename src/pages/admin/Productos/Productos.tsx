import { useEffect, useState } from 'react';
import {
  Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { showSuccess, showError } from '../../../utils/toastUtils';
import axios from 'axios';
import ModalCrearProducto from './ModalCrearProducto';
import ModalEditarProducto from './ModalEditarProducto';

interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_compra: number;
  precio_venta: number;
  imagen?: string;
  estado: boolean;
  id_categoria: number;
}

const Productos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCrear, setOpenCrear] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchProductos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/products`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProductos(res.data);
    } catch (err) {
      showError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (id: number) => {
    if (!confirm('¿Deseas eliminar este producto?')) return;
    try {
      await axios.delete(`${API_URL}/api/v1/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      showSuccess('Producto eliminado');
      setProductos((prev) => prev.filter(p => p.id !== id));
    } catch {
      showError('No se pudo eliminar');
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h5" gutterBottom>Productos</Typography>

      <Button variant="contained" color="primary" onClick={() => setOpenCrear(true)}>
        Nuevo Producto
      </Button>

      <ModalCrearProducto
        open={openCrear}
        onClose={() => setOpenCrear(false)}
        onCreated={fetchProductos}
      />

      {productoEditar && (
        <ModalEditarProducto
          open={openEditar}
          onClose={() => {
            setOpenEditar(false);
            setProductoEditar(null);
          }}
          producto={productoEditar}
          onUpdated={fetchProductos}
        />
      )}

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Imagen</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio Compra</TableCell>
              <TableCell>Precio Venta</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((prod) => (
              <TableRow key={prod.id}>
                <TableCell>
                  {prod.imagen && (
                    <img src={prod.imagen} alt={prod.nombre} style={{ height: 40 }} />
                  )}
                </TableCell>
                <TableCell>{prod.nombre}</TableCell>
                <TableCell>${prod.precio_compra}</TableCell>
                <TableCell>${prod.precio_venta}</TableCell>
                <TableCell>{prod.estado ? 'Activo' : 'Inactivo'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => {
                    setProductoEditar(prod);
                    setOpenEditar(true);
                  }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => eliminarProducto(prod.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!productos.length && !loading && (
              <TableRow><TableCell colSpan={6}>No hay productos</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Productos;
