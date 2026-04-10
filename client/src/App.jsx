import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CitasPage from './pages/CitasPage';
import MedicamentosPage from './pages/MedicamentosPage';
import VacunasPage from './pages/VacunasPage';
import FamiliaresPage from './pages/FamiliaresPage';
import AlertasPage from './pages/AlertasPage';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="citas" element={<CitasPage />} />
          <Route path="medicamentos" element={<MedicamentosPage />} />
          <Route path="vacunas" element={<VacunasPage />} />
          <Route path="familiares" element={<FamiliaresPage />} />
          <Route path="alertas" element={<AlertasPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
