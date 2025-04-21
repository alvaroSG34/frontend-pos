import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Select, MenuItem, InputLabel,
    FormControl, Switch, FormControlLabel
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import axios from 'axios';
  import { showSuccess, showError } from '../../../utils/toastUtils';
  
  interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
  }
  
  interface Producto {
    id: number;
    nombre: string;
  }
  
  interface Proveedor {
    id: number;
    nombre_empresa: string;
  }
  
  const ModalCrearProductoProveedor = ({ open, onClose, onCreated }: Props) => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  
    const [idProducto, setIdProducto] = useState<number | ''>('');
    const [idProveedor, setIdProveedor] = useState<number | ''>('');
    const [precioCompra, setPrecioCompra] = useState(0);
    const [codigoProveedor, setCodigoProveedor] = useState('');
    const [esPrincipal, setEsPrincipal] = useState(false);
  
    const API_URL = import.meta.env.VITE_API_URL;
  
    const fetchData = async () => {
      try {
        const [resProd, resProv] = await Promise.all([
          axios.get(`${API_URL}/api/v1/products`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get(`${API_URL}/api/v1/proveedores`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          })
        ]);
        setProductos(resProd.data);
        setProveedores(resProv.data);
      } catch {
        showError('Error al cargar productos o proveedores');
      }
    };
  
    const handleSubmit = async () => {
      try {
        await axios.post(`${API_URL}/api/v1/producto-proveedor`, {
          id_producto: idProducto,
          id_proveedor: idProveedor,
          precio_compra: precioCompra,
          codigo_proveedor: codigoProveedor || null,
          es_proveedor_principal: esPrincipal
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        showSuccess('Relación registrada');
        onCreated();
        onClose();
        resetForm();
      } catch {
        showError('No se pudo registrar la relación');
      }
    };
  
    const resetForm = () => {
      setIdProducto('');
      setIdProveedor('');
      setPrecioCompra(0);
      setCodigoProveedor('');
      setEsPrincipal(false);
    };
  
    useEffect(() => {
      if (open) fetchData();
    }, [open]);
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Nuevo Producto - Proveedor</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Producto</InputLabel>
            <Select value={idProducto} onChange={(e) => setIdProducto(Number(e.target.value))} label="Producto">
              {productos.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
  
          <FormControl fullWidth margin="normal">
            <InputLabel>Proveedor</InputLabel>
            <Select value={idProveedor} onChange={(e) => setIdProveedor(Number(e.target.value))} label="Proveedor">
              {proveedores.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.nombre_empresa}</MenuItem>
              ))}
            </Select>
          </FormControl>
  
          <TextField
            label="Precio Compra"
            type="number"
            fullWidth
            margin="normal"
            value={precioCompra}
            onChange={(e) => setPrecioCompra(Number(e.target.value))}
          />
  
          <TextField
            label="Código del Proveedor"
            fullWidth
            margin="normal"
            value={codigoProveedor}
            onChange={(e) => setCodigoProveedor(e.target.value)}
          />
  
          <FormControlLabel
            control={<Switch checked={esPrincipal} onChange={(e) => setEsPrincipal(e.target.checked)} />}
            label="¿Es proveedor principal?"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ModalCrearProductoProveedor;
  