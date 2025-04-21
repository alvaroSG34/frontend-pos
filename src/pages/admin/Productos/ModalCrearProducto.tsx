import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Switch, FormControlLabel,
    MenuItem, Select, InputLabel, FormControl
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import axios from 'axios';
  import { showSuccess, showError } from '../../../utils/toastUtils';
  
  interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
  }
  
  interface Categoria {
    id: number;
    name: string;
  }
  
  const ModalCrearProducto = ({ open, onClose, onCreated }: Props) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precioCompra, setPrecioCompra] = useState(0);
    const [precioVenta, setPrecioVenta] = useState(0);
    const [imagen, setImagen] = useState('');
    const [estado, setEstado] = useState(true);
    const [idCategoria, setIdCategoria] = useState<number | ''>('');
    const [categorias, setCategorias] = useState<Categoria[]>([]);
  
    const API_URL = import.meta.env.VITE_API_URL;
  
    const fetchCategorias = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/categories/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCategorias(res.data);
      } catch {
        showError('Error al cargar categorías');
      }
    };
  
    const handleSubmit = async () => {
      try {
        await axios.post(`${API_URL}/api/v1/products/`, {
          nombre, descripcion, precio_compra: precioCompra,
          precio_venta: precioVenta, imagen, estado, id_categoria: idCategoria
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        showSuccess('Producto creado');
        onCreated();
        onClose();
        resetForm();
      } catch {
        showError('No se pudo crear el producto');
      }
    };
  
    const resetForm = () => {
      setNombre('');
      setDescripcion('');
      setPrecioCompra(0);
      setPrecioVenta(0);
      setImagen('');
      setEstado(true);
      setIdCategoria('');
    };
  
    useEffect(() => {
      if (open) fetchCategorias();
    }, [open]);
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Nuevo Producto</DialogTitle>
        <DialogContent>
          <TextField label="Nombre" fullWidth margin="normal" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <TextField label="Descripción" fullWidth margin="normal" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          <TextField label="Precio Compra" type="number" fullWidth margin="normal" value={precioCompra} onChange={(e) => setPrecioCompra(Number(e.target.value))} />
          <TextField label="Precio Venta" type="number" fullWidth margin="normal" value={precioVenta} onChange={(e) => setPrecioVenta(Number(e.target.value))} />
          <TextField label="Imagen (URL)" fullWidth margin="normal" value={imagen} onChange={(e) => setImagen(e.target.value)} />
  
          <FormControl fullWidth margin="normal">
            <InputLabel>Categoría</InputLabel>
            <Select value={idCategoria} onChange={(e) => setIdCategoria(Number(e.target.value))} label="Categoría">
              {categorias.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
  
          <FormControlLabel
            control={<Switch checked={estado} onChange={(e) => setEstado(e.target.checked)} />}
            label="Activo"
          />
        </DialogContent>
  
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ModalCrearProducto;
  