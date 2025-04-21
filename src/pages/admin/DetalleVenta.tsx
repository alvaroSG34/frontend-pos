import {
    Box,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Container,
    Button,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface Detalle {
    id_producto: number;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
}

const DetalleVenta = () => {
    const { id } = useParams();
    const [detalles, setDetalles] = useState<Detalle[]>([]);
    const [total, setTotal] = useState(0);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchDetalles = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/v1/sales/${id}/detalle/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setDetalles(res.data);
                const suma = res.data.reduce(
                    (acc: number, item: Detalle) => acc + item.subtotal,
                    0
                );
                setTotal(suma);
            } catch (err) {
                console.error('Error al obtener detalles de venta:', err);
            }
        };

        fetchDetalles();
    }, [id]);

    const exportarPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(`Factura de Venta #${id}`, 14, 20);

        autoTable(doc, {
            startY: 30,
            head: [['Producto', 'Cantidad', 'Precio Unitario', 'Subtotal']],
            body: detalles.map((item) => [
                item.nombre,
                item.cantidad,
                `$${item.precio_unitario.toFixed(2)}`,
                `$${item.subtotal.toFixed(2)}`,
            ]),
        });

        const finalY = doc.lastAutoTable?.finalY ?? 30; // fallback si no existe
        doc.text(`Total: $${total.toFixed(2)}`, 140, finalY + 10);
        doc.save(`Factura-${id}.pdf`);
    };

    const exportarExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            detalles.map((item) => ({
                Producto: item.nombre,
                Cantidad: item.cantidad,
                'Precio Unitario': item.precio_unitario,
                Subtotal: item.subtotal,
            }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Factura');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `Factura-${id}.xlsx`);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#f9f9f9',
                px: 2,
                py: 4,
            }}
        >
            <Container maxWidth={false}>
                <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
                    Factura de Venta #{id}
                </Typography>

                <Box
                    sx={{
                        maxWidth: 1200,
                        margin: '0 auto',
                        backgroundColor: '#fff',
                        borderRadius: 3,
                        boxShadow: 3,
                        overflowX: 'auto',
                        p: 3,
                    }}
                >
                    <Typography variant="subtitle1" gutterBottom>
                        Productos vendidos:
                    </Typography>

                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Producto</strong></TableCell>
                                <TableCell align="center"><strong>Cantidad</strong></TableCell>
                                <TableCell align="right"><strong>Precio Unitario</strong></TableCell>
                                <TableCell align="right"><strong>Subtotal</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {detalles.map((item) => (
                                <TableRow key={item.id_producto}>
                                    <TableCell>{item.nombre}</TableCell>
                                    <TableCell align="center">{item.cantidad}</TableCell>
                                    <TableCell align="right">${item.precio_unitario.toFixed(2)}</TableCell>
                                    <TableCell align="right">${item.subtotal.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Typography
                        align="right"
                        variant="h6"
                        sx={{ mt: 3, fontWeight: 'bold', color: 'green' }}
                    >
                        Total: ${total.toFixed(2)}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button variant="outlined" color="primary" onClick={exportarPDF}>
                            Exportar PDF
                        </Button>
                        <Button variant="outlined" color="success" onClick={exportarExcel}>
                            Exportar Excel
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default DetalleVenta;
