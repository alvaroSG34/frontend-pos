import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import Reportes from '../pages/admin/Reportes/Reportes';
import DetalleVenta from '../pages/admin/DetalleVenta';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="reportes" element={<Reportes />} />
      <Route path="ventas/:id" element={<DetalleVenta />} />
    </Routes>
  );
};

export default AdminRoutes;
