import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField
  } from '@mui/material';
  import { useState, useEffect } from 'react';
  import axios from 'axios';
  import { showError, showSuccess } from '../../../utils/toastUtils';
  
  interface Props {
    open: boolean;
    onClose: () => void;
    onUpdated: () => void;
    inventario: {
      id: number;
      stock_actual: number;
      stock_minimo: number;
    };
  }
  
  const ModalEditarInventario = ({ open, onClose, onUpdated, inventario }: Props) => {
    const [stockActual, setStockActual] = useState(0);
    const [stockMinimo, setStockMinimo] = useState(0);
  
    const API_URL = import.meta.env.VITE_API_URL;
  
    const handleUpdate = async () => {
      try {
        await axios.put(`${API_URL}/api/v1/inventario/${inventario.id}`, {
          stock_actual: stockActual,
          stock_minimo: stockMinimo
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        showSuccess('Inventario actualizado');
        onUpdated();
        onClose();
      } catch {
        showError('No se pudo actualizar inventario');
      }
    };
  
    useEffect(() => {
      if (open) {
        setStockActual(inventario.stock_actual);
        setStockMinimo(inventario.stock_minimo);
      }
    }, [open, inventario]);
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Editar Inventario</DialogTitle>
        <DialogContent>
          <TextField label="Stock Actual" type="number" fullWidth margin="normal" value={stockActual} onChange={(e) => setStockActual(Number(e.target.value))} />
          <TextField label="Stock Mínimo" type="number" fullWidth margin="normal" value={stockMinimo} onChange={(e) => setStockMinimo(Number(e.target.value))} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleUpdate} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ModalEditarInventario;
  