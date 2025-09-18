import { Routes, Route } from 'react-router'
import { AuthProvider } from './contexts/AuthContext'
// import ProtectedRoute from './components/ProtectedRoute' // Temporalmente desactivado
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ConsumptionPage from './pages/ConsumptionPage'
import WaterBalancePage from './pages/WaterBalancePage'
import WellsPage from './pages/WellsPage'
import WellDetailPage from './pages/WellDetailPage'
import AddDataPage from './pages/AddDataPage'
import AlertsPage from './pages/AlertsPage'
import PredictionsPage from './pages/PredictionsPage'
import ContactPage from './pages/ContactPage'
import FormPage from './pages/FormPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Rutas temporalmente sin protección para desarrollo */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/consumo" element={<ConsumptionPage />} />
        <Route path="/balance" element={<WaterBalancePage />} />
        <Route path="/pozos" element={<WellsPage />} />
        <Route path="/pozos/:id" element={<WellDetailPage />} />
        <Route path="/agregar-datos" element={<AddDataPage />} />
        <Route path="/alertas" element={<AlertsPage />} />
        <Route path="/predicciones" element={<PredictionsPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/formulario" element={<FormPage />} />
       
      </Routes>
    </AuthProvider>
  );
}

export default App
