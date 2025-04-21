import { useEffect, useState } from 'react';
import axios from 'axios';
import ModalCrearCategoria from './ModalCrearCategoria';
import ModalEditarCategoria from './ModalEditarCategoria';
import { showSuccess, showError } from '../../../utils/toastUtils';

interface Categoria {
  id: number;
  name: string;
  description?: string;
}

const Categorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [openEditar, setOpenEditar] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchCategorias = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/categories`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCategorias(res.data);
    } catch (error) {
      console.error('Error al obtener categorías', error);
    } finally {
      setLoading(false);
    }
  };

  const agregarCategoria = async (nombre: string, descripcion: string) => {
    try {
      await axios.post(
        `${API_URL}/api/v1/categories`,
        { name: nombre, description: descripcion },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchCategorias();
      showSuccess('Categoría creada');

    } catch (error) {
      showError('No se pudo crear la categoría');
    }
  };

  const editarCategoria = async (id: number, nombre: string, descripcion: string) => {
    try {
      await axios.put(
        `${API_URL}/api/v1/categories/${id}`,
        { name: nombre, description: descripcion },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchCategorias();
      showSuccess('Categoría editada'); 
    } catch (error) {
      showError('No se pudo editar la categoría');
    }
  };

  const eliminarCategoria = async (id: number) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      await axios.delete(`${API_URL}/api/v1/categories/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCategorias((prev) => prev.filter((c) => c.id !== id));
     showSuccess('Categoría eliminada');
    } catch (error) {
      showError('No se pudo eliminar la categoría');
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Categorías</h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <button onClick={() => setOpenModal(true)}>Nueva Categoría</button>
      </div>

      <ModalCrearCategoria
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={(nombre, descripcion) => {
          agregarCategoria(nombre, descripcion);
          setOpenModal(false);
        }}
      />
      <ModalEditarCategoria
        open={openEditar}
        onClose={() => setOpenEditar(false)}
        onSave={editarCategoria}
        categoria={categoriaSeleccionada}
      />

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
                <td>
                  <button onClick={() => eliminarCategoria(cat.id)}>Eliminar</button>
                  <button onClick={() => {
                    setCategoriaSeleccionada(cat);
                    setOpenEditar(true);
                  }}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Categorias;
