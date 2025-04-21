import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Select, MenuItem, InputLabel, FormControl
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import axios from 'axios';
  import { showError, showSuccess } from '../../../utils/toastUtils';
  
  interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
  }
  
  interface Producto {
    id: number;
    nombre: string;
  }
  
  const ModalCrearInventario = ({ open, onClose, onCreated }: Props) => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [idProducto, setIdProducto] = useState<number | ''>('');
    const [stockActual, setStockActual] = useState(0);
    const [stockMinimo, setStockMinimo] = useState(0);
  
    const API_URL = import.meta.env.VITE_API_URL;
  
    const fetchProductos = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/products/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProductos(res.data);
      } catch {
        showError('Error al cargar productos');
      }
    };
  
    const handleSubmit = async () => {
      try {
        await axios.post(`${API_URL}/api/v1/inventario/`, {
          id_producto: idProducto,
          stock_actual: stockActual,
          stock_minimo: stockMinimo
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        showSuccess('Inventario registrado');
        onCreated();
        onClose();
        resetForm();
      } catch {
        showError('No se pudo registrar inventario');
      }
    };
  
    const resetForm = () => {
      setIdProducto('');
      setStockActual(0);
      setStockMinimo(0);
    };
  
    useEffect(() => {
      if (open) fetchProductos();
    }, [open]);
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Registrar Inventario</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Producto</InputLabel>
            <Select value={idProducto} onChange={(e) => setIdProducto(Number(e.target.value))} label="Producto">
              {productos.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="Stock Actual" type="number" fullWidth margin="normal" value={stockActual} onChange={(e) => setStockActual(Number(e.target.value))} />
          <TextField label="Stock Mínimo" type="number" fullWidth margin="normal" value={stockMinimo} onChange={(e) => setStockMinimo(Number(e.target.value))} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ModalCrearInventario;
  