import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import ErrorPage from '../pages/ErrorPage'; // 👈
import ProtectedRoute from '../auth/ProtectedRoute';
import AdminDashboard from '../pages/admin/AdminDashboard';
import Unauthorized from '../pages/Unauthorized';
import AdminRoute from '../auth/AdminRoute'; // 👈

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* ✅ Ruta para cualquier otro path */}
        <Route path="*" element={<ErrorPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
