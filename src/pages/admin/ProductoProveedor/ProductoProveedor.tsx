import { useEffect, useState } from 'react';
import {
  Typography, Button, Table, TableHead, TableRow,
  TableCell, TableBody, TableContainer, Paper
} from '@mui/material';
import ModalCrearProductoProveedor from './ModalCrearProductoProveedor';
import axios from 'axios';
import { showError, showSuccess } from '../../../utils/toastUtils';

interface Relacion {
  id: number;
  precio_compra: number;
  codigo_proveedor?: string;
  es_proveedor_principal: boolean;
  producto: { nombre: string };
  proveedor: { nombre_empresa: string };
}

const ProductoProveedor = () => {
  const [relaciones, setRelaciones] = useState<Relacion[]>([]);
  const [openCrear, setOpenCrear] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchRelaciones = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/producto-proveedor/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setRelaciones(res.data);
      showSuccess('Relaciones cargadas correctamente');
    } catch {
      showError('Error al cargar relaciones producto-proveedor');
    }
  };

  useEffect(() => {
    fetchRelaciones();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h5" gutterBottom>Relaciones Producto - Proveedor</Typography>

      <Button variant="contained" onClick={() => setOpenCrear(true)}>
        Nueva Relación
      </Button>

      <ModalCrearProductoProveedor
        open={openCrear}
        onClose={() => setOpenCrear(false)}
        onCreated={fetchRelaciones}
      />

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Precio Compra</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Principal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {relaciones.map((rel) => (
              <TableRow key={rel.id}>
                <TableCell>{rel.producto?.nombre}</TableCell>
                <TableCell>{rel.proveedor?.nombre_empresa}</TableCell>
                <TableCell>Bs. {rel.precio_compra}</TableCell>
                <TableCell>{rel.codigo_proveedor || '-'}</TableCell>
                <TableCell>{rel.es_proveedor_principal ? 'Sí' : 'No'}</TableCell>
              </TableRow>
            ))}
            {!relaciones.length && (
              <TableRow>
                <TableCell colSpan={5}>No hay relaciones registradas</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ProductoProveedor;
