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

// Excel to SQL - Agua (diferentes años)
import ExcelToSqlAgua2023 from './pages/ExcelToSql/ExcelToSqlAgua2023'
import ExcelToSqlAgua2024 from './pages/ExcelToSql/ExcelToSqlAgua2024'
import ExcelToSqlAgua2025 from './pages/ExcelToSql/ExcelToSqlAgua2025'

// Excel to SQL - Gas (diferentes años)
import ExcelToSqlGas2023 from './pages/ExcelToSql/ExcelToSqlGas2023'
import ExcelToSqlGas2024 from './pages/ExcelToSql/ExcelToSqlGas2024'
import ExcelToSqlGas2025 from './pages/ExcelToSql/ExcelToSqlGas2025'

// Excel to SQL - PTAR
import ExcelToSqlPTAR from './pages/ExcelToSql/ExcelToSqlPTAR'

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
        {/* Excel to SQL - Agua */}
        <Route path="/excel-to-sql" element={<ExcelToSqlPage />} /> {/* Mantener compatibilidad - redirige a 2024 */}
        <Route path="/excel-to-sql/agua/2023" element={<ExcelToSqlAgua2023 />} />
        <Route path="/excel-to-sql/agua/2024" element={<ExcelToSqlAgua2024 />} />
        <Route path="/excel-to-sql/agua/2025" element={<ExcelToSqlAgua2025 />} />
        
        {/* Excel to SQL - Gas */}
        <Route path="/excel-to-sql/gas/2023" element={<ExcelToSqlGas2023 />} />
        <Route path="/excel-to-sql/gas/2024" element={<ExcelToSqlGas2024 />} />
        <Route path="/excel-to-sql/gas/2025" element={<ExcelToSqlGas2025 />} />
        
        {/* Excel to SQL - PTAR */}
        <Route path="/excel-to-sql/ptar" element={<ExcelToSqlPTAR />} />
        
        <Route path="/csv-to-sql-daily" element={<CsvToSqlDailyPage />} />
        <Route path="/lecturas-diarias" element={<DailyReadingsPage />} />

        {/* Ruta de administradores - TEMPORALMENTE DESACTIVADA - Todos pueden acceder */}
        <Route path="/correos" element={<CorreosPage />} />
      </Routes>
    // </AuthProvider>
  );
}

export default App
