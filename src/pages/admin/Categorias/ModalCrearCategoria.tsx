import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

interface ModalCrearCategoriaProps {
  open: boolean;
  onClose: () => void;
  onCreate: (nombre: string, descripcion: string) => void;
}

const ModalCrearCategoria: React.FC<ModalCrearCategoriaProps> = ({ open, onClose, onCreate }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = () => {
    onCreate(nombre, descripcion);
    setNombre('');
    setDescripcion('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Nueva Categoría</DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre"
          fullWidth
          margin="normal"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <TextField
          label="Descripción"
          fullWidth
          margin="normal"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCrearCategoria;
