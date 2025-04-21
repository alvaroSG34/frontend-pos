import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { showError } from '../../../utils/toastUtils';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

interface Venta {
  id_venta: number;
  numero_factura: string;
  fecha_venta: string;
  total: number;
  metodo_pago: string;
  estado: string;
  cliente: string;
}

interface Categoria {
  id: number;
  name: string;
}



const Reportes = () => {
  const [loading, setLoading] = useState(false);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cliente, setCliente] = useState('');
  const [fechaInicio, setFechaInicio] = useState<Dayjs | null>(null);
  const [fechaFin, setFechaFin] = useState<Dayjs | null>(null);
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchCategorias = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/categories`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCategorias(res.data);
    } catch {
      showError('Error al cargar categorías');
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Ventas', 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [['Nº Factura', 'Cliente', 'Fecha', 'Método', 'Total', 'Estado']],
      body: ventas.map((v) => [
        v.numero_factura,
        v.cliente,
        dayjs(v.fecha_venta).format('DD/MM/YYYY'),
        v.metodo_pago,
        `$${v.total.toFixed(2)}`,
        v.estado,
      ]),
    });

    doc.save('reporte_ventas.pdf');
  };

  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      ventas.map((v) => ({
        'Nº Factura': v.numero_factura,
        Cliente: v.cliente,
        Fecha: dayjs(v.fecha_venta).format('DD/MM/YYYY'),
        'Método de Pago': v.metodo_pago,
        Total: v.total,
        Estado: v.estado,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ReporteVentas');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'reporte_ventas.xlsx');
  };


  const fetchReportes = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (cliente) params.cliente = cliente;
      if (fechaInicio) params.fecha_inicio = fechaInicio.format('YYYY-MM-DD');
      if (fechaFin) params.fecha_fin = fechaFin.format('YYYY-MM-DD');
      if (categoria) params.categoria = categoria;

      const res = await axios.get(`${API_URL}/api/v1/sales/reportes`, {
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const ordenadas = res.data.sort((a: Venta, b: Venta) => {
        return new Date(b.fecha_venta).getTime() - new Date(a.fecha_venta).getTime();
      });
      setVentas(ordenadas);
    } catch {
      showError('Error al filtrar reportes');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCategorias();
    fetchReportes(); // Carga inicial sin filtros
  }, []);

  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant="h5" gutterBottom>
        Reportes de Ventas
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
        <TextField
          label="Cliente"
          variant="outlined"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          size="small"
        />
        <DatePicker
            label="Fecha desde"
            value={fechaInicio}
            onChange={(newValue) => setFechaInicio(newValue)}
            format="DD/MM/YYYY"
        />
        <DatePicker
          label="Fecha hasta"
          value={fechaFin}
          onChange={(newValue) => setFechaFin(newValue)}
          format="DD/MM/YYYY"
        />
        <Box>
          <label htmlFor="categoria">Categoría</label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={{
              minWidth: 180,
              height: 40,
              padding: '6px 8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              marginTop: '4px',
              backgroundColor: '#fff',
              color: '#000', // texto negro
            }}
          >
            <option value="" style={{ color: '#000' }}>Todas</option>

            {categorias.map((cat) => {
              console.log('cat:', cat); // 👈 mira qué tiene realmente
              return (
                <option key={cat.id} value={cat.id} style={{ color: '#000' }}>
                  {cat.name}
                </option>
              );
            })}
          </select>
        </Box>
        <Button variant="contained" onClick={fetchReportes}>
          Filtrar
        </Button>
        <Box display="flex" gap={2} mt={2}>
          <Button variant="outlined" onClick={exportarPDF}>
            Exportar PDF
          </Button>
          <Button variant="outlined" onClick={exportarExcel}>
            Exportar Excel
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nº Factura</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Método</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ventas.map((venta) => (
                <TableRow key={venta.id_venta}>
                  <TableCell>{venta.numero_factura}</TableCell>
                  <TableCell>{venta.cliente}</TableCell>
                  <TableCell>
                  {dayjs(venta.fecha_venta).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>{venta.metodo_pago}</TableCell>
                  <TableCell align="right">${venta.total.toFixed(2)}</TableCell>
                  <TableCell>{venta.estado}</TableCell>
                </TableRow>
              ))}
              {ventas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No hay resultados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Reportes;
