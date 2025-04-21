import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (id: number, nombre: string, descripcion: string) => void;
  categoria: { id: number; name: string; description?: string } | null;
}

const ModalEditarCategoria: React.FC<Props> = ({ open, onClose, onSave, categoria }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (categoria) {
      setNombre(categoria.name);
      setDescripcion(categoria.description || '');
    }
  }, [categoria]);

  const handleSave = () => {
    if (categoria) onSave(categoria.id, nombre, descripcion);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Categoría</DialogTitle>
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
        <Button onClick={handleSave} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEditarCategoria;
