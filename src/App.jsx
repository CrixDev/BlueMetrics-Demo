import { Routes, Route } from 'react-router'
// import { AuthProvider } from './contexts/AuthContext'
// import ProtectedRoute from './components/ProtectedRoute'
// import AdminRoute from './components/AdminRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ConsumptionPage from './pages/ConsumptionPage'
import WaterBalancePage from './pages/WaterBalancePage'
import WellsPage from './pages/WellsPage'
import WellDetailPage from './pages/WellDetailPage'
import PTARPage from './pages/PTARPage'
import AddDataPage from './pages/AddDataPage'
import AddWeeklyReadingsPage from './pages/AddWeeklyReadingsPage'
import GasConsumptionPage from './pages/GasConsumptionPage'
import AddWeeklyGasReadingsPage from './pages/AddWeeklyGasReadingsPage'
import AlertsPage from './pages/AlertsPage'
import PredictionsPage from './pages/PredictionsPage'
import ContactPage from './pages/ContactPage'
import ConfirmationPage from './pages/ConfirmationPage'
import CorreosPage from './pages/CorreosPage'
import ExcelToSqlPage from './pages/ExcelToSqlPage'
import CsvToSqlDailyPage from './pages/CsvToSqlDailyPage'
import DailyReadingsPage from './pages/DailyReadingsPage'
import AnalysisSectionPage from './pages/AnalysisSectionPage'


function App() {
  return (
    // <AuthProvider>
      <Routes>
        {/* Rutas públicas - accesibles sin autenticación */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/confirmacion" element={<ConfirmationPage />} />

        {/* Rutas protegidas - TEMPORALMENTE DESACTIVADAS - Todos pueden acceder */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/consumo" element={<ConsumptionPage />} />
        <Route path="/balance" element={<WaterBalancePage />} />
        <Route path="/pozos" element={<WellsPage />} />
        <Route path="/pozos/:id" element={<WellDetailPage />} />
        <Route path="/ptar" element={<PTARPage />} />
        <Route path="/agregar-datos" element={<AddDataPage />} />
        <Route path="/agregar-lecturas" element={<AddWeeklyReadingsPage />} />
        <Route path="/consumo-gas" element={<GasConsumptionPage />} />
        <Route path="/agregar-lecturas-gas" element={<AddWeeklyGasReadingsPage />} />
        <Route path="/alertas" element={<AlertsPage />} />
        <Route path="/predicciones" element={<PredictionsPage />} />
        <Route path="/analisis" element={<AnalysisSectionPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/excel-to-sql" element={<ExcelToSqlPage />} />
        <Route path="/csv-to-sql-daily" element={<CsvToSqlDailyPage />} />
        <Route path="/lecturas-diarias" element={<DailyReadingsPage />} />

        {/* Ruta de administradores - TEMPORALMENTE DESACTIVADA - Todos pueden acceder */}
        <Route path="/correos" element={<CorreosPage />} />
      </Routes>
    // </AuthProvider>
  );
}

export default App
